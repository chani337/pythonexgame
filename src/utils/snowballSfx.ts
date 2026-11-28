// Sound for the snowball games (SnowballFight, SnowballDuel): a few
// synthesized blips, no audio files. Muting is remembered per browser.

export type SoundName = 'throw' | 'hit' | 'golden' | 'hurt' | 'thud' | 'power' | 'boss' | 'bossThrow' | 'bossDown' | 'over' | 'win';

export const MUTE_KEY = 'pyquests_snowball_muted';

export function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export class Sfx {
  private ctx: AudioContext | null = null;

  /** Must run inside a user gesture (the start button) or browsers keep it silent. */
  unlock() {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    void this.ctx.resume();
  }

  close() {
    void this.ctx?.close();
    this.ctx = null;
  }

  private tone(type: OscillatorType, from: number, to: number, dur: number, vol: number, delay = 0) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  play(name: SoundName) {
    switch (name) {
      case 'throw':
        return this.tone('triangle', 520, 260, 0.07, 0.05);
      case 'hit':
        return this.tone('square', 340, 110, 0.1, 0.07);
      case 'golden':
        this.tone('triangle', 880, 880, 0.08, 0.08);
        return this.tone('triangle', 1320, 1320, 0.12, 0.08, 0.08);
      case 'hurt':
        return this.tone('sawtooth', 200, 55, 0.28, 0.1);
      case 'thud':
        return this.tone('sine', 140, 70, 0.08, 0.08);
      case 'power':
        [660, 830, 990, 1320].forEach((f, i) => this.tone('triangle', f, f, 0.09, 0.07, i * 0.07));
        return;
      case 'boss':
        this.tone('sawtooth', 110, 90, 0.45, 0.09);
        return this.tone('sawtooth', 82, 70, 0.6, 0.09, 0.4);
      case 'bossThrow':
        return this.tone('square', 180, 120, 0.12, 0.05);
      case 'bossDown':
        [523, 659, 784, 1046].forEach((f, i) => this.tone('square', f, f, 0.14, 0.07, i * 0.11));
        return;
      case 'win':
        [523, 659, 784, 1046, 1318].forEach((f, i) => this.tone('triangle', f, f, 0.16, 0.08, i * 0.1));
        return;
      case 'over':
        [392, 330, 262].forEach((f, i) => this.tone('triangle', f, f * 0.98, 0.22, 0.08, i * 0.2));
        return;
    }
  }
}
