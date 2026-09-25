export type ItemType = 'comida' | 'brinquedo' | 'acessorio' | 'decoracao';

export interface ShopItem {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  tipo: ItemType;
  emoji: string;
  efeito?: {
    fome?: number;
    felicidade?: number;
    energia?: number;
    higiene?: number;
    saude?: number;
    amizade?: number;
    xp?: number;
    peso?: number;
  };
  descontoNivel?: number; // nível mínimo para comprar
}

export type InventoryMap = Record<string, number>;

export interface MissionDef {
  id: string;
  titulo: string;
  descricao: string;
  emoji: string;
  meta: number;
  recompensaMoedas: number;
  recompensaXp: number;
  tipoAcao: string; // 'alimentar' | 'brincar' | ...
}

export interface MissionProgress extends MissionDef {
  progresso: number;
  concluida: boolean;
  resgatada: boolean;
}
