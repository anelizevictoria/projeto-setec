import type { ShopItem } from '../types/items';

export const FOODS: ShopItem[] = [
  { id: 'maca-bolha', nome: 'Maçã Bolha', preco: 10, descricao: '+18 fome, +4 felicidade. Crocante e suculenta!', tipo: 'comida', emoji: '🍎', efeito: { fome: 18, felicidade: 4, peso: 5 } },
  { id: 'bolo-arcoiris', nome: 'Bolo Arco-íris', preco: 25, descricao: '+30 fome, +10 felicidade. Festa em cada mordida!', tipo: 'comida', emoji: '🍰', efeito: { fome: 30, felicidade: 10, peso: 12 } },
  { id: 'suco-estelar', nome: 'Suco Estelar', preco: 15, descricao: '+12 fome, +8 energia. Brilha no escuro!', tipo: 'comida', emoji: '🧃', efeito: { fome: 12, felicidade: 5, energia: 8, peso: 4 } },
  { id: 'pizza-nuvem', nome: 'Pizza Nuvem', preco: 30, descricao: '+35 fome, +8 felicidade. Fofinha como nuvem!', tipo: 'comida', emoji: '🍕', efeito: { fome: 35, felicidade: 8, peso: 14 } },
  { id: 'vitamina-lunar', nome: 'Vitamina Lunar', preco: 20, descricao: '+15 fome, +10 saúde. Receita da vovó Bolota!', tipo: 'comida', emoji: '🥤', efeito: { fome: 15, felicidade: 6, saude: 10, peso: 3 } },
  { id: 'cha-cura', nome: 'Chá Curativo', preco: 35, descricao: '+25 saúde. Cura a gripe do Bolotinho! 🤧', tipo: 'comida', emoji: '🍵', efeito: { saude: 25, fome: 5, peso: 1 } },
  { id: 'remedio-bolha', nome: 'Remédio Bolha', preco: 40, descricao: '+35 saúde. Cura a gripe na hora! 💊', tipo: 'comida', emoji: '💊', efeito: { saude: 35, fome: 5, felicidade: 4, peso: 1 } },
];

export const TOYS: ShopItem[] = [
  { id: 'bola-pula', nome: 'Bola Pula-Pula', preco: 20, descricao: 'Brincar rende +5 felicidade extra.', tipo: 'brinquedo', emoji: '⚽', efeito: { felicidade: 5 } },
  { id: 'patinho-flut', nome: 'Patinho Flutuante', preco: 30, descricao: 'Companhia para o banho. +higiene divertida!', tipo: 'brinquedo', emoji: '🦆', efeito: { felicidade: 8 } },
  { id: 'cubo-magico', nome: 'Cubo Mágico', preco: 45, descricao: 'Desafia a mente. Dá XP extra ao brincar.', tipo: 'brinquedo', emoji: '🧊', efeito: { felicidade: 10, xp: 5 } },
  { id: 'pipa-vento', nome: 'Pipa Vento Leve', preco: 35, descricao: 'Perfeita para dias animados no parque.', tipo: 'brinquedo', emoji: '🪁', efeito: { felicidade: 8 } },
  { id: 'tamborim', nome: 'Tamborim Tantan', preco: 40, descricao: 'Faz barulhinho feliz. Adoro dançar!', tipo: 'brinquedo', emoji: '🥁', efeito: { felicidade: 9 } },
];

export const ACCESSORIES: ShopItem[] = [
  { id: 'laco-rosa', nome: 'Lacinho Rosa', preco: 50, descricao: 'Um laço charmoso para a cabeça.', tipo: 'acessorio', emoji: '🎀' },
  { id: 'oculos-sol', nome: 'Óculos de Sol', preco: 60, descricao: 'Estilo total para dias ensolarados.', tipo: 'acessorio', emoji: '🕶️' },
  { id: 'chapeu-festa', nome: 'Chapéu de Festa', preco: 55, descricao: 'Sempre pronto para comemorar!', tipo: 'acessorio', emoji: '🎩' },
  { id: 'cachecol-quente', nome: 'Cachecol Quentinho', preco: 45, descricao: 'Perfeito para noites frias.', tipo: 'acessorio', emoji: '🧣' },
  { id: 'coroa-mini', nome: 'Mini Coroa', preco: 120, descricao: 'Para o Bolotinho mais real do reino! Desbloqueia no nível 3.', tipo: 'acessorio', emoji: '👑', descontoNivel: 3 },
];

export const DECORATIONS: ShopItem[] = [
  { id: 'tapete-nuvem', nome: 'Tapete Nuvem', preco: 40, descricao: 'Deixa o cantinho mais fofinho.', tipo: 'decoracao', emoji: '☁️' },
  { id: 'luminaria-estrela', nome: 'Luminária Estrela', preco: 70, descricao: 'Brilha à noite no cenário.', tipo: 'decoracao', emoji: '🌟' },
  { id: 'vaso-flor', nome: 'Vaso Florido', preco: 35, descricao: 'Flores que nunca murcham.', tipo: 'decoracao', emoji: '🌷' },
  { id: 'quadro-mar', nome: 'Quadro do Mar', preco: 55, descricao: 'Uma janelinha para o oceano.', tipo: 'decoracao', emoji: '🌊' },
  { id: 'tenda-listrada', nome: 'Tenda Listrada', preco: 90, descricao: 'Um mini parque de diversões! Nível 2+.', tipo: 'decoracao', emoji: '🎪', descontoNivel: 2 },
];

export const ALL_ITEMS: ShopItem[] = [...FOODS, ...TOYS, ...ACCESSORIES, ...DECORATIONS];

export function getItemById(id: string): ShopItem | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}
