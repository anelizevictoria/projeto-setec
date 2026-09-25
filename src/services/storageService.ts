import { createInitialPet } from '../types/pet';
import type { GameSettings } from '../types/pet';
import type { InventoryMap } from '../types/items';
import type { SaveData } from '../types/game';
import { isValidSave } from '../utils/validation';
import { gerarMissoesDiarias } from '../game/missions';
import { todayKey } from '../utils/time';

const KEY = 'bubi-bolotinho-save-v1';

export const DEFAULT_SETTINGS: GameSettings = {
  som: true,
  volume: 0.6,
  voz: true,
  modoEconomia: false,
};

export function criarSaveNovo(): SaveData {
  const hoje = todayKey();
  return {
    version: 1,
    pet: createInitialPet('Bubi'),
    inventario: { 'maca-bolha': 2 } as InventoryMap,
    missoes: gerarMissoesDiarias(hoje),
    missoesData: hoje,
    contadores: {},
    configuracoes: { ...DEFAULT_SETTINGS },
  };
}

export function carregarSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return criarSaveNovo();
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidSave(parsed)) return criarSaveNovo();
    const data = parsed as SaveData;
    // migração: saves antigos não têm os carimbos de diversão — considera "agora"
    const agora = Date.now();
    if (data.pet.ultimoBrincar == null) data.pet.ultimoBrincar = agora;
    if (data.pet.ultimaMissao == null) data.pet.ultimaMissao = agora;
    if (data.pet.ultimoCarinho == null) data.pet.ultimoCarinho = agora;
    if (data.pet.gripado == null) data.pet.gripado = false;
    if (typeof data.pet.peso !== 'number' || Number.isNaN(data.pet.peso)) data.pet.peso = 50;
    // garante missões do dia
    const hoje = todayKey();
    if (data.missoesData !== hoje) {
      data.missoes = gerarMissoesDiarias(hoje);
      data.missoesData = hoje;
      data.contadores = {};
    }
    if (!data.configuracoes) data.configuracoes = { ...DEFAULT_SETTINGS };
    if (!data.inventario) data.inventario = {};
    return data;
  } catch {
    return criarSaveNovo();
  }
}

export function salvarSave(data: SaveData): void {
  try {
    const out: SaveData = { ...data, pet: { ...data.pet, lastSaved: Date.now() } };
    localStorage.setItem(KEY, JSON.stringify(out));
  } catch {
    // ignora falha de storage (modo privado etc.)
  }
}

export function apagarSave(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignora
  }
}

export function exportarSave(data: SaveData): string {
  return JSON.stringify(data);
}
