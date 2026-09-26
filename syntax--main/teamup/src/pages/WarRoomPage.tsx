import React, { useState, useEffect, useMemo } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  Code2,
  Palette,
  ExternalLink,
  Plus,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Users,
  Copy,
  Check,
  Award,
  Sparkles,
  ShieldAlert,
  Flame,
  Clock,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

interface WarRoomPageProps {
  onNavigate: (tab: string) => void;
}

interface SprintTask {
  id: string;
  title: string;
  assigneeName: string;
  assigneeAvatar: string;
  domain: 'Frontend' | 'Backend' | 'AI/ML' | 'UI/UX' | 'Pitch';
  priority: 'Critical' | 'High' | 'Normal';
  column: 'backlog' | 'in_progress' | 'review' | 'done';
}

interface DeliverableItem {
  id: string;
  label: string;
  description: string;
  isComplete: boolean;
  link?: string;
}

export const WarRoomPage: React.FC<WarRoomPageProps> = ({ onNavigate }) => {
  const { currentUser, teams, showToast } = useApp();

  // Active Team for the War Room
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    teams[0]?.id || ''
  );

  const activeTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId) || teams[0];
  }, [teams, selectedTeamId]);

  // Hackathon Countdown State (default 36 hours)
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState<number>(
    36 * 3600 - 14 * 3600 - 22 * 60 - 45 // 21h 37m 15s remaining simulation
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && totalSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTotalSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, totalSecondsRemaining]);

  const hoursLeft = Math.floor(totalSecondsRemaining / 3600);
  const minutesLeft = Math.floor((totalSecondsRemaining % 3600) / 60);
  const secondsLeft = totalSecondsRemaining % 60;

  // Sprint Kanban Tasks
  const [tasks, setTasks] = useState<SprintTask[]>([
    {
      id: 'task-1',
      title: 'Scaffold React 19 + Tailwind CSS + Lucide Icons',
      assigneeName: 'Rahul Sharma',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      domain: 'Frontend',
      priority: 'Normal',
      column: 'done',
    },
    {
      id: 'task-2',
      title: 'Train vitals OCR / Gemini Vision RAG prompt',
      assigneeName: 'Priya Patel',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      domain: 'AI/ML',
      priority: 'Critical',
      column: 'done',
    },
    {
      id: 'task-3',
      title: 'Build Liquid Glass real-time telemetry dashboard',
      assigneeName: 'Anjali Mehta',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      domain: 'UI/UX',
      priority: 'High',
      column: 'in_progress',
    },
    {
      id: 'task-4',
      title: 'Setup WebSocket live queue synchronization',
      assigneeName: 'Arjun Das',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      domain: 'Backend',
      priority: 'High',
      column: 'in_progress',
    },
    {
      id: 'task-5',
      title: 'Draft 10-slide Pitch Deck & 90s Live Demo script',
      assigneeName: 'Rahul Sharma',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      domain: 'Pitch',
      priority: 'Critical',
      column: 'review',
    },
    {
      id: 'task-6',
      title: 'Record 2-minute backup Loom video in case Wi-Fi fails',
      assigneeName: 'Priya Patel',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      domain: 'Pitch',
      priority: 'High',
      column: 'backlog',
    },
    {
      id: 'task-7',
      title: 'Deploy production build to Vercel & test on iPhone safari',
      assigneeName: 'Arjun Das',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      domain: 'Frontend',
      priority: 'Critical',
      column: 'backlog',
    },
  ]);

  // Deliverables & Submission Checklist
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([
    {
      id: 'del-1',
      label: 'GitHub Public Repository',
      description: 'Structured README.md, architecture diagram & MIT License',
      isComplete: true,
      link: 'https://github.com/teamup/hackathon-squad-prototype',
    },
    {
      id: 'del-2',
      label: 'Production Live Demo URL',
      description: 'Deployed and accessible without local setup',
      isComplete: true,
      link: 'https://teamup-demo.vercel.app',
    },
    {
      id: 'del-3',
      label: '2-Minute Video Walkthrough',
      description: 'Concise Loom or unlisted YouTube video showing live UI',
      isComplete: false,
    },
    {
      id: 'del-4',
      label: '10-Slide Pitch Presentation',
      description: 'Problem, Live Flow, Tech Stack, Business & Market',
      isComplete: true,
      link: 'https://canva.com/design/teamup-deck',
    },
    {
      id: 'del-5',
      label: 'Devpost / Unstop Final Form',
      description: 'All team members tagged with college IDs',
      isComplete: false,
    },
  ]);

  // Compute Submission Readiness %
  const completedDeliverables = deliverables.filter((d) => d.isComplete).length;
  const readinessPercent = Math.round(
    (completedDeliverables / deliverables.length) * 100
  );

  const toggleDeliverable = (id: string) => {
    setDeliverables((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isComplete: !item.isComplete } : item
      );
      const newComplete = updated.filter((d) => d.isComplete).length;
      if (newComplete === updated.length) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        showToast('100% Submission Ready!', 'All critical deliverables completed! Good luck with judging.', 'success');
      }
      return updated;
    });
  };

  // Mentor SOS State
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [sosCategory, setSosCategory] = useState<string>('Build/Deploy Emergency');
  const [sosTable, setSosTable] = useState<string>('Table B-14 (Main Arena)');
  const [sosAssignedMentor, setSosAssignedMentor] = useState<string | null>(null);
  const [sosEtaMinutes, setSosEtaMinutes] = useState<number>(4);

  const handleBroadcastSos = () => {
    setSosActive(true);
    setSosAssignedMentor('Prof. Raman (Dept of AI & Systems)');
    setSosEtaMinutes(3);
    showToast('SOS Beacon Dispatched!', 'Mentors notified. Prof. Raman is en route to Table B-14.', 'warning');
  };

  const handleResolveSos = () => {
    setSosActive(false);
    setSosAssignedMentor(null);
    showToast('SOS Cleared', 'Mentor ticket resolved. Keep building!', 'info');
  };

  // Task creation state
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>(
    currentUser.fullName
  );
  const [newTaskDomain, setNewTaskDomain] = useState<SprintTask['domain']>('Frontend');
  const [newTaskPriority, setNewTaskPriority] = useState<SprintTask['priority']>('High');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const matchedMember = activeTeam?.members.find(
      (m) => m.fullName.toLowerCase() === newTaskAssignee.toLowerCase()
    );

    const newTask: SprintTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assigneeName: newTaskAssignee,
      assigneeAvatar:
        matchedMember?.profileImage ||
        currentUser.profileImage ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      domain: newTaskDomain,
      priority: newTaskPriority,
      column: 'backlog',
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
    showToast('Task Added', `"${newTask.title}" added to Sprint Backlog.`, 'success');
  };

  const moveTask = (taskId: string, direction: 'forward' | 'backward') => {
    const columns: SprintTask['column'][] = [
      'backlog',
      'in_progress',
      'review',
      'done',
    ];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentIndex = columns.indexOf(t.column);
          const nextIndex =
            direction === 'forward'
              ? Math.min(columns.length - 1, currentIndex + 1)
              : Math.max(0, currentIndex - 1);
          if (columns[nextIndex] === 'done' && t.column !== 'done') {
            confetti({ particleCount: 30, spread: 45 });
          }
          return { ...t, column: columns[nextIndex] };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task Removed', 'Task cleared from board.', 'info');
  };

  // Resource Locker Links
  const [resources, setResources] = useState({
    github: 'https://github.com/teamup/hackathon-squad-prototype',
    figma: 'https://figma.com/@teamup/hackathon-liquid-ui',
    slides: 'https://canva.com/design/teamup-presentation',
    apiKey: 'sk-proj-campus-demo-849201948293-jwt',
  });
  const [copiedResourceKey, setCopiedResourceKey] = useState<string | null>(null);

  const handleCopyResource = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedResourceKey(key);
    setTimeout(() => setCopiedResourceKey(null), 2000);
    showToast('Copied!', 'Resource copied to clipboard.', 'info');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Top War Room HUD & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-[#ff4d15]/30 via-red-900/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4d15]/20 border border-[#ff4d15]/40 text-[#ff4d15] text-xs font-bold uppercase tracking-wider mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Feature #2: Live Sprint Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-normal font-moara text-white">
              Hackathon War Room &amp;{' '}
              <span className="text-[#ff4d15]">Sprint Hub</span>
            </h1>
            <p className="mt-2 text-slate-400 text-xs sm:text-sm max-w-xl">
              Live collaboration command center during the hackathon crunch. Monitor the countdown clock, organize sprint tasks, audit submission deliverables, and summon campus mentors via SOS beacon.
            </p>
          </div>

          {/* Active Squad Switcher & Shortcut */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-2xl">
              <Users className="w-4 h-4 text-[#ff4d15]" />
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id} className="bg-slate-900 text-white">
                    {team.name} ({team.members.length} members)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onNavigate('idea-lab')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#ff4d15] hover:bg-[#e03d07] text-white text-xs font-bold transition shadow-md shadow-[#ff4d15]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Idea Lab</span>
            </button>
          </div>
        </div>

        {/* Live Ticking Countdown Clock Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/90 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Big Timer */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#ff4d15]">
              <Timer className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Submission Deadline In
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white flex items-center gap-1">
                <span>{String(hoursLeft).padStart(2, '0')}</span>
                <span className="text-[#ff4d15] animate-pulse">:</span>
                <span>{String(minutesLeft).padStart(2, '0')}</span>
                <span className="text-[#ff4d15] animate-pulse">:</span>
                <span className="text-amber-400">{String(secondsLeft).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Sprint Milestone Status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Sprint Phase:</span>
              <span className="text-[#ff4d15] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Phase 4: Code Freeze &amp; Polish
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
              <div className="bg-gradient-to-r from-emerald-500 via-[#ff4d15] to-amber-500 h-full rounded-full w-[72%] transition-all" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>H0: Git Init</span>
              <span>H18: Mid-Check</span>
              <span className="font-bold text-slate-400">H36: Judging</span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-start md:justify-end gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
            </button>
            <button
              onClick={() => {
                setTotalSecondsRemaining(36 * 3600);
                showToast('Timer Reset', 'Reset to 36 hours.', 'info');
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition"
              title="Reset Timer to 36h"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setTotalSecondsRemaining(24 * 3600);
                showToast('24-Hour Sprint Set', 'Countdown updated to 24h.', 'info');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-400 hover:text-white transition"
            >
              24h
            </button>
            <button
              onClick={() => {
                setTotalSecondsRemaining(36 * 3600);
                showToast('36-Hour Hackathon Set', 'Countdown updated to 36h.', 'info');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-400 hover:text-white transition"
            >
              36h
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Submission Readiness & Mentor SOS Beacon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Readiness Meter (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl liquid-glass p-6 sm:p-8 border border-white/80 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-xl font-bold text-slate-900 font-uber">
                  Submission Readiness Audit
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Make sure your squad checks off all mandatory judging requirements before time expires.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Readiness Score
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {readinessPercent}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center p-1 border-2 border-emerald-500/30">
                <span
                  className={`text-sm font-black ${
                    readinessPercent === 100
                      ? 'text-emerald-600'
                      : readinessPercent >= 60
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {completedDeliverables}/{deliverables.length}
                </span>
              </div>
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="mt-4 space-y-2.5">
            {deliverables.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleDeliverable(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.isComplete
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                      item.isComplete
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {item.isComplete && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-bold block ${
                        item.isComplete
                          ? 'text-slate-900 line-through decoration-slate-400'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition"
                    title="Open Resource Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Campus Mentor SOS Request Beacon (1 Col) */}
        <div className="rounded-3xl liquid-glass p-6 border border-white/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                <Radio className="w-3.5 h-3.5" /> Campus Mentor SOS
              </span>
              {sosActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">
                  BEACON BROADCASTING
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-uber">
              Stuck? Request a Mentor
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Facing build errors, model drift, or need a pitch deck rehearsal? Request on-duty faculty &amp; industry mentors to your table.
            </p>

            {sosActive ? (
              <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>Mentor En Route to {sosTable}</span>
                </div>
                <div className="text-xs text-slate-700">
                  <p>
                    <strong className="text-slate-900">Assigned:</strong> {sosAssignedMentor}
                  </p>
                  <p>
                    <strong className="text-slate-900">Category:</strong> {sosCategory}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-rose-700 font-bold">
                    Estimated Arrival: ~{sosEtaMinutes} minutes
                  </p>
                </div>
                <button
                  onClick={handleResolveSos}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
                >
                  Mark Issue Resolved / Cancel SOS
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Issue Category:
                  </label>
                  <select
                    value={sosCategory}
                    onChange={(e) => setSosCategory(e.target.value)}
                    className="w-full text-xs font-medium bg-white/90 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30 shadow-xs"
                  >
                    <option value="Build/Deploy Emergency">🚨 Build / Webpack / Deploy Emergency</option>
                    <option value="API / CORS / Database">🔌 API Rate Limit / CORS / Firebase Error</option>
                    <option value="ML Model Performance">🧠 Model Overfitting / Hardware Bug</option>
                    <option value="Pitch Deck Flow">🎤 Pitch Deck Flow &amp; Judge Rehearsal</option>
                    <option value="Hardware / IoT Sensors">⚡ Arduino / ESP32 Sensor Wiring</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Table / Room Location:
                  </label>
                  <input
                    type="text"
                    value={sosTable}
                    onChange={(e) => setSosTable(e.target.value)}
                    className="w-full text-xs font-medium bg-white/90 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30 shadow-xs"
                    placeholder="e.g. Table B-14 (Main Hall)"
                  />
                </div>

                <button
                  onClick={handleBroadcastSos}
                  className="w-full py-2.5 rounded-xl bg-[#ff4d15] hover:bg-[#e03d07] text-white text-xs font-bold transition shadow-md shadow-[#ff4d15]/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Broadcast SOS to Mentors</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400 text-center">
            Mentors usually arrive within 3-5 minutes.
          </div>
        </div>
      </div>

      {/* Sprint Kanban Board */}
      <div className="rounded-3xl liquid-glass p-6 sm:p-8 border border-white/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ff4d15]" />
              <h3 className="text-xl font-bold text-slate-900 font-uber">
                Squad Sprint Kanban Board
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active task coordination for{' '}
              <strong className="text-slate-800">{activeTeam?.name}</strong>. Assign roles and track feature completion.
            </p>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4 text-[#ff4d15]" />
            <span>Add Sprint Task</span>
          </button>
        </div>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {(
            [
              { id: 'backlog', title: '📋 Backlog', color: 'slate' },
              { id: 'in_progress', title: '⚡ In Progress', color: 'amber' },
              { id: 'review', title: '🧪 Review & QA', color: 'indigo' },
              { id: 'done', title: '🎉 Completed', color: 'emerald' },
            ] as const
          ).map((col) => {
            const colTasks = tasks.filter((t) => t.column === col.id);
            return (
              <div
                key={col.id}
                className="rounded-2xl bg-slate-100/60 p-3.5 border border-slate-200 flex flex-col justify-between min-h-[420px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-800 font-uber">
                      {col.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-white border border-slate-200 text-slate-700">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-2.5"
                      >
                        {/* Domain & Priority tags */}
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              task.domain === 'Frontend'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : task.domain === 'AI/ML'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : task.domain === 'UI/UX'
                                ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                : task.domain === 'Backend'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {task.domain}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'Critical'
                                ? 'bg-rose-100 text-rose-800 font-black'
                                : task.priority === 'High'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {task.title}
                        </p>

                        {/* Assignee & Move Controls */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={task.assigneeAvatar}
                              alt={task.assigneeName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-[11px] font-medium text-slate-600 truncate max-w-[80px]">
                              {task.assigneeName.split(' ')[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {col.id !== 'backlog' && (
                              <button
                                onClick={() => moveTask(task.id, 'backward')}
                                title="Move Previous"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {col.id !== 'done' && (
                              <button
                                onClick={() => moveTask(task.id, 'forward')}
                                title="Advance Task"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Delete Task"
                              className="p-1 rounded-md text-slate-300 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 italic">
                        No tasks in this lane
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Squad Resource Dock & Shared Links */}
      <div className="rounded-3xl liquid-glass p-6 sm:p-8 border border-white/80 shadow-md">
        <h3 className="text-xl font-bold text-slate-900 font-uber mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Squad Resource Locker &amp; Shared Credentials
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Centralized dock for team links, design boards, and sandbox API tokens. 1-click clipboard copy for teammates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* GitHub Repo */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-900" /> GitHub Repo
              </span>
              <button
                onClick={() => handleCopyResource('github', resources.github)}
                className="text-slate-400 hover:text-slate-800 transition"
              >
                {copiedResourceKey === 'github' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate mb-3">
              {resources.github}
            </p>
            <a
              href={resources.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#ff4d15] hover:underline flex items-center gap-1"
            >
              <span>Open Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Figma Board */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-600" /> Figma Canvas
              </span>
              <button
                onClick={() => handleCopyResource('figma', resources.figma)}
                className="text-slate-400 hover:text-slate-800 transition"
              >
                {copiedResourceKey === 'figma' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate mb-3">
              {resources.figma}
            </p>
            <a
              href={resources.figma}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#ff4d15] hover:underline flex items-center gap-1"
            >
              <span>Open Figma File</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Presentation Slides */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Pitch Deck Slides
              </span>
              <button
                onClick={() => handleCopyResource('slides', resources.slides)}
                className="text-slate-400 hover:text-slate-800 transition"
              >
                {copiedResourceKey === 'slides' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate mb-3">
              {resources.slides}
            </p>
            <a
              href={resources.slides}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#ff4d15] hover:underline flex items-center gap-1"
            >
              <span>View Presentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Sandbox Credentials */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-500" /> Sandbox API Key
              </span>
              <button
                onClick={() => handleCopyResource('apiKey', resources.apiKey)}
                className="text-slate-400 hover:text-slate-800 transition"
              >
                {copiedResourceKey === 'apiKey' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate mb-3">
              {resources.apiKey}
            </p>
            <button
              onClick={() => handleCopyResource('apiKey', resources.apiKey)}
              className="text-xs font-bold text-[#ff4d15] hover:underline flex items-center gap-1 text-left"
            >
              <span>Copy API Secret</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-uber">
          <div className="relative w-full max-w-md liquid-glass dark:bg-slate-900/95 dark:border-white/15 rounded-3xl shadow-2xl border border-white p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Add Sprint Task
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create an action item for your hackathon sprint.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Task Title:
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement user login JWT token exchange"
                  required
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assignee:
                </label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30 cursor-pointer"
                >
                  <option value={currentUser.fullName}>{currentUser.fullName} (You)</option>
                  {activeTeam?.members.map((m) => (
                    <option key={m.studentId} value={m.fullName}>
                      {m.fullName} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Domain:
                  </label>
                  <select
                    value={newTaskDomain}
                    onChange={(e) => setNewTaskDomain(e.target.value as any)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30 cursor-pointer"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Pitch">Pitch Deck</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Priority:
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/30 cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ff4d15] hover:bg-[#e03d07] text-white text-xs font-bold transition shadow-md shadow-[#ff4d15]/20"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
