import React, { useState } from 'react';
import { Plus, Check, Clock, Calendar, ArrowRight, Trash2, FastForward } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function ScheduleView({
  data,
  onCompleteScheduleItem,
  onOpenAddSchedule,
  onDeleteScheduleItem,
  onPostponeScheduleItem
}) {
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Sort schedule items by time ascending
  const sortedSchedule = [...data.schedule].sort((a, b) => a.time.localeCompare(b.time));

  const filteredSchedule = sortedSchedule.filter(item => {
    if (filterPeriod === 'morning') return item.time < '12:00';
    if (filterPeriod === 'afternoon') return item.time >= '12:00' && item.time < '18:00';
    if (filterPeriod === 'evening') return item.time >= '18:00';
    return true;
  });

  return (
    <div className="schedule-page animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Daily Routine & Schedule</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Structured 24-hour block planning and routine execution
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddSchedule}>
          <Plus size={18} />
          <span>Add Routine Block</span>
        </button>
      </div>

      {/* Time of day filters */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { id: 'all', label: 'All Day' },
            { id: 'morning', label: '🌅 Morning (06:00 - 12:00)' },
            { id: 'afternoon', label: '☀️ Afternoon (12:00 - 18:00)' },
            { id: 'evening', label: '🌙 Evening (18:00 - 23:59)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterPeriod(tab.id)}
              style={{
                background: filterPeriod === tab.id ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: filterPeriod === tab.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid ' + (filterPeriod === tab.id ? 'var(--primary)' : 'var(--border-subtle)'),
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline view */}
      <div className="card">
        <div className="timeline-list">
          {filteredSchedule.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
              No activities scheduled for this time window.
            </p>
          ) : (
            filteredSchedule.map(item => {
              const isDone = item.status === 'completed';
              return (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-time">{item.time}</div>

                  <div className={`timeline-card ${isDone ? 'is-done' : ''}`}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, textDecoration: isDone ? 'line-through' : 'none' }}>
                          {item.title}
                        </h4>
                        <span
                          className="badge-tag"
                          style={{ background: '#f1f5f9', color: '#000000', border: '1px solid #e2e8f0' }}
                        >
                          {item.category}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>⏱️ {item.duration} minutes</span>
                        {item.linkedHabitId && (
                          <span style={{ color: 'var(--primary-light)' }}>🔗 Linked Habit</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Postpone button */}
                      {!isDone && (
                        <button
                          className="icon-action-btn"
                          style={{ width: '34px', height: '34px' }}
                          title="Postpone 30 mins"
                          onClick={() => onPostponeScheduleItem(item.id)}
                        >
                          <FastForward size={15} />
                        </button>
                      )}

                      {/* Complete Check button */}
                      <button
                        className={`check-btn ${isDone ? 'checked' : ''}`}
                        style={{ width: '38px', height: '38px' }}
                        onClick={() => onCompleteScheduleItem(item.id)}
                        title={isDone ? 'Mark as incomplete' : 'Mark complete'}
                      >
                        <Check size={18} strokeWidth={3} />
                      </button>

                      {/* Delete */}
                      <button
                        className="icon-action-btn"
                        style={{ width: '34px', height: '34px', color: 'var(--accent-rose)' }}
                        title="Delete block"
                        onClick={() => onDeleteScheduleItem(item.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
