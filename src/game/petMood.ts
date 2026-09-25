import type { PetMood, PetState } from '../types/pet';

export function getMood(pet: PetState): PetMood {
  if (pet.dormindo) return 'cansado';
  if (pet.gripado || pet.saude < 30) return 'doente';
  if (pet.fome < 25) return 'faminto';
  if (pet.energia < 25) return 'cansado';
  if (pet.higiene < 25) return 'sujo';
  if (pet.felicidade < 30) return 'triste';
  if (pet.felicidade > 80 && pet.energia > 60) return 'animado';
  if (pet.felicidade > 60) return 'feliz';
  return 'normal';
}

export const MOOD_EMOJI: Record<PetMood, string> = {
  feliz: '😊',
  normal: '🙂',
  triste: '😢',
  faminto: '🍽️',
  cansado: '😴',
  sujo: '🧼',
  doente: '🤒',
  animado: '🤩',
};

export const MOOD_LABEL: Record<PetMood, string> = {
  feliz: 'Feliz',
  normal: 'Tranquilo',
  triste: 'Triste',
  faminto: 'Faminto',
  cansado: 'Cansado',
  sujo: 'Sujinho',
  doente: 'Doentinho',
  animado: 'Animado',
};
