import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  Sparkles,
  Zap,
  Target,
  Layers,
  Clock,
  Mic,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Users,
  Award,
  BookOpen,
  Send,
  Sliders,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  HACKATHON_TRACKS,
  INITIAL_HACKATHON_IDEAS,
  HackathonIdea,
} from '../data/ideaLabData';
import confetti from 'canvas-confetti';

interface IdeaLabPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreateTeam?: () => void;
}

export const IdeaLabPage: React.FC<IdeaLabPageProps> = ({
  onNavigate,
  onOpenCreateTeam,
}) => {
  const { currentUser, teams, students, createProject, showToast } = useApp();

  const [ideas, setIdeas] = useState<HackathonIdea[]>(INITIAL_HACKATHON_IDEAS);
  const [selectedTrack, setSelectedTrack] = useState<string>('All Tracks');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeIdea, setActiveIdea] = useState<HackathonIdea | null>(null);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);
  const [selectedSquadId, setSelectedSquadId] = useState<string>('my-skills');

  // Compute available skills from the selected squad or user
  const activeSquadSkills = useMemo(() => {
    if (selectedSquadId === 'my-skills') {
      return currentUser.skills.map((s) => s.skillName);
    }
    const team = teams.find((t) => t.id === selectedSquadId);
    if (team) {
      const skillSet = new Set<string>();
      team.members.forEach((m) => {
        m.skills?.forEach((s) => skillSet.add(s.skillName));
      });
      team.requiredSkills?.forEach((r) => skillSet.add(r.skillName));
      return Array.from(skillSet);
    }
    return currentUser.skills.map((s) => s.skillName);
  }, [selectedSquadId, currentUser, teams]);

  // Filtered Ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchTrack =
        selectedTrack === 'All Tracks' || idea.track === selectedTrack;
      const matchDiff =
        selectedDifficulty === 'All' || idea.difficulty === selectedDifficulty;
      const matchSearch =
        !searchQuery ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.recommendedSkills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchTrack && matchDiff && matchSearch;
    });
  }, [ideas, selectedTrack, selectedDifficulty, searchQuery]);

  // AI Generation simulation based on input keywords and team skills
  const handleGenerateAIBlueprint = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim()) {
      showToast('Enter a Prompt', 'Please describe your idea, problem, or constraints.', 'warning');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const promptLower = customPrompt.toLowerCase();
      let track: HackathonIdea['track'] = 'Campus & EdTech';
      if (promptLower.includes('ai') || promptLower.includes('model') || promptLower.includes('agent')) {
        track = 'AI & Automation';
      } else if (promptLower.includes('health') || promptLower.includes('hospital') || promptLower.includes('patient') || promptLower.includes('doctor')) {
        track = 'Health & MedTech';
      } else if (promptLower.includes('finance') || promptLower.includes('crypto') || promptLower.includes('money') || promptLower.includes('payment') || promptLower.includes('grant')) {
        track = 'FinTech & Web3';
      } else if (promptLower.includes('iot') || promptLower.includes('hardware') || promptLower.includes('green') || promptLower.includes('energy') || promptLower.includes('solar')) {
        track = 'Green & IoT';
      } else if (promptLower.includes('security') || promptLower.includes('auth') || promptLower.includes('hack') || promptLower.includes('trust')) {
        track = 'Cyber & Trust';
      }

      const cleanTitle = customPrompt.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const newGeneratedIdea: HackathonIdea = {
        id: `idea-custom-${Date.now()}`,
        title: `${cleanTitle} — Smart Hackathon Prototype`,
        tagline: `An intelligent platform designed around: "${customPrompt}" built to solve real college student pain points with modern AI tooling.`,
        track,
        difficulty: 'Intermediate',
        innovationScore: Math.floor(Math.random() * 8) + 92,
        feasibilityScore: Math.floor(Math.random() * 7) + 91,
        judgeAppeal: Math.floor(Math.random() * 8) + 92,
        targetPrize: 'Track Grand Prize ($3,000 + Incubation)',
        problemStatement: `Teams and users regularly experience friction with "${customPrompt}", resulting in wasted time and lack of real-time coordination.`,
        proposedSolution: `A liquid-glass modern web app combining high-performance client state with AI agent automation tailored to the current squad's skills (${activeSquadSkills.slice(0, 3).join(', ')}).`,
        systemArchitecture: {
          frontend: 'React 19 + Tailwind CSS + Lucide Icons',
          backend: 'Node.js Express / Python FastAPI + Firebase Auth',
          aiOrService: 'Gemini 2.5 Flash API + Embeddings RAG',
          database: 'Cloud Firestore + Local IndexedDB Cache',
          infra: 'Vercel Serverless Edge + Docker Container',
        },
        recommendedSkills: Array.from(new Set([...activeSquadSkills.slice(0, 3), 'React', 'Python', 'Presentation & Pitching'])),
        roleAssignments: [
          {
            role: 'Lead Architect & Core Logic',
            focus: 'Backend API & AI Integration',
            superpower: 'Builds seamless RAG pipeline or algorithm engine',
          },
          {
            role: 'Frontend Experience Designer',
            focus: 'Liquid Glass Responsive UI & Interactive Flows',
            superpower: 'Translates functional requirements into stunning micro-interactions',
          },
          {
            role: 'Pitch & Demo Specialist',
            focus: 'Judge Presentation & Live Video',
            superpower: 'Delivers a flawless 3-minute pitch and live prototype walkthrough',
          },
        ],
        sprintMilestones: [
          {
            phase: 'Hour 00 - 06: Scaffold & Setup',
            hours: 'H0 - H6',
            deliverables: ['Initialize Git repo and environment', 'Define API schemas', 'Wireframe main views'],
          },
          {
            phase: 'Hour 06 - 18: Core Implementation',
            hours: 'H6 - H18',
            deliverables: ['Connect backend endpoints', 'Build interactive UI controls', 'Mock test scenarios'],
          },
          {
            phase: 'Hour 18 - 30: Edge Cases & Polish',
            hours: 'H18 - H30',
            deliverables: ['UI transitions & error toasts', 'Test on mobile browsers', 'Connect live mock data'],
          },
          {
            phase: 'Hour 30 - 36: Submission & Pitch Prep',
            hours: 'H30 - H36',
            deliverables: ['Record 2-min demo walkthrough', 'Build 10-slide deck', 'Rehearse judge Q&A'],
          },
        ],
        pitchDeckScript: {
          hook: `"Judges, imagine spending hours every week dealing with ${customPrompt}. Today, our squad built a solution that solves this in under 3 seconds."`,
          problem: `Current solutions for this problem are either too expensive, overly complicated, or not tailored for college student workflows.`,
          solution: `We built an automated, intelligent platform that turns manual pain points into an instant, elegant workflow.`,
          liveDemo: `"Let me show you live: We input the sample scenario right here, click execute, and observe the immediate real-time output and dashboard analytics."`,
          marketAndImpact: `Scalable across all student colleges and hackathon participants nationwide with zero server overhead.`,
          closingAsk: `We are ready to deploy this to real campus users. Thank you for your feedback!`,
        },
        sampleRepoUrl: 'https://github.com/teamup/custom-hackathon-blueprint',
      };

      setIdeas([newGeneratedIdea, ...ideas]);
      setActiveIdea(newGeneratedIdea);
      setIsGenerating(false);
      setCustomPrompt('');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showToast('Blueprint Generated!', 'AI Hackathon Blueprint & Pitch Deck created successfully.', 'success');
    }, 1200);
  };

  // Publish idea to Project Board
  const handlePublishToProjectBoard = (idea: HackathonIdea) => {
    createProject({
      title: idea.title,
      description: idea.tagline,
      problemStatement: idea.problemStatement,
      proposedSolution: idea.proposedSolution,
      requiredSkills: idea.recommendedSkills,
      requiredRoles: idea.roleAssignments.map((r) => r.role),
      openPositions: 3,
    });
    confetti({ particleCount: 60, spread: 60 });
    showToast('Published to Project Board!', 'Your idea is now live for other college students to discover and apply.', 'success');
  };

  // Copy pitch deck to clipboard
  const handleCopyPitchDeck = (idea: HackathonIdea) => {
    const text = `
🎯 PITCH SCRIPT: ${idea.title}
Track: ${idea.track} | Target Prize: ${idea.targetPrize}

[0:00 - 0:30] THE HOOK:
${idea.pitchDeckScript.hook}

[0:30 - 1:00] THE PROBLEM:
${idea.pitchDeckScript.problem}

[1:00 - 1:45] THE SOLUTION:
${idea.pitchDeckScript.solution}

[1:45 - 2:30] LIVE DEMO WALKTHROUGH:
${idea.pitchDeckScript.liveDemo}

[2:30 - 2:50] MARKET & METRICS:
${idea.pitchDeckScript.marketAndImpact}

[2:50 - 3:00] CLOSING CALL TO ACTION:
${idea.pitchDeckScript.closingAsk}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedPitchId(idea.id);
    setTimeout(() => setCopiedPitchId(null), 2500);
    showToast('Copied to Clipboard!', '3-Minute Elevator Pitch Script is ready for practice.', 'info');
  };

  // Export as Markdown file
  const handleExportMarkdown = (idea: HackathonIdea) => {
    const content = `
# ⚡ ${idea.title}
> **${idea.tagline}**

- **Track**: ${idea.track}
- **Difficulty**: ${idea.difficulty}
- **Innovation Score**: ${idea.innovationScore}/100
- **Feasibility Score**: ${idea.feasibilityScore}/100
- **Target Prize**: ${idea.targetPrize}

---

## 🎯 Problem Statement
${idea.problemStatement}

## 💡 Proposed Solution
${idea.proposedSolution}

---

## 🛠 Recommended System Architecture
- **Frontend**: ${idea.systemArchitecture.frontend}
- **Backend**: ${idea.systemArchitecture.backend}
- **AI / Core Service**: ${idea.systemArchitecture.aiOrService}
- **Database**: ${idea.systemArchitecture.database}
- **Infrastructure**: ${idea.systemArchitecture.infra}

---

## 👥 Role & Superpower Assignments
${idea.roleAssignments.map((r) => `- **${r.role}**: ${r.focus} (*${r.superpower}*)`).join('\n')}

---

## ⏱ 36-Hour Hackathon Sprint Milestones
${idea.sprintMilestones.map((m) => `### ${m.phase} (${m.hours})\n${m.deliverables.map((d) => `  - [ ] ${d}`).join('\n')}`).join('\n\n')}

---

## 🎤 3-Minute Elevator Pitch Deck Script
### 1. Hook
${idea.pitchDeckScript.hook}

### 2. Problem
${idea.pitchDeckScript.problem}

### 3. Solution
${idea.pitchDeckScript.solution}

### 4. Live Demo Flow
${idea.pitchDeckScript.liveDemo}

### 5. Market & Impact
${idea.pitchDeckScript.marketAndImpact}

### 6. Closing Ask
${idea.pitchDeckScript.closingAsk}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${idea.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded!', 'Markdown blueprint downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl liquid-glass p-8 sm:p-10 border border-white/80 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-[#ff4d15]/20 via-amber-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4d15]/10 border border-[#ff4d15]/20 text-[#ff4d15] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Feature #1: Smart Hackathon Co-Pilot</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 font-moara tracking-tight leading-tight">
              AI Hackathon Idea Lab &amp; <br />
              <span className="text-[#ff4d15]">Pitch Deck Architect</span>
            </h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Don’t let ideation paralysis slow your team down. Generate winning, prize-optimized hackathon project blueprints, full system architecture flows, and 3-minute elevator pitch scripts tailored precisely to your squad’s combined skill matrix.
            </p>
          </div>

          {/* Quick Stats / Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onNavigate('war-room')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition shadow-lg shadow-slate-900/10 hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 text-[#ff4d15]" />
              <span>Go to Hackathon War Room</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('projects')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full liquid-glass-pill text-slate-700 font-bold text-xs sm:text-sm hover:bg-white transition border border-white hover:scale-[1.02]"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Browse Student Project Board</span>
            </button>
          </div>
        </div>

        {/* Squad Skill Matrix Sync Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Active Squad Skill Matrix:</p>
              <p className="text-xs text-slate-500">Tailoring ideas to match strengths</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSquadId}
              onChange={(e) => setSelectedSquadId(e.target.value)}
              className="text-xs font-bold bg-white/90 border border-slate-200 rounded-full px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30 cursor-pointer shadow-xs"
            >
              <option value="my-skills">👤 My Profile ({currentUser.fullName.split(' ')[0]})</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  👥 Squad: {t.name} ({t.members.length} members)
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-1.5 max-w-lg">
              {activeSquadSkills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-emerald-500" />
                  {skill}
                </span>
              ))}
              {activeSquadSkills.length > 6 && (
                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                  +{activeSquadSkills.length - 6} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Generator Search Dock */}
      <div className="p-4 rounded-3xl liquid-glass border border-white/90 shadow-md">
        <form onSubmit={handleGenerateAIBlueprint} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff4d15]" />
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Real-time campus food waste tracker with IoT weight sensors and student meal vouchers..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30 focus:border-[#ff4d15] shadow-inner font-medium transition"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-[#ff4d15] hover:bg-[#e03d07] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-[#ff4d15]/20 hover:scale-[1.02] disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Architecting Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Novel Blueprint</span>
              </>
            )}
          </button>
        </form>

        {/* Filter Pills */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tracks */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Track:
            </span>
            {HACKATHON_TRACKS.map((track) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  selectedTrack === track
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {track}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold mr-1">Tier:</span>
            {['All', 'Beginner Friendly', 'Intermediate', 'Moonshot'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-full font-semibold transition ${
                  selectedDifficulty === diff
                    ? 'bg-[#ff4d15] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blueprint Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIdeas.map((idea) => {
          // Check matching skills between squad and idea
          const matchedSkills = idea.recommendedSkills.filter((s) =>
            activeSquadSkills.includes(s)
          );
          const matchPercent = Math.round(
            (matchedSkills.length / Math.max(1, idea.recommendedSkills.length)) * 100
          );

          return (
            <div
              key={idea.id}
              className="group rounded-3xl liquid-glass-card p-6 border border-white/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ff4d15]/10 text-[#ff4d15] border border-[#ff4d15]/20">
                    {idea.track}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Match with Squad:
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        matchPercent >= 70
                          ? 'bg-emerald-100 text-emerald-800'
                          : matchPercent >= 40
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {matchPercent}%
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-slate-900 font-uber group-hover:text-[#ff4d15] transition">
                  {idea.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                  {idea.tagline}
                </p>

                {/* Scores Ribbon */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-white/70 border border-slate-200/80 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Innovation
                    </span>
                    <span className="text-base font-extrabold text-amber-600">
                      {idea.innovationScore}%
                    </span>
                  </div>
                  <div className="border-x border-slate-200/70">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Feasibility
                    </span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {idea.feasibilityScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Judge Appeal
                    </span>
                    <span className="text-base font-extrabold text-indigo-600">
                      {idea.judgeAppeal}%
                    </span>
                  </div>
                </div>

                {/* Target Prize & Roles */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Target: <span className="font-bold text-slate-900">{idea.targetPrize}</span></span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {idea.recommendedSkills.map((sk) => {
                      const isCovered = activeSquadSkills.includes(sk);
                      return (
                        <span
                          key={sk}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                            isCovered
                              ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200 font-bold'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {sk} {isCovered && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setActiveIdea(idea)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#ff4d15] hover:text-[#d03d0d] transition"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Full Architecture &amp; Pitch</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPitchDeck(idea)}
                    title="Copy 3-Minute Elevator Pitch Script"
                    className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition"
                  >
                    {copiedPitchId === idea.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleExportMarkdown(idea)}
                    title="Download Markdown Blueprint"
                    className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePublishToProjectBoard(idea)}
                    className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Send className="w-3 h-3 text-[#ff4d15]" />
                    <span>Post to Board</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Blueprint & Pitch Deck Modal */}
      {activeIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-uber">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-white flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ff4d15] text-white">
                    {activeIdea.track}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    Target: {activeIdea.targetPrize}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal font-moara text-white">
                  {activeIdea.title}
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  {activeIdea.tagline}
                </p>
              </div>

              <button
                onClick={() => setActiveIdea(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
              {/* Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Problem Statement
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activeIdea.problemStatement}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    Proposed Solution
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activeIdea.proposedSolution}
                  </p>
                </div>
              </div>

              {/* System Architecture Blueprint */}
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#ff4d15]" />
                  System Architecture &amp; Tech Stack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Frontend Client</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{activeIdea.systemArchitecture.frontend}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Backend &amp; API</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{activeIdea.systemArchitecture.backend}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">AI / Core Engine</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{activeIdea.systemArchitecture.aiOrService}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Database &amp; Memory</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{activeIdea.systemArchitecture.database}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Infrastructure &amp; Hosting</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{activeIdea.systemArchitecture.infra}</p>
                  </div>
                </div>
              </div>

              {/* Role & Superpower Matrix */}
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Squad Role Assignments &amp; Superpowers
                </h4>
                <div className="space-y-2.5">
                  {activeIdea.roleAssignments.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                    >
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {role.role}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 mt-1">
                          Focus: {role.focus}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 italic max-w-sm">
                        "{role.superpower}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 36-Hour Sprint Execution Roadmap */}
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  36-Hour Sprint Execution Roadmap
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeIdea.sprintMilestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-900">
                          {m.phase}
                        </span>
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
                          {m.hours}
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {m.deliverables.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Minute Elevator Pitch Deck Script */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-[#ff4d15]" />
                    <h4 className="text-base font-bold text-white">
                      3-Minute Winning Elevator Pitch Script
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopyPitchDeck(activeIdea)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPitchId === activeIdea.id ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-[#ff4d15] block mb-1">0:00 - 0:30 — The Hook:</span>
                    <p className="italic">{activeIdea.pitchDeckScript.hook}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-amber-400 block mb-1">0:30 - 1:00 — The Problem:</span>
                    <p>{activeIdea.pitchDeckScript.problem}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-emerald-400 block mb-1">1:00 - 1:45 — The Solution:</span>
                    <p>{activeIdea.pitchDeckScript.solution}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-indigo-400 block mb-1">1:45 - 2:30 — The Live Demo:</span>
                    <p className="font-mono text-[11px] text-indigo-200">{activeIdea.pitchDeckScript.liveDemo}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="font-bold text-purple-400 block mb-1">2:30 - 3:00 — Market &amp; Closing:</span>
                    <p>{activeIdea.pitchDeckScript.marketAndImpact} {activeIdea.pitchDeckScript.closingAsk}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleExportMarkdown(activeIdea)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold hover:bg-slate-100 transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Markdown Blueprint</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handlePublishToProjectBoard(activeIdea);
                    setActiveIdea(null);
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#ff4d15] text-white text-xs font-bold hover:bg-[#e03d07] transition shadow-md shadow-[#ff4d15]/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to Project Board</span>
                </button>

                <button
                  onClick={() => {
                    setActiveIdea(null);
                    onNavigate('war-room');
                  }}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-md flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-[#ff4d15]" />
                  <span>Launch in War Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
