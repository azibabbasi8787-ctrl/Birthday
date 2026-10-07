// Web Audio API music box & warm chord synthesizer + celebration chime effects

class BirthdaySoundController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private noteIndex: number = 0;
  private masterGain: GainNode | null = null;

  // Gentle music-box rendition of "Happy Birthday" + dreamy arpeggiated interlude
  private readonly melody: Array<{ freq: number; harmony?: number; bass?: number; duration: number; delay: number }> = [
    // Phrase 1: Hap-py Birth-day to you
    { freq: 392.00, bass: 261.63, duration: 0.45, delay: 420 },
    { freq: 392.00, duration: 0.35, delay: 320 },
    { freq: 440.00, harmony: 329.63, bass: 196.00, duration: 0.85, delay: 720 },
    { freq: 392.00, duration: 0.85, delay: 720 },
    { freq: 523.25, harmony: 392.00, bass: 261.63, duration: 0.85, delay: 720 },
    { freq: 493.88, harmony: 392.00, bass: 196.00, duration: 1.4, delay: 1350 },

    // Phrase 2: Hap-py Birth-day to you
    { freq: 392.00, duration: 0.45, delay: 420 },
    { freq: 392.00, duration: 0.35, delay: 320 },
    { freq: 440.00, harmony: 349.23, bass: 196.00, duration: 0.85, delay: 720 },
    { freq: 392.00, duration: 0.85, delay: 720 },
    { freq: 587.33, harmony: 440.00, bass: 196.00, duration: 0.85, delay: 720 },
    { freq: 523.25, harmony: 392.00, bass: 261.63, duration: 1.4, delay: 1350 },

    // Phrase 3: Hap-py Birth-day dear Far-ha
    { freq: 392.00, duration: 0.45, delay: 420 },
    { freq: 392.00, duration: 0.35, delay: 320 },
    { freq: 783.99, harmony: 523.25, bass: 261.63, duration: 0.85, delay: 740 },
    { freq: 659.25, harmony: 493.88, duration: 0.85, delay: 720 },
    { freq: 523.25, harmony: 392.00, bass: 174.61, duration: 0.85, delay: 720 },
    { freq: 493.88, harmony: 349.23, duration: 0.85, delay: 720 },
    { freq: 440.00, harmony: 349.23, bass: 174.61, duration: 1.35, delay: 1300 },

    // Phrase 4: Hap-py Birth-day to you
    { freq: 698.46, harmony: 440.00, duration: 0.45, delay: 420 },
    { freq: 698.46, duration: 0.35, delay: 320 },
    { freq: 659.25, harmony: 523.25, bass: 261.63, duration: 0.85, delay: 720 },
    { freq: 523.25, harmony: 392.00, duration: 0.85, delay: 720 },
    { freq: 587.33, harmony: 493.88, bass: 196.00, duration: 0.85, delay: 740 },
    { freq: 523.25, harmony: 392.00, bass: 261.63, duration: 1.8, delay: 1650 },

    // Dreamy celesta interlude arpeggio
    { freq: 659.25, bass: 261.63, duration: 0.9, delay: 500 },
    { freq: 783.99, duration: 0.9, delay: 500 },
    { freq: 1046.50, harmony: 523.25, duration: 1.5, delay: 1500 },
  ];

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.28;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private playBellNote(freq: number, duration: number, volume = 0.32) {
    const ctx = this.ensureContext();
    if (!this.masterGain) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.08, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(0.0008, now + duration + 0.35);

    osc1.connect(noteGain);
    osc2.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.4);
    osc2.stop(now + duration + 0.4);
  }

  private scheduleNextNote = () => {
    if (!this.isPlaying) return;

    const step = this.melody[this.noteIndex];
    this.playBellNote(step.freq, step.duration, 0.34);

    if (step.harmony) {
      this.playBellNote(step.harmony, step.duration * 1.1, 0.14);
    }
    if (step.bass) {
      this.playBellNote(step.bass, step.duration * 1.35, 0.12);
    }

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.timerId = window.setTimeout(this.scheduleNextNote, step.delay);
  };

  public startMusic(): boolean {
    try {
      this.ensureContext();
      if (this.isPlaying) return true;
      this.isPlaying = true;
      this.scheduleNextNote();
      return true;
    } catch {
      this.isPlaying = false;
      return false;
    }
  }

  public stopMusic(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      return this.startMusic();
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }

  public playSparkleChime(): void {
    try {
      this.ensureContext();
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        window.setTimeout(() => {
          this.playBellNote(freq, 0.8, 0.22);
        }, idx * 65);
      });
    } catch {
      // Ignore
    }
  }

  public playSoftPop(pitchMultiplier = 1): void {
    try {
      const ctx = this.ensureContext();
      if (!this.masterGain) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(680 * pitchMultiplier, now + 0.09);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }
}

export const soundController = new BirthdaySoundController();
