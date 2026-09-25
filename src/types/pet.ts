export type PetAnimation =
  | 'idle' | 'happy' | 'sad' | 'hungry' | 'tired'
  | 'sleeping' | 'eating' | 'playing' | 'talking' | 'dancando'
  | 'surprised' | 'angry' | 'sick' | 'cleaning' | 'celebrating';

export type PetMood =
  | 'feliz' | 'normal' | 'triste' | 'faminto'
  | 'cansado' | 'sujo' | 'doente' | 'animado';

export interface PetStats {
  fome: number; // 0-100 (100 = saciado)
  felicidade: number;
  energia: number;
  higiene: number;
  saude: number;
  amizade: number; // 0-100
}

export interface PetState extends PetStats {
  nome: string;
  especie: string;
  xp: number;
  nivel: number;
  moedas: number;
  peso: number; // 0-100 (50 = normal; engorda comendo, emagrece com fome/brincando)
  dormindo: boolean;
  doente: boolean;
  lastSaved: number;
  lastAction?: string;
  ultimoBrincar?: number; // timestamp da última brincadeira/minigame
  ultimaMissao?: number; // timestamp da última missão resgatada
  ultimoCarinho?: number; // timestamp do último carinho
  gripado?: boolean; // está gripado? só remédio cura!
  equippedAccessory?: string;
  placedDecoration?: string;
  createdAt: number;
}

export interface GameSettings {
  som: boolean;
  volume: number; // 0-1
  voz: boolean;
  modoEconomia: boolean;
}

export const DEFAULT_STATS: PetStats = {
  fome: 80,
  felicidade: 80,
  energia: 90,
  higiene: 85,
  saude: 95,
  amizade: 10,
};

export function createInitialPet(nome = 'Bubi'): PetState {
  const now = Date.now();
  return {
    ...DEFAULT_STATS,
    nome,
    especie: 'Bolotinho',
    xp: 0,
    nivel: 1,
    moedas: 50,
    peso: 50,
    dormindo: false,
    doente: false,
    lastSaved: now,
    createdAt: now,
    ultimoBrincar: now,
    ultimaMissao: now,
    ultimoCarinho: now,
    gripado: false,
  };
}

export function clampStat(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}
