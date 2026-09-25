import React, { useState } from 'react';
import { Plus, Check, Flame, Edit3, Trash2, Filter, Clock, Calendar } from 'lucide-react';
import { getTodayDate } from '../utils/storage';
import { soundEffects } from '../utils/audio';

export default function HabitsView({
  data,
  onToggleHabit,
  onOpenAddHabit,
  onEditHabit,
  onDeleteHabit
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const today = getTodayDate();

  const categories = ['All', 'Health', 'Work', 'Fitness', 'Study', 'Personal Development'];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  const filteredHabits = data.habits.filter(habit => {
    if (selectedCategory !== 'All' && habit.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && habit.priority !== selectedPriority) return false;
    return true;
  });

  return (
    <div className="habits-page animate-fade">
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Habit Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Build, adjust, and track your daily & weekly routines
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddHabit}>
          <Plus size={18} />
          <span>Create Habit</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              CATEGORY:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid ' + (selectedCategory === cat ? 'var(--primary)' : 'var(--border-subtle)'),
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              PRIORITY:
            </span>
            {priorities.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                style={{
                  background: selectedPriority === p ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: selectedPriority === p ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Habits List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredHabits.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '16px' }}>
              No habits found matching your filter criteria.
            </p>
            <button className="btn-primary" onClick={onOpenAddHabit}>
              <Plus size={18} />
              <span>Create New Habit</span>
            </button>
          </div>
        ) : (
          filteredHabits.map(habit => {
            const key = `${habit.id}_${today}`;
            const completion = data.completions[key];
            const isCompleted = completion && completion.status === 'completed';

            return (
              <div
                key={habit.id}
                className={`habit-card ${isCompleted ? 'is-completed' : ''}`}
              >
                <div className="habit-left">
                  <button
                    className={`check-btn ${isCompleted ? 'checked' : ''}`}
                    onClick={() => onToggleHabit(habit.id)}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark complete (+10 pts)'}
                  >
                    <Check size={20} strokeWidth={3} />
                  </button>

                  <div className="habit-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`habit-name ${isCompleted ? 'completed-text' : ''}`}>
                        {habit.name}
                      </span>
                      <span
                        className="badge-tag"
                        style={{
                          background: `${habit.color}22`,
                          color: habit.color,
                          border: `1px solid ${habit.color}44`
                        }}
                      >
                        {habit.category}
                      </span>
                    </div>

                    <p className="habit-desc">{habit.description}</p>

                    <div className="habit-meta-row">
                      <span className={`badge-tag badge-priority-${habit.priority.toLowerCase()}`}>
                        {habit.priority} Priority
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} />
                        <span>{habit.frequency}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Clock size={13} />
                        <span>{habit.reminderTime}</span>
                      </div>

                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        Target: {habit.target} {habit.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="habit-right">
                  <div className="habit-streak-badge">
                    <Flame size={15} fill="#f97316" />
                    <span>{habit.streak}d streak</span>
                  </div>

                  <button
                    className="icon-action-btn"
                    title="Edit Habit"
                    onClick={() => onEditHabit(habit)}
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    className="icon-action-btn"
                    title="Delete Habit"
                    style={{ color: 'var(--accent-rose)' }}
                    onClick={() => onDeleteHabit(habit.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
