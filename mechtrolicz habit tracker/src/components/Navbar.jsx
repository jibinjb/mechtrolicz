import React from 'react';
import { Flame, Award, Sun, Moon, Volume2, VolumeX, Plus, Bell, Watch } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function Navbar({ data, setData, theme, toggleTheme, onOpenAddHabit, onOpenCalorieWatch }) {
  const toggleSound = () => {
    soundEffects.enabled = !soundEffects.enabled;
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        soundEnabled: soundEffects.enabled
      }
    }));
    if (soundEffects.enabled) {
      soundEffects.playSuccess();
    }
  };

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const totalCaloriesConsumed = data.calories?.intake?.reduce((acc, item) => acc + item.calories, 0) || 1390;
  const targetCalories = data.calories?.dailyTarget || 2200;

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="today-chip">
          <span>📅</span>
          <span>{todayStr}</span>
        </div>

        {/* Calorie Watch Pill */}
        <button
          onClick={onOpenCalorieWatch}
          className="today-chip"
          style={{ cursor: 'pointer', background: '#fffbeb', borderColor: '#fef08a', color: '#92400e', fontWeight: 700 }}
          title="Open Calorie Count Watch"
        >
          <Watch size={16} />
          <span>{totalCaloriesConsumed} / {targetCalories} kcal</span>
        </button>
      </div>

      <div className="header-right">
        {/* Streak Pill */}
        <div className="streak-pill flame-pulse" title="Current Daily Streak">
          <Flame className="streak-pill-fire" size={18} fill="#ea580c" />
          <span>{data.user.streak} Day Streak</span>
        </div>

        {/* Points Pill */}
        <div className="points-pill" title="Total Accumulated Points">
          <Award size={18} />
          <span>{data.user.totalPoints} pts</span>
        </div>

        {/* Audio Toggle */}
        <button
          className="icon-action-btn"
          onClick={toggleSound}
          title={data.user.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
        >
          {data.user.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Theme Toggle */}
        <button
          className="icon-action-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Quick Add Habit */}
        <button className="btn-primary" onClick={onOpenAddHabit}>
          <Plus size={18} />
          <span>New Habit</span>
        </button>

        {/* User Avatar */}
        <div className="user-avatar-btn" title={data.user.email}>
          <div className="avatar-circle">
            {data.user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="avatar-name">{data.user.name}</span>
        </div>
      </div>
    </header>
  );
}
