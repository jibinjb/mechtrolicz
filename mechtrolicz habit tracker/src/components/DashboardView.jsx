import React from 'react';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Clock,
  Award,
  Check,
  Watch
} from 'lucide-react';
import { getTodayDate } from '../utils/storage';
import { soundEffects } from '../utils/audio';

export default function DashboardView({
  data,
  onToggleHabit,
  onCompleteScheduleItem,
  suggestions,
  onApplySuggestion,
  setActiveTab
}) {
  const today = getTodayDate();
  const totalCaloriesConsumed = data.calories?.intake?.reduce((acc, item) => acc + item.calories, 0) || 1390;
  const totalCaloriesBurned = data.calories?.burned?.reduce((acc, item) => acc + item.calories, 0) || 460;
  const calorieTarget = data.calories?.dailyTarget || 2200;
  const burnTarget = data.calories?.burnedTarget || 550;
  const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

  // Calculate today's stats
  const totalHabitsToday = data.habits.length;
  const completedHabitsToday = data.habits.filter(h => {
    const record = data.completions[`${h.id}_${today}`];
    return record && record.status === 'completed';
  }).length;

  const completionRate = totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 0;

  // Active goals preview
  const activeGoals = data.goals.filter(g => g.status === 'active').slice(0, 3);

  // Today's upcoming routine schedule
  const todaySchedule = data.schedule.slice(0, 5);

  return (
    <div className="dashboard-page animate-fade">
      {/* Hero Welcome Banner */}
      <section className="hero-banner">
        <div>
          <h2 className="hero-greeting">
            Welcome back, {data.user.name} <span style={{ fontSize: '1.6rem' }}>⚡</span>
          </h2>
          <p className="hero-subtext">
            You're currently on an exceptional {data.user.streak}-day streak! Complete {totalHabitsToday - completedHabitsToday} more habit{totalHabitsToday - completedHabitsToday === 1 ? '' : 's'} to hit today's 100% daily perfection target.
          </p>
        </div>

        <div className="hero-stats-row">
          <div className="hero-stat-pill">
            <div className="hero-stat-val" style={{ color: '#10b981' }}>{completionRate}%</div>
            <div className="hero-stat-lbl">Daily Progress</div>
          </div>
          <div className="hero-stat-pill">
            <div className="hero-stat-val" style={{ color: '#f97316' }}>{data.user.streak}d</div>
            <div className="hero-stat-lbl">Active Streak</div>
          </div>
          <div className="hero-stat-pill">
            <div className="hero-stat-val" style={{ color: '#6366f1' }}>{data.user.totalPoints}</div>
            <div className="hero-stat-lbl">Total Score</div>
          </div>
        </div>
      </section>

      {/* Smart Personalized Suggestion / Adaptive Routine Banner */}
      {suggestions.length > 0 && (
        <section className="suggestion-banner animate-pop">
          <div className="sug-left">
            <div className="sug-icon-box">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="sug-tag">{suggestions[0].badge}</span>
              <h3 className="sug-title">{suggestions[0].title}</h3>
              <p className="sug-desc">{suggestions[0].description}</p>
            </div>
          </div>
          <button
            className="sug-btn"
            onClick={() => onApplySuggestion(suggestions[0])}
          >
            {suggestions[0].actionLabel}
          </button>
        </section>
      )}

      {/* Main Dashboard Layout */}
      <div className="grid-sidebar-layout">
        {/* Left Column: Today's Habit Checklist & Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Today's Habits Checklist */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="card-title">Today's Habits</h3>
                  <p className="card-subtitle">{completedHabitsToday} of {totalHabitsToday} completed</p>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                onClick={() => setActiveTab('habits')}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.habits.map((habit) => {
                const key = `${habit.id}_${today}`;
                const completion = data.completions[key];
                const isCompleted = completion && completion.status === 'completed';

                return (
                  <div
                    key={habit.id}
                    className={`habit-card ${isCompleted ? 'is-completed' : ''}`}
                    style={{ padding: '14px 18px' }}
                  >
                    <div className="habit-left">
                      <button
                        className={`check-btn ${isCompleted ? 'checked' : ''}`}
                        onClick={() => onToggleHabit(habit.id)}
                        title={isCompleted ? 'Mark as incomplete' : 'Complete habit (+10 pts)'}
                      >
                        <Check size={20} strokeWidth={3} />
                      </button>
                      <div className="habit-info">
                        <span className={`habit-name ${isCompleted ? 'completed-text' : ''}`}>
                          {habit.name}
                        </span>
                        <div className="habit-meta-row">
                          <span
                            className="badge-tag"
                            style={{ background: '#f1f5f9', color: '#000000', border: '1px solid #e2e8f0' }}
                          >
                            {habit.category}
                          </span>
                          <span className={`badge-tag badge-priority-${habit.priority.toLowerCase()}`}>
                            {habit.priority}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {habit.target} {habit.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="habit-right">
                      <div className="habit-streak-badge">
                        <Flame size={14} fill="#f97316" />
                        <span>{habit.streak}d</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Schedule Overview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="card-title">Today's Routine Timeline</h3>
                  <p className="card-subtitle">Organized by scheduled time</p>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                onClick={() => setActiveTab('schedule')}
              >
                <span>Full Timeline</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="timeline-list">
              {todaySchedule.map((item) => {
                const isDone = item.status === 'completed';
                return (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-time">{item.time}</div>
                    <div className={`timeline-card ${isDone ? 'is-done' : ''}`}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', textDecoration: isDone ? 'line-through' : 'none' }}>
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {item.duration} mins • {item.category}
                        </span>
                      </div>
                      <button
                        className={`check-btn ${isDone ? 'checked' : ''}`}
                        style={{ width: '34px', height: '34px' }}
                        onClick={() => onCompleteScheduleItem(item.id)}
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Consistency Ring, Active Goals, Quick Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Consistency Gauge Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Consistency Score</h3>
            
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 16px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="url(#gradientScore)"
                  strokeWidth="14"
                  strokeDasharray={2 * Math.PI * 65}
                  strokeDashoffset={2 * Math.PI * 65 * (1 - completionRate / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  transform="rotate(-90 80 80)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <defs>
                  <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  {completionRate}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Today
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {completionRate === 100
                ? '🏆 Outstanding! All planned routines complete!'
                : `${completedHabitsToday} of ${totalHabitsToday} routines finished.`}
            </p>
          </div>

          {/* Calorie Count Watch Card */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div className="card-header" style={{ marginBottom: '14px' }}>
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#fffbeb', color: '#b45309' }}>
                  <Watch size={20} />
                </div>
                <div>
                  <h3 className="card-title">Calorie Count Watch</h3>
                  <p className="card-subtitle">Live daily balance</p>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem', fontWeight: 700 }}
                onClick={() => setActiveTab('calories')}
              >
                <span>Open Watch</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: 800 }}>INTAKE</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#000000', margin: '2px 0' }}>
                  {totalCaloriesConsumed}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#475569' }}>/ {calorieTarget} kcal</span>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 800 }}>BURNED</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', margin: '2px 0' }}>
                  {totalCaloriesBurned}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#475569' }}>/ {burnTarget} kcal</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#000000' }}>Net Calories Today:</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#4f46e5' }}>{netCalories} kcal</span>
            </div>
          </div>

          {/* Active Goals Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="card-title">Active Goals</h3>
                  <p className="card-subtitle">Target milestones</p>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                onClick={() => setActiveTab('goals')}
              >
                <span>Manage</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeGoals.map(goal => {
                const percent = Math.min(100, Math.round((goal.currentProgress / goal.target) * 100));
                return (
                  <div key={goal.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{goal.title}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                        {percent}%
                      </span>
                    </div>
                    <div className="goal-progress-bar-bg">
                      <div className="goal-progress-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {goal.currentProgress} / {goal.target} {goal.unit}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Due {goal.deadline}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Badges Snapshot */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="card-title">Unlocked Trophies</h3>
                  <p className="card-subtitle">Gamification rewards</p>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                onClick={() => setActiveTab('rewards')}
              >
                <span>View All</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {data.badges.filter(b => b.unlocked).slice(0, 3).map(badge => (
                <div
                  key={badge.id}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🏅</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{badge.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>+{badge.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
