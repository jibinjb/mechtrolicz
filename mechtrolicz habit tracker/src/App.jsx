import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import HabitsView from './components/HabitsView';
import ScheduleView from './components/ScheduleView';
import GoalsView from './components/GoalsView';
import AnalyticsView from './components/AnalyticsView';
import RewardsView from './components/RewardsView';
import SettingsView from './components/SettingsView';
import CalorieWatch from './components/CalorieWatch';

import HabitModal from './components/Modals/HabitModal';
import ScheduleModal from './components/Modals/ScheduleModal';
import GoalModal from './components/Modals/GoalModal';
import CelebrationModal from './components/Modals/CelebrationModal';

import {
  loadPlannerData,
  savePlannerData,
  getTodayDate
} from './utils/storage';
import { soundEffects } from './utils/audio';
import { generateSmartSuggestions } from './utils/suggestions';

export default function App() {
  const [data, setData] = useState(() => loadPlannerData());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(data.user?.theme || 'light');

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [celebration, setCelebration] = useState({
    isOpen: false,
    title: '',
    message: '',
    points: 0
  });

  // Sync theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist state changes
  useEffect(() => {
    savePlannerData(data);
  }, [data]);

  // Sync sound setting
  useEffect(() => {
    soundEffects.enabled = data.user.soundEnabled;
  }, [data.user.soundEnabled]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        theme: nextTheme
      }
    }));
  };

  // Generate personalized suggestions
  const suggestions = useMemo(() => {
    return generateSmartSuggestions(data.habits, data.completions, data.schedule);
  }, [data.habits, data.completions, data.schedule]);

  // Handle habit check / uncheck
  const handleToggleHabit = (habitId) => {
    const today = getTodayDate();
    const key = `${habitId}_${today}`;
    const existing = data.completions[key];
    const willBeCompleted = !(existing && existing.status === 'completed');

    setData(prev => {
      const updatedCompletions = { ...prev.completions };

      if (willBeCompleted) {
        updatedCompletions[key] = {
          id: key,
          habitId,
          date: today,
          status: 'completed',
          value: 1,
          note: ''
        };
      } else {
        delete updatedCompletions[key];
      }

      // Update habit streak
      const updatedHabits = prev.habits.map(h => {
        if (h.id === habitId) {
          const newStreak = willBeCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          return { ...h, streak: newStreak };
        }
        return h;
      });

      // Update XP & Points
      let pointsEarned = willBeCompleted ? 10 : -10;
      let newTotalPoints = Math.max(0, prev.user.totalPoints + pointsEarned);
      let newXP = Math.max(0, prev.user.currentXP + (willBeCompleted ? 15 : -15));
      let newLevel = prev.user.level;
      let newNextLevelXP = prev.user.nextLevelXP;

      // Check level up
      if (newXP >= newNextLevelXP) {
        newLevel += 1;
        newXP = newXP - newNextLevelXP;
        newNextLevelXP = Math.round(newNextLevelXP * 1.4);
      }

      // Check if all today's habits are completed
      const totalHabits = updatedHabits.length;
      const completedCount = updatedHabits.filter(h => {
        const c = updatedCompletions[`${h.id}_${today}`];
        return c && c.status === 'completed';
      }).length;

      // Celebrate 100% completion if just reached
      if (willBeCompleted && completedCount === totalHabits && totalHabits > 0) {
        setTimeout(() => {
          setCelebration({
            isOpen: true,
            title: 'Daily Routine Perfected! 🌟',
            message: 'Incredible work! You completed 100% of your scheduled habits today.',
            points: 25
          });
        }, 300);
        newTotalPoints += 25;
      }

      // Auto-attribute calories burned if Fitness habit is completed
      let updatedCalories = prev.calories;
      const targetHabit = prev.habits.find(h => h.id === habitId);
      if (willBeCompleted && targetHabit && targetHabit.category === 'Fitness' && prev.calories) {
        const fitnessBurn = {
          id: `b-${Date.now()}`,
          name: `Completed Habit: ${targetHabit.name}`,
          calories: 250,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Fitness Habit',
          duration: targetHabit.target || 30
        };
        updatedCalories = {
          ...prev.calories,
          burned: [fitnessBurn, ...(prev.calories.burned || [])]
        };
      }

      return {
        ...prev,
        habits: updatedHabits,
        completions: updatedCompletions,
        calories: updatedCalories,
        user: {
          ...prev.user,
          totalPoints: newTotalPoints,
          currentXP: newXP,
          level: newLevel,
          nextLevelXP: newNextLevelXP
        }
      };
    });

    if (willBeCompleted) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playClick();
    }
  };

  // Schedule status toggle
  const handleCompleteScheduleItem = (scheduleId) => {
    setData(prev => {
      const updatedSchedule = prev.schedule.map(item => {
        if (item.id === scheduleId) {
          const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
          return { ...item, status: nextStatus };
        }
        return item;
      });
      return { ...prev, schedule: updatedSchedule };
    });
    soundEffects.playSuccess();
  };

  // Postpone schedule item by 30 mins
  const handlePostponeScheduleItem = (scheduleId) => {
    setData(prev => {
      const updatedSchedule = prev.schedule.map(item => {
        if (item.id === scheduleId) {
          const [h, m] = item.time.split(':').map(Number);
          const totalMins = h * 60 + m + 30;
          const newH = Math.floor(totalMins / 60) % 24;
          const newM = totalMins % 60;
          const newTime = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
          return { ...item, time: newTime };
        }
        return item;
      });
      return { ...prev, schedule: updatedSchedule };
    });
    soundEffects.playClick();
  };

  // Delete schedule item
  const handleDeleteScheduleItem = (scheduleId) => {
    setData(prev => ({
      ...prev,
      schedule: prev.schedule.filter(s => s.id !== scheduleId)
    }));
    soundEffects.playClick();
  };

  // Goal progress update
  const handleUpdateGoalProgress = (goalId, delta) => {
    setData(prev => {
      let unlockedGoalCrusher = false;

      const updatedGoals = prev.goals.map(goal => {
        if (goal.id === goalId) {
          const nextProgress = Math.max(0, goal.currentProgress + delta);
          const isDone = nextProgress >= goal.target;
          if (isDone && goal.status !== 'completed') {
            unlockedGoalCrusher = true;
          }
          return {
            ...goal,
            currentProgress: nextProgress,
            status: isDone ? 'completed' : 'active'
          };
        }
        return goal;
      });

      let updatedBadges = [...prev.badges];
      let bonusPoints = 0;

      if (unlockedGoalCrusher) {
        bonusPoints = 100;
        updatedBadges = updatedBadges.map(b => {
          if (b.id === 'b-4') {
            return { ...b, unlocked: true, unlockedAt: getTodayDate() };
          }
          return b;
        });

        setTimeout(() => {
          setCelebration({
            isOpen: true,
            title: 'Goal Crushed! 🏆',
            message: 'You achieved a major target milestone! Your consistency is paying off.',
            points: 100
          });
        }, 300);
      }

      return {
        ...prev,
        goals: updatedGoals,
        badges: updatedBadges,
        user: {
          ...prev.user,
          totalPoints: prev.user.totalPoints + bonusPoints
        }
      };
    });

    soundEffects.playSuccess();
  };

  // Delete Goal
  const handleDeleteGoal = (goalId) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
    soundEffects.playClick();
  };

  // Habit CRUD
  const handleSaveHabit = (habit) => {
    setData(prev => {
      const exists = prev.habits.some(h => h.id === habit.id);
      let updatedHabits;
      if (exists) {
        updatedHabits = prev.habits.map(h => h.id === habit.id ? habit : h);
      } else {
        updatedHabits = [habit, ...prev.habits];
      }
      return { ...prev, habits: updatedHabits };
    });
    setIsHabitModalOpen(false);
    setEditingHabit(null);
    soundEffects.playSuccess();
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to remove this habit?')) {
      setData(prev => ({
        ...prev,
        habits: prev.habits.filter(h => h.id !== habitId)
      }));
      soundEffects.playClick();
    }
  };

  // Schedule Add
  const handleSaveSchedule = (item) => {
    setData(prev => ({
      ...prev,
      schedule: [...prev.schedule, item]
    }));
    setIsScheduleModalOpen(false);
    soundEffects.playSuccess();
  };

  // Goal Add
  const handleSaveGoal = (goal) => {
    setData(prev => ({
      ...prev,
      goals: [goal, ...prev.goals]
    }));
    setIsGoalModalOpen(false);
    soundEffects.playSuccess();
  };

  // Apply suggestion
  const handleApplySuggestion = (sug) => {
    setData(prev => ({
      ...prev,
      habits: sug.apply(prev.habits)
    }));
    soundEffects.playSuccess();
    setCelebration({
      isOpen: true,
      title: 'Routine Adapted! ⚡',
      message: `Suggestion "${sug.title}" was successfully applied to your active routine!`,
      points: 15
    });
  };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          data={data}
          setData={setData}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenAddHabit={() => {
            setEditingHabit(null);
            setIsHabitModalOpen(true);
          }}
          onOpenCalorieWatch={() => setActiveTab('calories')}
        />

        <main className="content-viewport">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={data}
              onToggleHabit={handleToggleHabit}
              onCompleteScheduleItem={handleCompleteScheduleItem}
              suggestions={suggestions}
              onApplySuggestion={handleApplySuggestion}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'calories' && (
            <CalorieWatch
              data={data}
              setData={setData}
            />
          )}

          {activeTab === 'habits' && (
            <HabitsView
              data={data}
              onToggleHabit={handleToggleHabit}
              onOpenAddHabit={() => {
                setEditingHabit(null);
                setIsHabitModalOpen(true);
              }}
              onEditHabit={(h) => {
                setEditingHabit(h);
                setIsHabitModalOpen(true);
              }}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleView
              data={data}
              onCompleteScheduleItem={handleCompleteScheduleItem}
              onOpenAddSchedule={() => setIsScheduleModalOpen(true)}
              onDeleteScheduleItem={handleDeleteScheduleItem}
              onPostponeScheduleItem={handlePostponeScheduleItem}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView
              data={data}
              onOpenAddGoal={() => setIsGoalModalOpen(true)}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              data={data}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsView
              data={data}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              data={data}
              setData={setData}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <HabitModal
        isOpen={isHabitModalOpen}
        editingHabit={editingHabit}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveSchedule}
        habits={data.habits}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
      />

      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration(prev => ({ ...prev, isOpen: false }))}
        title={celebration.title}
        message={celebration.message}
        points={celebration.points}
      />
    </div>
  );
}
