export function sanitizeChatInput(s: string): string {
  return s.trim().slice(0, 200);
}

export function isValidPetName(s: string): boolean {
  const t = s.trim();
  return t.length >= 1 && t.length <= 20;
}

export function isValidSave(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  if (o['version'] !== 1) return false;
  if (!o['pet'] || typeof o['pet'] !== 'object') return false;
  return true;
}
