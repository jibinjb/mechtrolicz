import React, { useState } from 'react';
import {
  Users,
  Compass,
  Calendar,
  Lightbulb,
  MessageSquare,
  Bell,
  Shield,
  ChevronDown,
  Sparkles,
  Plus,
  Menu,
  X,
  BarChart3,
  Flag,
  Layers,
  ArrowLeft,
  Zap,
  Sun,
  Moon,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCreateTeam: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenCreateTeam }) => {
  const {
    currentUser,
    isAdmin,
    notifications,
    conversations,
    firebaseUser,
    firebaseLogout,
    showToast,
    students,
    teams,
    reports,
    adminTab,
    setAdminTab,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminPage = currentTab === 'admin';

  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  // Regular student navigation items
  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'speed-match', label: 'Speed Match', icon: Flame, isHot: true },
    { id: 'idea-lab', label: 'Idea Lab', icon: Lightbulb, isNew: true },
    { id: 'war-room', label: 'War Room', icon: Zap, isLive: true },
    { id: 'find-teams', label: 'Teams' },
    { id: 'find-teammates', label: 'Teammates' },
    { id: 'events', label: 'Events' },
    { id: 'projects', label: 'Projects' },
    { id: 'chat', label: 'Messages', badge: unreadMessages > 0 ? unreadMessages : undefined },
  ];

  // Admin features navigation items
  const adminNavItems = [
    { id: 'overview' as const, label: 'Analytics KPI', icon: BarChart3 },
    { id: 'students' as const, label: 'Verify Students', icon: Users, badge: students.length },
    { id: 'teams' as const, label: 'Moderate Teams', icon: Layers, badge: teams.length },
    { id: 'skills' as const, label: 'Skills Taxonomy', icon: Sparkles },
    { id: 'reports' as const, label: 'Safety Reports', icon: Flag, badge: pendingReports > 0 ? pendingReports : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-full bg-[#ff4d15] flex items-center justify-center shadow-md shadow-[#ff4d15]/30 group-hover:scale-105 transition">
              {isAdminPage ? (
                <Shield className="w-4 h-4 text-white" />
              ) : (
                <Users className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight font-uber flex items-center">
              team<span className="text-[#ff4d15]">up</span>
            </span>
          </button>

          {isAdminPage && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white tracking-wider uppercase shadow-xs">
              <Shield className="w-3 h-3 text-[#ff4d15]" /> Admin Console
            </span>
          )}
        </div>

        {/* Center: Top Navigation Pills */}
        {isAdminPage ? (
          /* Admin Features at the Top of the Website */
          <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full liquid-glass-pill shadow-xs border border-white/80 dark:border-white/10">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all font-uber ${
                    isActive
                      ? 'bg-slate-900 dark:bg-[#ff4d15] text-white shadow-sm font-bold dark:shadow-[0_0_15px_rgba(255,77,21,0.35)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff4d15] dark:text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold leading-tight ${
                        isActive ? 'bg-[#ff4d15] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        ) : (
          /* Standard Student Navigation */
          <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full liquid-glass-pill shadow-xs border border-white/80 dark:border-white/10">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs font-semibold transition-all font-uber ${
                    isActive
                      ? 'bg-white dark:bg-[#ff4d15] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-[#ff4d15]/50 font-bold dark:shadow-[0_0_15px_rgba(255,77,21,0.35)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
                  }`}
                >
                  {item.icon && (
                    <item.icon
                      className={`w-3.5 h-3.5 ${
                        item.isHot
                          ? 'text-orange-500 dark:text-orange-400'
                          : item.isLive
                          ? 'text-[#ff4d15] dark:text-white'
                          : item.isNew
                          ? 'text-amber-500'
                          : isActive
                          ? 'text-[#ff4d15] dark:text-white'
                          : 'text-slate-400 dark:text-slate-400'
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                  {item.isHot && (
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs">
                      HOT
                    </span>
                  )}
                  {item.isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15] animate-pulse" />
                  )}
                  {item.isNew && (
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                      AI
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span className="ml-1 w-4 h-4 rounded-full bg-[#ff4d15] text-white text-[9px] inline-flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Tools */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full liquid-glass-pill text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 transition-all relative group hover:scale-105 border border-white/80 dark:border-white/10"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Sound Effects Toggle (Audio feedback) */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-full liquid-glass-pill transition-all relative group hover:scale-105 border border-white/80 dark:border-white/10 ${
              soundEnabled
                ? 'text-[#ff4d15] dark:text-[#ff4d15]'
                : 'text-slate-400 dark:text-slate-500'
            }`}
            title={soundEnabled ? 'Mute click sound effects' : 'Enable click sound effects'}
            aria-label="Toggle sound effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#ff4d15] group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:scale-110 transition-transform" />
            )}
          </button>

          {isAdminPage ? (
            /* Admin Top Action: Exit Admin button (user features removed) */
            <button
              onClick={() => setCurrentTab('landing')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold btn-dark-pill shadow-xs transition hover:scale-105"
              title="Return to Student Platform"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          ) : (
            /* User Features: Create Team & Notification Bell */
            <>
              {/* Create Team Button */}
              <button
                onClick={onOpenCreateTeam}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold btn-primary-coral"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Team</span>
              </button>

              {/* Notifications Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="p-2.5 rounded-full liquid-glass-pill text-slate-600 hover:text-slate-900 transition relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff4d15] text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl liquid-glass dark:bg-slate-900/95 dark:border-white/15 p-4 z-50 animate-in fade-in shadow-2xl border border-white">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#ff4d15]" />
                        Notifications
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {unreadNotifs.length} unread
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 my-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-2.5 text-xs transition cursor-pointer rounded-lg ${
                              notif.isRead
                                ? 'opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-white/5'
                                : 'bg-orange-50/60 dark:bg-orange-950/40 hover:bg-orange-50 dark:hover:bg-orange-950/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-slate-900 dark:text-slate-100">{notif.title}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {notif.createdAt}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-snug">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* User Auth: Sign In button or Profile Menu */}
          {firebaseUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full liquid-glass border border-white dark:border-white/15 shadow-xs hover:border-slate-300 dark:hover:border-white/30 transition"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {firebaseUser.displayName?.split(' ')[0] || firebaseUser.email?.split('@')[0]}
                </span>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white dark:border-white/20 shadow-xs">
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl liquid-glass dark:bg-slate-900/95 dark:border-white/15 p-2 z-50 animate-in fade-in shadow-2xl border border-white text-xs font-uber">
                  <div className="p-2.5 border-b border-slate-200 dark:border-white/10">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {firebaseUser.displayName || 'College Student'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                      {firebaseUser.email}
                    </span>
                  </div>

                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => {
                        setCurrentTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full p-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition font-medium"
                    >
                      View Student Profile
                    </button>
                    <button
                      onClick={async () => {
                        await firebaseLogout();
                        setShowUserMenu(false);
                        showToast('Signed Out', 'You have been signed out.', 'info');
                      }}
                      className="w-full p-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition font-bold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab('auth')}
              className="px-4 py-2 rounded-full text-xs font-bold btn-dark-pill shadow-xs transition"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-full liquid-glass-pill text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-4 rounded-2xl liquid-glass dark:bg-slate-900/95 dark:border-white/15 border border-white space-y-2">
          {isAdminPage ? (
            /* Admin Mobile Menu */
            <>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Admin Features
              </div>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = adminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAdminTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                      isActive ? 'bg-[#ff4d15] text-white shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff4d15]' : 'text-slate-400'}`} />
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ff4d15] text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setCurrentTab('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold btn-dark-pill text-center flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit Admin
              </button>
            </>
          ) : (
            /* Student Mobile Menu */
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                      currentTab === item.id ? 'bg-[#ff4d15] text-white shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </span>
                    {item.isHot && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold shadow-xs">
                        HOT
                      </span>
                    )}
                    {item.isLive && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-rose-600 text-white font-extrabold animate-pulse">
                        LIVE
                      </span>
                    )}
                    {item.isNew && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  onOpenCreateTeam();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold btn-primary-coral text-center"
              >
                + Create Team
              </button>
            </>
          )}

          {/* Mobile Theme Toggle */}
          <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Appearance</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-amber-400 border border-white/80 dark:border-white/10"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Sound Effects Toggle */}
          <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Sound Effects</span>
            <button
              onClick={toggleSound}
              className="px-3 py-1.5 rounded-full liquid-glass-pill text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 border border-white/80 dark:border-white/10"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#ff4d15]" />
                  <span>Audio ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audio Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

