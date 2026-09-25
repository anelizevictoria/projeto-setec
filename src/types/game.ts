import type { InventoryMap, MissionProgress } from './items';
import type { GameSettings, PetState } from './pet';

export interface SaveData {
  version: 1;
  pet: PetState;
  inventario: InventoryMap;
  missoes: MissionProgress[];
  missoesData: string; // yyyy-mm-dd
  contadores: Record<string, number>; // ações do dia p/ missões
  configuracoes: GameSettings;
}

export interface ChatMessage {
  id: string;
  de: 'jogador' | 'pet';
  texto: string;
  quando: number;
}
