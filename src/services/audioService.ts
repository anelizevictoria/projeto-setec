/** Serviço de áudio usando Web Audio API (sem assets externos). */

let ctx: AudioContext | null = null;
let enabled = true;
let volume = 0.6;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function configurarAudio(som: boolean, vol: number): void {
  enabled = som;
  volume = Math.max(0, Math.min(1, vol));
}

function beep(freq: number, dur = 0.12, tipo: OscillatorType = 'sine', quando = 0, volMult = 1): void {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    const t = ac.currentTime + quando;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.35 * volMult), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  } catch {
    // sem áudio disponível
  }
}

export const audioService = {
  clique() { beep(520, 0.08, 'sine'); },
  comer() { beep(300, 0.1, 'square', 0); beep(420, 0.1, 'square', 0.1); beep(350, 0.12, 'square', 0.2); },
  carinho() { beep(660, 0.15, 'sine', 0); beep(880, 0.2, 'sine', 0.12); },
  recompensa() { beep(523, 0.12, 'triangle', 0); beep(659, 0.12, 'triangle', 0.12); beep(784, 0.2, 'triangle', 0.24); },
  erro() { beep(180, 0.2, 'sawtooth', 0, 0.7); },
  nivel() { [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.18, 'triangle', i * 0.13)); },
  pop() { beep(750, 0.07, 'square', 0, 0.8); },
  dormir() { beep(440, 0.25, 'sine', 0); beep(330, 0.3, 'sine', 0.22); },
  sucesso() { beep(600, 0.1, 'sine', 0); beep(900, 0.15, 'sine', 0.1); },
  danca() { [392, 523, 659, 784, 659, 784].forEach((f, i) => beep(f, 0.12, 'triangle', i * 0.11, 0.9)); },
};

export function isAudioSupported(): boolean {
  try {
    return !!(window.AudioContext || (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext);
  } catch {
    return false;
  }
}
