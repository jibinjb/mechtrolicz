import React, { useState, useMemo } from 'react';
import {
  Zap,
  Users,
  Shield,
  Sparkles,
  Heart,
  X,
  RotateCcw,
  MessageSquare,
  Calendar,
  Check,
  ChevronRight,
  Flame,
  Filter,
  Info,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { calculateMatchScore } from '../services/matchingEngine';
import { soundEffects } from '../services/soundEffects';
import { MatchScoreModal } from '../components/matching/MatchScoreModal';
import { StudentProfileModal } from '../components/students/StudentProfileModal';
import { TeamDetailsModal } from '../components/teams/TeamDetailsModal';
import { Student, Team, MatchBreakdown } from '../types';

interface SpeedMatchPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreateTeam: () => void;
}

export const SpeedMatchPage: React.FC<SpeedMatchPageProps> = ({
  onNavigate,
  onOpenCreateTeam,
}) => {
  const {
    currentUser,
    students,
    teams,
    events,
    sendTeamInvitation,
    sendJoinRequest,
    createOrOpenDirectChat,
  } = useApp();

  // Mode: 'students' (team leader seeks students) or 'teams' (solo student seeks squads)
  const [matchMode, setMatchMode] = useState<'students' | 'teams'>('students');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(60);

  // Deck state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [passedCount, setPassedCount] = useState<number>(0);

  // Modals
  const [inspectBreakdown, setInspectBreakdown] = useState<MatchBreakdown | null>(null);
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);
  const [inspectTeam, setInspectTeam] = useState<Team | null>(null);
  const [matchCelebration, setMatchCelebration] = useState<{
    name: string;
    avatar?: string;
    score: number;
    type: 'student' | 'team';
  } | null>(null);

  // User's lead team
  const myLeadTeam = useMemo(() => {
    return teams.find((t) => t.ownerId === currentUser.id) || teams[0];
  }, [teams, currentUser]);

  // Candidates list (Students)
  const candidateStudents = useMemo(() => {
    const list = students.filter((s) => s.id !== currentUser.id);
    return list
      .map((student) => {
        const breakdown = calculateMatchScore(student, myLeadTeam);
        return { student, breakdown };
      })
      .filter((item) => {
        if (minMatchThreshold && item.breakdown.finalScore < minMatchThreshold) return false;
        return true;
      })
      .sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);
  }, [students, currentUser, myLeadTeam, minMatchThreshold]);

  // Candidate Squads (Teams)
  const candidateTeams = useMemo(() => {
    return teams
      .filter((t) => t.ownerId !== currentUser.id && t.status === 'recruiting')
      .map((team) => {
        const breakdown = calculateMatchScore(currentUser, team);
        return { team, breakdown };
      })
      .filter((item) => {
        if (selectedEventId && item.team.eventId !== selectedEventId) return false;
        if (minMatchThreshold && item.breakdown.finalScore < minMatchThreshold) return false;
        return true;
      })
      .sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);
  }, [teams, currentUser, selectedEventId, minMatchThreshold]);

  const activeDeckLength =
    matchMode === 'students' ? candidateStudents.length : candidateTeams.length;
  const currentStudentItem =
    matchMode === 'students' ? candidateStudents[currentIndex] : null;
  const currentTeamItem = matchMode === 'teams' ? candidateTeams[currentIndex] : null;

  // Actions
  const handlePass = () => {
    if (currentIndex >= activeDeckLength) return;
    soundEffects.playPass();
    setSwipeDirection('left');
    setTimeout(() => {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex((prev) => prev + 1);
      setPassedCount((prev) => prev + 1);
      setSwipeDirection(null);
    }, 250);
  };

  const handleMatch = () => {
    if (currentIndex >= activeDeckLength) return;

    soundEffects.playSquadUp();
    setSwipeDirection('right');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d15', '#fbbf24', '#34d399', '#6366f1'],
    });

    if (matchMode === 'students' && currentStudentItem) {
      sendTeamInvitation(
        myLeadTeam.id,
        currentStudentItem.student.id,
        `Hey ${currentStudentItem.student.fullName.split(' ')[0]}! We saw our ${currentStudentItem.breakdown.finalScore}% match on Speed Match and would love to have you on ${myLeadTeam.name}!`
      );
      setMatchCelebration({
        name: currentStudentItem.student.fullName,
        avatar: currentStudentItem.student.profileImage,
        score: currentStudentItem.breakdown.finalScore,
        type: 'student',
      });
    } else if (matchMode === 'teams' && currentTeamItem) {
      sendJoinRequest(
        currentTeamItem.team.id,
        `Hi! I discovered ${currentTeamItem.team.name} via Speed Match with a ${currentTeamItem.breakdown.finalScore}% compatibility score. I'd love to squad up!`
      );
      setMatchCelebration({
        name: currentTeamItem.team.name,
        avatar: currentTeamItem.team.logoUrl,
        score: currentTeamItem.breakdown.finalScore,
        type: 'team',
      });
    }

    setTimeout(() => {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex((prev) => prev + 1);
      setMatchedCount((prev) => prev + 1);
      setSwipeDirection(null);
    }, 250);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    soundEffects.playButton();
    const lastIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIndex);
  };

  const handleResetDeck = () => {
    soundEffects.playToggle(true);
    setCurrentIndex(0);
    setHistory([]);
  };

  const handleDirectChat = (student: Student) => {
    createOrOpenDirectChat(student);
    onNavigate('chat');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Top Banner with Pulse Accent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-[12px] font-bold text-[#ff4d15] mb-2 shadow-xs border border-white/80 dark:border-white/10">
            <Flame className="w-4 h-4 fill-[#ff4d15] animate-bounce" />
            <span>Speed Match Arena</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15] animate-ping" />
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
              48H Rush
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-moara font-bold text-slate-900 dark:text-white tracking-tight">
            Find Your Match in 60 Seconds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rapid Two-Way Hackathon Matching. Review candidates, examine synergies, and dispatch 1-click squad invites.
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex p-1 rounded-full liquid-glass border border-slate-200 dark:border-white/10 text-xs font-bold self-start md:self-auto shadow-sm">
          <button
            onClick={() => {
              setMatchMode('students');
              handleResetDeck();
            }}
            className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
              matchMode === 'students'
                ? 'bg-[#ff4d15] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Recruit Students</span>
          </button>
          <button
            onClick={() => {
              setMatchMode('teams');
              handleResetDeck();
            }}
            className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
              matchMode === 'teams'
                ? 'bg-[#ff4d15] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Find a Squad</span>
          </button>
        </div>
      </div>

      {/* Filter and Quick Settings Bar */}
      <div className="p-4 rounded-2xl liquid-glass border border-white dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#ff4d15]" />
            <span>Min Synergy:</span>
          </div>
          {[50, 70, 80, 90].map((score) => (
            <button
              key={score}
              onClick={() => {
                setMinMatchThreshold(score);
                handleResetDeck();
              }}
              className={`px-3 py-1 rounded-full font-bold transition ${
                minMatchThreshold === score
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/20'
              }`}
            >
              {score}%+
            </button>
          ))}
        </div>

        {matchMode === 'teams' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Hackathon:</span>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                handleResetDeck();
              }}
              className="bg-white/80 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-white/10 focus:outline-none"
            >
              <option value="">All Competitions</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Counter Stats */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            Card <strong className="text-slate-900 dark:text-white font-bold">{Math.min(currentIndex + 1, activeDeckLength)}</strong> of {activeDeckLength}
          </span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {matchedCount} Connected
          </span>
        </div>
      </div>

      {/* Main Swipeable Deck Arena */}
      <div className="relative min-h-[500px] sm:min-h-[540px] flex items-center justify-center">
        {currentIndex >= activeDeckLength ? (
          /* Empty Deck State */
          <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl liquid-glass border border-white dark:border-white/10 text-center space-y-4 shadow-xl animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#ff4d15] flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-moara font-bold text-slate-900 dark:text-white">
              You're All Caught Up!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              You reviewed all candidates in this batch. You sent{' '}
              <strong className="text-[#ff4d15]">{matchedCount} invitations</strong>!
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetDeck}
                className="px-5 py-2.5 rounded-full text-xs font-bold liquid-glass border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 flex items-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Deck</span>
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="px-5 py-2.5 rounded-full text-xs font-bold btn-primary-coral flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Messages</span>
              </button>
            </div>
          </div>
        ) : (
          /* Stacked Cards Layout */
          <div className="relative w-full max-w-lg">
            {/* Background Layer 2 (Peek card) */}
            {currentIndex + 1 < activeDeckLength && (
              <div className="absolute inset-0 top-3 scale-[0.96] rounded-3xl liquid-glass border border-white/60 dark:border-white/5 opacity-50 blur-[0.5px] pointer-events-none -z-10 shadow-lg" />
            )}

            {/* Background Layer 3 (Deep card) */}
            {currentIndex + 2 < activeDeckLength && (
              <div className="absolute inset-0 top-6 scale-[0.92] rounded-3xl liquid-glass border border-white/40 dark:border-white/5 opacity-25 blur-[1px] pointer-events-none -z-20 shadow-md" />
            )}

            {/* Active Front Card */}
            <div
              className={`w-full rounded-3xl liquid-glass dark:bg-slate-900/90 border border-white dark:border-white/15 p-6 sm:p-8 shadow-2xl transition-all duration-300 relative overflow-hidden ${
                swipeDirection === 'left'
                  ? '-translate-x-32 rotate-[-8deg] opacity-0'
                  : swipeDirection === 'right'
                  ? 'translate-x-32 rotate-[8deg] opacity-0'
                  : 'translate-x-0 rotate-0 opacity-100'
              }`}
            >
              {matchMode === 'students' && currentStudentItem ? (
                /* Student Candidate Card */
                <div className="space-y-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-white/20 shadow-md shrink-0">
                          <img
                            src={currentStudentItem.student.profileImage}
                            alt={currentStudentItem.student.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {currentStudentItem.student.isVerified && (
                          <span
                            title="Verified College Student"
                            className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-bold font-moara text-slate-900 dark:text-white">
                            {currentStudentItem.student.fullName}
                          </h2>
                        </div>
                        <span className="text-xs text-[#ff4d15] font-bold block font-uber">
                          {currentStudentItem.student.preferredRoles[0] || 'Full Stack Builder'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-uber block mt-0.5">
                          {currentStudentItem.student.collegeName} • Year {currentStudentItem.student.year}
                        </span>
                      </div>
                    </div>

                    {/* Compatibility Score Radial Badge */}
                    <div
                      onClick={() => setInspectBreakdown(currentStudentItem.breakdown)}
                      className="cursor-pointer group flex flex-col items-center shrink-0"
                      title="Inspect Two-Way Match Breakdown"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-[#ff4d15] text-white flex flex-col items-center justify-center shadow-lg shadow-[#ff4d15]/30 group-hover:scale-105 transition">
                        <span className="text-lg sm:text-xl font-extrabold font-uber leading-none">
                          {currentStudentItem.breakdown.finalScore}%
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">
                          Synergy
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-[#ff4d15] mt-1 font-semibold flex items-center gap-0.5">
                        Details <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>

                  {/* AI Synergy Verdict Pill */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 text-xs">
                    <span className="font-bold text-[#ff4d15] flex items-center gap-1.5 uppercase text-[10px] tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Synergy Verdict
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {currentStudentItem.breakdown.missingSkills.length === 0
                        ? `Exceptional match! ${currentStudentItem.student.fullName.split(' ')[0]} provides 100% of your missing team requirements.`
                        : `Provides strong proficiency in ${currentStudentItem.breakdown.matchedSkills.slice(0, 3).join(', ')}. Strong complement for hackathon sprint!`}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-2 font-uber">
                      Technical Superpowers
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentStudentItem.student.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1"
                        >
                          <span>{sk.skillName}</span>
                          <span className="text-[10px] text-[#ff4d15] font-bold capitalize opacity-80">
                            • {sk.proficiency}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1 font-uber">
                      Builder Bio
                    </label>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white/60 dark:bg-white/5 p-3 rounded-2xl border border-slate-200/60 dark:border-white/5">
                      "{currentStudentItem.student.bio || 'Passionate student builder seeking ambitious hackathon squad.'}"
                    </p>
                  </div>
                </div>
              ) : currentTeamItem ? (
                /* Team Candidate Card */
                <div className="space-y-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-white/20 shadow-md shrink-0 flex items-center justify-center font-bold text-xl text-[#ff4d15]">
                        {currentTeamItem.team.logoUrl ? (
                          <img
                            src={currentTeamItem.team.logoUrl}
                            alt={currentTeamItem.team.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          currentTeamItem.team.name.slice(0, 2).toUpperCase()
                        )}
                      </div>

                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-moara text-slate-900 dark:text-white">
                          {currentTeamItem.team.name}
                        </h2>
                        {currentTeamItem.team.eventName ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#ff4d15] font-semibold mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {currentTeamItem.team.eventName}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-uber">
                            Independent Project
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-uber block mt-0.5">
                          Led by {currentTeamItem.team.ownerName} • {currentTeamItem.team.members.length}/{currentTeamItem.team.maxMembers} Members
                        </span>
                      </div>
                    </div>

                    {/* Compatibility Score Radial Badge */}
                    <div
                      onClick={() => setInspectBreakdown(currentTeamItem.breakdown)}
                      className="cursor-pointer group flex flex-col items-center shrink-0"
                      title="Inspect Two-Way Match Breakdown"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-[#ff4d15] text-white flex flex-col items-center justify-center shadow-lg shadow-[#ff4d15]/30 group-hover:scale-105 transition">
                        <span className="text-lg sm:text-xl font-extrabold font-uber leading-none">
                          {currentTeamItem.breakdown.finalScore}%
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">
                          Synergy
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-[#ff4d15] mt-1 font-semibold flex items-center gap-0.5">
                        Details <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>

                  {/* AI Synergy Verdict Pill */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 text-xs">
                    <span className="font-bold text-[#ff4d15] flex items-center gap-1.5 uppercase text-[10px] tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Squad Mission
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {currentTeamItem.team.description}
                    </p>
                  </div>

                  {/* Required Skills Grid */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-2 font-uber">
                      Looking for Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentTeamItem.team.requiredSkills.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          {req.skillName} ({req.requirementType})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons Row */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                {/* Undo Button */}
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="p-3.5 rounded-full liquid-glass border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition hover:scale-105 cursor-pointer"
                  title="Undo last action"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Main Pass Button (X) */}
                <button
                  onClick={handlePass}
                  className="flex-1 py-3.5 px-4 rounded-2xl liquid-glass border border-slate-300/80 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-900 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:scale-[1.02] shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5 text-rose-500" />
                  <span>Pass</span>
                </button>

                {/* Inspect Profile / Team Button */}
                <button
                  onClick={() => {
                    if (matchMode === 'students' && currentStudentItem) {
                      setInspectStudent(currentStudentItem.student);
                    } else if (matchMode === 'teams' && currentTeamItem) {
                      setInspectTeam(currentTeamItem.team);
                    }
                  }}
                  className="p-3.5 rounded-full liquid-glass border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-[#ff4d15] hover:bg-orange-50/50 dark:hover:bg-orange-950/30 transition hover:scale-105 cursor-pointer"
                  title="Inspect Full Profile"
                >
                  <Info className="w-5 h-5" />
                </button>

                {/* Quick Chat Button (Only for Students mode) */}
                {matchMode === 'students' && currentStudentItem && (
                  <button
                    onClick={() => handleDirectChat(currentStudentItem.student)}
                    className="p-3.5 rounded-full liquid-glass border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition hover:scale-105 cursor-pointer"
                    title="Send Quick Direct Message"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                )}

                {/* Main Squad Up Button (Heart / Rocket) */}
                <button
                  onClick={handleMatch}
                  className="flex-1 py-3.5 px-4 rounded-2xl btn-primary-coral font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:scale-[1.03] shadow-lg shadow-[#ff4d15]/30 text-white cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Squad Up!</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match Celebration Dialog Overlay */}
      {matchCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in font-uber">
          <div className="relative w-full max-w-sm liquid-glass dark:bg-slate-900/95 rounded-3xl border border-white dark:border-white/15 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff4d15] to-amber-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-[#ff4d15]/40 animate-bounce">
              <Heart className="w-8 h-8 fill-white" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#ff4d15] tracking-widest block">
                It's a Match! 🎉
              </span>
              <h3 className="text-2xl font-bold font-moara text-slate-900 dark:text-white mt-1">
                {matchCelebration.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Invitation dispatched with a {matchCelebration.score}% compatibility score.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMatchCelebration(null);
                  onNavigate('chat');
                }}
                className="w-full py-2.5 rounded-xl btn-primary-coral text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                Send Intro Message &rarr;
              </button>
              <button
                onClick={() => setMatchCelebration(null)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
              >
                Keep Speed Matching
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Modals */}
      {inspectBreakdown && (
        <MatchScoreModal
          isOpen={true}
          onClose={() => setInspectBreakdown(null)}
          breakdown={inspectBreakdown}
          title="Speed Match Compatibility Breakdown"
        />
      )}

      {inspectStudent && (
        <StudentProfileModal
          student={inspectStudent}
          onClose={() => setInspectStudent(null)}
          onOpenChat={handleDirectChat}
        />
      )}

      {inspectTeam && (
        <TeamDetailsModal
          team={inspectTeam}
          onClose={() => setInspectTeam(null)}
        />
      )}
    </div>
  );
};
