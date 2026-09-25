import { clampStat, type PetState } from '../types/pet';
import { pick } from '../utils/random';
import { ganharXp } from './progression';

export interface AcaoResultado {
  pet: PetState;
  mensagem: string;
  xpGanho: number;
  moedasGanhas: number;
  subiuNivel: boolean;
}

function aplicaXpEMoedas(pet: PetState, xp: number, moedas: number): { pet: PetState; subiu: boolean; niveis: number } {
  const r = ganharXp(pet.xp, pet.nivel, xp);
  // Moedas SÓ vêm dos minigames: aqui nunca há bônus em moedas (nem ao subir de nível).
  const moedasFinais = pet.moedas + moedas;
  return {
    pet: { ...pet, xp: r.xp, nivel: r.nivel, moedas: Math.max(0, moedasFinais) },
    subiu: r.subiu,
    niveis: r.niveisGanhos,
  };
}

export function alimentar(pet: PetState, valor = 22): AcaoResultado {
  if (pet.dormindo) return { pet, mensagem: 'Shhh... estou dormindo! 😴', xpGanho: 0, moedasGanhas: 0, subiuNivel: false };
  const base: PetState = {
    ...pet,
    fome: clampStat(pet.fome + valor),
    felicidade: clampStat(pet.felicidade + 6),
    saude: clampStat(pet.saude + 2),
    peso: clampStat(pet.peso + 6),
    lastAction: 'alimentar',
  };
  const xp = pick([4, 5, 6, 8]);
  const moedas = 0; // moedas só nos minigames
  const { pet: final, subiu } = aplicaXpEMoedas(base, xp, moedas);
  return {
    pet: final,
    mensagem: pick(['Nhom nhom! Delícia! 😋', 'Hmmm, que gostoso! Obrigado!', 'Barriguinha cheia, coração feliz! 💛']),
    xpGanho: xp,
    moedasGanhas: moedas,
    subiuNivel: subiu,
  };
}

export function brincar(pet: PetState): AcaoResultado {
  if (pet.dormindo) return { pet, mensagem: 'Zzz... depois brincamos! 😴', xpGanho: 0, moedasGanhas: 0, subiuNivel: false };
  const base: PetState = {
    ...pet,
    felicidade: clampStat(pet.felicidade + 14),
    energia: clampStat(pet.energia - 10),
    fome: clampStat(pet.fome - 5),
    higiene: clampStat(pet.higiene - 3),
    amizade: clampStat(pet.amizade + 4),
    peso: clampStat(pet.peso - 2),
    lastAction: 'brincar',
  };
  const xp = pick([8, 10, 12]);
  const moedas = 0; // moedas só nos minigames
  const { pet: final, subiu } = aplicaXpEMoedas(base, xp, moedas);
  return {
    pet: final,
    mensagem: pick(['Uhuul! Isso foi divertido! 🎮', 'De novo! De novo! 🤩', 'Você é o melhor parceiro de brincadeira!']),
    xpGanho: xp,
    moedasGanhas: moedas,
    subiuNivel: subiu,
  };
}

export function carinho(pet: PetState): AcaoResultado {
  if (pet.dormindo) return { pet, mensagem: 'Mmm... 😴💤', xpGanho: 0, moedasGanhas: 0, subiuNivel: false };
  const base: PetState = {
    ...pet,
    felicidade: clampStat(pet.felicidade + 10),
    amizade: clampStat(pet.amizade + 5),
    saude: clampStat(pet.saude + 1),
    lastAction: 'carinho',
  };
  const xp = pick([5, 6, 8]);
  const moedas = 0; // moedas só nos minigames
  const { pet: final, subiu } = aplicaXpEMoedas(base, xp, moedas);
  return {
    pet: final,
    mensagem: pick(['Que cafuné gostoso! ❤️', 'Ronron... quero dizer... blub-blub de felicidade!', 'Amo carinho! Fico todo derretido! 🥰']),
    xpGanho: xp,
    moedasGanhas: moedas,
    subiuNivel: subiu,
  };
}

export function limpar(pet: PetState): AcaoResultado {
  if (pet.dormindo) return { pet, mensagem: 'Banho depois que eu acordar... 💤', xpGanho: 0, moedasGanhas: 0, subiuNivel: false };
  const base: PetState = {
    ...pet,
    higiene: clampStat(pet.higiene + 30),
    saude: clampStat(pet.saude + 6),
    felicidade: clampStat(pet.felicidade + 4),
    lastAction: 'limpar',
  };
  const xp = pick([6, 7, 9]);
  const moedas = 0; // moedas só nos minigames
  const { pet: final, subiu } = aplicaXpEMoedas(base, xp, moedas);
  return {
    pet: final,
    mensagem: pick(['Bolhas! Adoro banho de espuma! 🧼🫧', 'Limpinho e cheiroso! ✨', 'Splish splash! Que refrescante!']),
    xpGanho: xp,
    moedasGanhas: moedas,
    subiuNivel: subiu,
  };
}

export function alternarDormir(pet: PetState): { pet: PetState; mensagem: string } {
  if (pet.dormindo) {
    // Acordar não dá energia de graça: é preciso dormir de verdade (±2 min).
    const acordado: PetState = {
      ...pet,
      dormindo: false,
      lastAction: 'acordar',
    };
    return { pet: acordado, mensagem: pick(['Bom dia! Dormi super bem! ☀️', 'Acordei! Vamos brincar? 🤩', 'Espreguiçando... bluuub! Pronto!']) };
  }
  const dormindo: PetState = { ...pet, dormindo: true, lastAction: 'dormir' };
  return { pet: dormindo, mensagem: 'Boa noite... Zzz... 😴🌙' };
}

export function usarItemComida(pet: PetState, efeito: { fome?: number; felicidade?: number; energia?: number; saude?: number; peso?: number }, xp = 4): AcaoResultado {
  const base: PetState = {
    ...pet,
    fome: clampStat(pet.fome + (efeito.fome ?? 15)),
    felicidade: clampStat(pet.felicidade + (efeito.felicidade ?? 5)),
    energia: clampStat(pet.energia + (efeito.energia ?? 0)),
    saude: clampStat(pet.saude + (efeito.saude ?? 1)),
    peso: clampStat(pet.peso + (efeito.peso ?? 3)),
    lastAction: 'usar-item',
  };
  const { pet: final, subiu } = aplicaXpEMoedas(base, xp, 0);
  return { pet: final, mensagem: 'Hmmm, que lanchinho bom! 😋', xpGanho: xp, moedasGanhas: 0, subiuNivel: subiu };
}

export function dancar(pet: PetState): AcaoResultado {
  if (pet.dormindo) return { pet, mensagem: 'Zzz... eu danço depois, tá? 😴', xpGanho: 0, moedasGanhas: 0, subiuNivel: false };
  const base: PetState = {
    ...pet,
    felicidade: clampStat(pet.felicidade + 8),
    energia: clampStat(pet.energia - 8),
    lastAction: 'dancar',
  };
  const xp = pick([5, 6, 8]);
  const { pet: final, subiu } = aplicaXpEMoedas(base, xp, 0);
  return {
    pet: final,
    mensagem: pick(['Wub wub wub! Vamos dançar! 🕺🎵', 'Bola de bolha no ritmo: blub-blub-dá! 🎶', 'Música! Meu corpinho redondo tá pronto! 💃']),
    xpGanho: xp,
    moedasGanhas: 0,
    subiuNivel: subiu,
  };
}

export function curar(pet: PetState): PetState {
  return { ...pet, saude: clampStat(pet.saude + 25), higiene: clampStat(pet.higiene + 10), doente: false };
}
