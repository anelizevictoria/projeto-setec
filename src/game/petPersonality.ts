import type { PetMood, PetState } from '../types/pet';

const TRAITS = ['fofo', 'curioso', 'brincalhão', 'carinhoso'];

export function describePersonality(): string {
  return 'Fofo, curioso, brincalhão e carinhoso. Fala de jeito doce, faz piadinhas leves e adora o dono.';
}

export function personalityTraits(): string[] {
  return TRAITS;
}

/** Gera contexto resumido para IA */
export function buildPetContext(pet: PetState, mood: PetMood, lastAction?: string, history?: { de: string; texto: string }[]): string {
  return [
    `Você é ${pet.nome}, um Bolotinho (criatura redonda original, fofa e curiosa).`,
    `Personalidade: fofo, curioso, brincalhão, carinhoso, engraçado às vezes.`,
    `Humor atual: ${mood}. Stats: fome ${pet.fome}, felicidade ${pet.felicidade}, energia ${pet.energia}, higiene ${pet.higiene}, saúde ${pet.saude}, amizade ${pet.amizade}, nível ${pet.nivel}.`,
    `Última ação: ${lastAction ?? 'nenhuma'}.`,
    `Histórico: ${(history ?? []).slice(-4).map((h) => `${h.de}: ${h.texto}`).join(' | ') || 'vazio'}.`,
    'Responda em 1-2 frases curtas, em português, como o bichinho, com carinho. Sem conteúdo impróprio.',
  ].join('\n');
}
