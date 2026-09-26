// Web Audio API Procedural Sound Effects Engine for teamup
// High-performance, zero external asset dependencies, zero latency UI sound feedback

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private lastClickTime: number = 0;
  private clickThrottleMs: number = 25; // Prevent audio tearing on rapid clicks

  constructor() {
    // Read user preference from localStorage (default enabled)
    try {
      const stored = localStorage.getItem('teamup_sound_enabled');
      this.soundEnabled = stored === null ? true : stored === 'true';
    } catch {
      this.soundEnabled = true;
    }
  }

  /**
   * Lazily initializes or resumes the AudioContext on user interaction
   */
  private getAudioContext(): AudioContext | null {
    if (!this.soundEnabled) return null;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;

      if (!this.ctx) {
        this.ctx = new AudioCtxClass();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      return this.ctx;
    } catch (err) {
      console.warn('AudioContext initialization error:', err);
      return null;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('teamup_sound_enabled', enabled ? 'true' : 'false');
    } catch {
      // Ignore localStorage errors
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.soundEnabled);
    if (this.soundEnabled) {
      this.playToggle(true);
    }
    return this.soundEnabled;
  }

  /**
   * Crisp, subtle tactile click for every button, link, and interactive element
   */
  public playClick(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = performance.now();
    if (now - this.lastClickTime < this.clickThrottleMs) return;
    this.lastClickTime = now;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      const startTime = ctx.currentTime;
      const duration = 0.025;

      // Frequency drop for tactile pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, startTime);
      osc.frequency.exponentialRampToValueAtTime(140, startTime + duration);

      // Low pass to ensure smooth non-piercing sound
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, startTime);

      // Gentle gain envelope
      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio playback failed silently
    }
  }

  /**
   * Punchy snap click for primary action buttons (e.g. Create, Submit, Save)
   */
  public playButton(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime;
      const duration = 0.038;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(520, startTime);
      osc1.frequency.exponentialRampToValueAtTime(180, startTime + duration);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(780, startTime);
      osc2.frequency.exponentialRampToValueAtTime(220, startTime + duration);

      gain.gain.setValueAtTime(0.11, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    } catch {
      // Silent error
    }
  }

  /**
   * Rising dual-tone blip for switches, theme toggles, and filters
   */
  public playToggle(isTurningOn: boolean = true): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (isTurningOn) {
        osc.frequency.setValueAtTime(420, startTime);
        osc.frequency.exponentialRampToValueAtTime(680, startTime + 0.045);
      } else {
        osc.frequency.setValueAtTime(680, startTime);
        osc.frequency.exponentialRampToValueAtTime(420, startTime + 0.045);
      }

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.05);
    } catch {
      // Silent error
    }
  }

  /**
   * Harmonious chord arpeggio for squad-ups, confetti bursts, match score 90%+
   */
  public playSquadUp(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.0 },   // C5
        { freq: 659.25, time: 0.05 },  // E5
        { freq: 783.99, time: 0.10 },  // G5
        { freq: 1046.50, time: 0.16 }, // C6
      ];

      notes.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + time);

        gain.gain.setValueAtTime(0.12, startTime + time);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + time + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime + time);
        osc.stop(startTime + time + 0.22);
      });
    } catch {
      // Silent error
    }
  }

  /**
   * Gentle wooden tap for pass, cancel, or reject actions
   */
  public playPass(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime;
      const duration = 0.035;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, startTime);
      osc.frequency.exponentialRampToValueAtTime(140, startTime + duration);

      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Silent error
    }
  }

  /**
   * Smooth navigation tab change tick
   */
  public playTab(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime;
      const duration = 0.028;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, startTime);
      osc.frequency.exponentialRampToValueAtTime(300, startTime + duration);

      gain.gain.setValueAtTime(0.07, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Silent error
    }
  }

  /**
   * Modal open acoustic whoosh
   */
  public playModalOpen(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime;
      const duration = 0.06;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, startTime);
      osc.frequency.exponentialRampToValueAtTime(540, startTime + duration);

      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Silent error
    }
  }
}

// Singleton instance
export const soundEffects = new SoundEffectsService();

/**
 * Attaches a global window click listener that plays appropriate procedural sound
 * feedback on every user interaction across the entire website.
 */
export function initGlobalClickSound(): () => void {
  const handleGlobalClick = (event: MouseEvent) => {
    // Check what was clicked
    const target = event.target as HTMLElement | null;
    if (!target) {
      soundEffects.playClick();
      return;
    }

    // Check if the clicked element or any parent matches interactive controls
    const buttonOrLink = target.closest('button, a, input, select, textarea, [role="button"], [role="tab"], [role="switch"]');
    
    if (buttonOrLink) {
      const text = (buttonOrLink.textContent || '').toLowerCase();
      const ariaLabel = (buttonOrLink.getAttribute('aria-label') || '').toLowerCase();
      const title = (buttonOrLink.getAttribute('title') || '').toLowerCase();
      const combined = `${text} ${ariaLabel} ${title}`;

      // Check for theme toggle or switches
      if (
        combined.includes('theme') ||
        combined.includes('mode') ||
        buttonOrLink.getAttribute('role') === 'switch' ||
        buttonOrLink.classList.contains('toggle')
      ) {
        soundEffects.playToggle(true);
        return;
      }

      // Check for Squad Up, Match, Accept, or celebration
      if (
        combined.includes('squad up') ||
        combined.includes('accept') ||
        combined.includes('send join') ||
        combined.includes('create squad') ||
        combined.includes('create team')
      ) {
        soundEffects.playSquadUp();
        return;
      }

      // Check for Pass, Reject, Close, Cancel, Decline
      if (
        combined.includes('pass') ||
        combined.includes('decline') ||
        combined.includes('reject') ||
        combined.includes('delete') ||
        combined.includes('remove')
      ) {
        soundEffects.playPass();
        return;
      }

      // Check for navigation tabs
      if (
        buttonOrLink.getAttribute('role') === 'tab' ||
        buttonOrLink.closest('nav') ||
        buttonOrLink.classList.contains('nav-tab')
      ) {
        soundEffects.playTab();
        return;
      }

      // Check for primary action buttons
      if (
        buttonOrLink.classList.contains('btn-primary-coral') ||
        buttonOrLink.classList.contains('bg-[#ff4d15]') ||
        combined.includes('submit') ||
        combined.includes('save')
      ) {
        soundEffects.playButton();
        return;
      }

      // Default interactive element click
      soundEffects.playClick();
      return;
    }

    // Check for clickable cards or interactive containers (e.g. cursor-pointer)
    const clickableContainer = target.closest('.cursor-pointer, [data-clickable="true"]');
    if (clickableContainer) {
      soundEffects.playClick();
      return;
    }

    // Subtle micro-tap on any other click on the page
    soundEffects.playClick();
  };

  window.addEventListener('click', handleGlobalClick, { capture: true });

  return () => {
    window.removeEventListener('click', handleGlobalClick, { capture: true });
  };
}
