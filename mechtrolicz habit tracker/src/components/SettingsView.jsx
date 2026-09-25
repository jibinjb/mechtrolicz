import React, { useState } from 'react';
import { User, Bell, Volume2, Download, Upload, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { getInitialData, savePlannerData } from '../utils/storage';
import { soundEffects } from '../utils/audio';

export default function SettingsView({ data, setData, theme, toggleTheme }) {
  const [name, setName] = useState(data.user.name);
  const [email, setEmail] = useState(data.user.email);
  const [title, setTitle] = useState(data.user.levelTitle);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        name,
        email,
        levelTitle: title
      }
    }));
    soundEffects.playSuccess();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `habit_routine_planner_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.habits && parsed.user) {
            setData(parsed);
            savePlannerData(parsed);
            soundEffects.playSuccess();
            alert('Planner data imported successfully!');
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset all habits, schedules, and completions back to rich demo dataset?')) {
      const initial = getInitialData();
      setData(initial);
      savePlannerData(initial);
      soundEffects.playSuccess();
    }
  };

  return (
    <div className="settings-page animate-fade" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Settings & Preferences</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your account profile, sound preferences, and data backups
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <User size={20} />
            </div>
            <div>
              <h3 className="card-title">User Profile</h3>
              <p className="card-subtitle">Personal information and identity</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Productivity Title / Bio</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Consistent Achiever, High Performer"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '20px' }}>
            <button type="submit" className="btn-primary">
              <span>Save Changes</span>
            </button>
            {savedSuccess && (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: 600 }}>
                <Check size={16} /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* App Preferences */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Bell size={20} />
            </div>
            <div>
              <h3 className="card-title">Notifications & Sound</h3>
              <p className="card-subtitle">Auditory and reminder configurations</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Audio Feedback (Web Audio Chimes)</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Play pleasant harmonic chime on habit check and celebration sounds on level up
              </div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                soundEffects.enabled = !data.user.soundEnabled;
                setData(prev => ({
                  ...prev,
                  user: { ...prev.user, soundEnabled: soundEffects.enabled }
                }));
                if (soundEffects.enabled) soundEffects.playSuccess();
              }}
            >
              {data.user.soundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Theme Mode</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Currently using {theme === 'dark' ? 'Midnight Dark' : 'Clean Light'} theme
              </div>
            </div>
            <button className="btn-secondary" onClick={toggleTheme}>
              Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="card-title">Data Storage & Portability</h3>
              <p className="card-subtitle">Export or restore your habit data at any time</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={handleExportData}>
            <Download size={16} />
            <span>Export Backup JSON</span>
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Import Backup JSON</span>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportData}
            />
          </label>

          <button
            className="btn-outline-danger"
            style={{ marginLeft: 'auto' }}
            onClick={handleResetSampleData}
          >
            <RotateCcw size={16} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
