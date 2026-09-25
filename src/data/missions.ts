import type { MissionDef } from '../types/items';

// Moedas vêm SOMENTE dos minigames: missões dão XP.
export const ALL_MISSIONS: MissionDef[] = [
  { id: 'alimentar-3', titulo: 'Hora do lanche', descricao: 'Alimente o Bubi 3 vezes', emoji: '🍖', meta: 3, recompensaMoedas: 0, recompensaXp: 20, tipoAcao: 'alimentar' },
  { id: 'brincar-2', titulo: 'Parque divertido', descricao: 'Brinque 2 vezes', emoji: '🎮', meta: 2, recompensaMoedas: 0, recompensaXp: 18, tipoAcao: 'brincar' },
  { id: 'carinho-3', titulo: 'Chuva de carinho', descricao: 'Faça carinho 3 vezes', emoji: '❤️', meta: 3, recompensaMoedas: 0, recompensaXp: 15, tipoAcao: 'carinho' },
  { id: 'limpar-1', titulo: 'Banho de espuma', descricao: 'Limpe o Bubi 1 vez', emoji: '🧼', meta: 1, recompensaMoedas: 0, recompensaXp: 12, tipoAcao: 'limpar' },
  { id: 'conversar-2', titulo: 'Bate-papo', descricao: 'Converse 2 vezes', emoji: '💬', meta: 2, recompensaMoedas: 0, recompensaXp: 15, tipoAcao: 'conversar' },
  { id: 'minigame-1', titulo: 'Campeão dos jogos', descricao: 'Jogue um minigame 1 vez', emoji: '🏆', meta: 1, recompensaMoedas: 0, recompensaXp: 25, tipoAcao: 'minigame' },
  { id: 'cuidar-5', titulo: 'Super cuidador', descricao: 'Cuide do Bubi 5 vezes (qualquer ação)', emoji: '⭐', meta: 5, recompensaMoedas: 0, recompensaXp: 25, tipoAcao: 'cuidar' },
];
