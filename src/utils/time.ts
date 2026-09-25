export function now(): number {
  return Date.now();
}

export function minutesBetween(a: number, b: number): number {
  return Math.max(0, (b - a) / 60000);
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  if (m < 1) return `${s}s`;
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}min`;
}
