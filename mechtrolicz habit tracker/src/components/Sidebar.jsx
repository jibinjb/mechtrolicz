import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Calendar,
  Target,
  BarChart3,
  Trophy,
  Settings,
  Sparkles,
  Watch
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function Sidebar({ activeTab, setActiveTab, data }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckCircle2, badge: data.habits.length },
    { id: 'calories', label: 'Calorie Watch', icon: Watch, badge: '⌚' },
    { id: 'schedule', label: 'Daily Routine', icon: Calendar, badge: data.schedule.length },
    { id: 'goals', label: 'Goals', icon: Target, badge: data.goals.filter(g => g.status === 'active').length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'rewards', label: 'Rewards & XP', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    soundEffects.playClick();
    setActiveTab(tabId);
  };

  const xpPercentage = Math.min(100, Math.round((data.user.currentXP / data.user.nextLevelXP) * 100));

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Sparkles size={22} />
        </div>
        <div className="brand-text">
          <h1>HabitRoutine</h1>
          <p>Productivity Suite</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="nav-link-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Level XP Card */}
      <div className="sidebar-footer">
        <div className="level-card">
          <div className="level-card-top">
            <span className="level-title">Lv {data.user.level} {data.user.levelTitle}</span>
            <span className="level-badge">XP</span>
          </div>
          <div className="xp-bar-bg">
            <div
              className="xp-bar-fill"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="xp-label">
            <span>{data.user.currentXP} XP</span>
            <span>{data.user.nextLevelXP} XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
