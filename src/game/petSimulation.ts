import { clampStat, type PetState } from '../types/pet';
import { minutesBetween } from '../utils/time';

/** Limita 0–100 sem arredondar (o tick acumula frações; a exibição arredonda). */
function clampFloat(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/** Decaimento por minuto (equilibrado, sem punição exagerada) */
const DECAY_PER_MIN = {
  fome: 0.35,
  felicidade: 0.25,
  energia: 0.15,
  higiene: 0.20,
  saude: 0.05,
};

/** Minutos desde a última diversão (brincar/minigame ou missão resgatada). */
export function minutosSemDiversao(pet: PetState, agora = Date.now()): number {
  const ultima = Math.max(
    pet.ultimoBrincar ?? pet.createdAt,
    pet.ultimaMissao ?? pet.createdAt,
    pet.createdAt,
  );
  return Math.max(0, (agora - ultima) / 60000);
}

/** Minutos desde o último carinho. */
export function minutosSemCarinho(pet: PetState, agora = Date.now()): number {
  return Math.max(0, (agora - (pet.ultimoCarinho ?? pet.createdAt)) / 60000);
}

/** Aplica passagem de tempo offline/online. Max 8h de decaimento para evitar punição exagerada. */
export function applyOfflineProgress(pet: PetState, nowTs = Date.now()): PetState {
  const mins = Math.min(480, minutesBetween(pet.lastSaved, nowTs));
  if (mins < 1) return { ...pet, lastSaved: nowTs };
  const next = { ...pet };
  // Sem brincar nem cumprir missões, a felicidade cai mais (com teto, sem exagero)
  const semDiversao = minutosSemDiversao(pet, nowTs);
  const extraOffline = semDiversao > 5 ? Math.min(20, (semDiversao - 5) * 0.15) : 0;
  // Sem carinho, a felicidade também cai mais
  const semCarinho = minutosSemCarinho(pet, nowTs);
  const extraCarinhoOff = semCarinho > 5 ? Math.min(15, (semCarinho - 5) * 0.12) : 0;
  // De vez em quando ele pega gripe (mais fácil se estiver sujo!)
  if (!next.gripado && mins >= 20) {
    const chance = next.higiene < 20 ? 0.3 : 0.08;
    if (Math.random() < chance) {
      next.gripado = true;
      next.saude = clampStat(next.saude - 12);
    }
  }
  if (next.gripado) {
    next.saude = clampStat(next.saude - Math.min(15, mins * 0.2));
  }
  if (next.dormindo) {
    // dormindo recupera energia, resto cai devagar
    next.energia = clampStat(next.energia + mins * 1.2);
    next.fome = clampStat(next.fome - mins * DECAY_PER_MIN.fome * 0.5);
    next.felicidade = clampStat(next.felicidade - mins * 0.08 - (extraOffline + extraCarinhoOff) * 0.3);
    next.higiene = clampStat(next.higiene - mins * 0.08);
  } else {
    next.fome = clampStat(next.fome - mins * DECAY_PER_MIN.fome);
    next.felicidade = clampStat(next.felicidade - mins * DECAY_PER_MIN.felicidade - extraOffline - extraCarinhoOff);
    next.energia = clampStat(next.energia - mins * DECAY_PER_MIN.energia);
    next.higiene = clampStat(next.higiene - mins * DECAY_PER_MIN.higiene);
    next.saude = clampStat(next.saude - mins * DECAY_PER_MIN.saude);
  }
  // saúde sofre se fome ou higiene zeradas
  if (next.fome <= 5 || next.higiene <= 5) {
    next.saude = clampStat(next.saude - mins * 0.15);
  }
  // peso: bem alimentado ganha devagar, com fome perde
  next.peso = clampStat(next.peso + (next.fome > 60 ? mins * 0.02 : next.fome < 30 ? -mins * 0.05 : 0));
  // muito gordo ou muito magro tira um pouco da saúde
  if (next.peso >= 90 || next.peso <= 10) {
    next.saude = clampStat(next.saude - mins * 0.05);
  }
  // nunca morre: garante mínimo de saúde 10
  if (next.saude < 10) next.saude = 10;
  next.doente = next.gripado || next.saude < 30 || (next.higiene < 15 && next.fome < 15);
  next.lastSaved = nowTs;
  return next;
}

/** Tick pequeno do game loop (a cada 10s) */
export function tickSimulation(pet: PetState): PetState {
  // Quanto mais tempo sem brincar nem cumprir missões, mais a felicidade cai
  const semDiversao = minutosSemDiversao(pet);
  const extra = semDiversao > 5 ? Math.min(0.6, (semDiversao - 5) * 0.03) : 0;
  // Sem carinho, a felicidade também cai mais
  const semCarinho = minutosSemCarinho(pet);
  const extraCarinho = semCarinho > 5 ? Math.min(0.5, (semCarinho - 5) * 0.025) : 0;
  // De vez em quando ele pega gripe (mais fácil se estiver sujo!)
  let gripado = pet.gripado ?? false;
  if (!gripado) {
    const chance = pet.higiene < 20 ? 0.02 : 0.005;
    if (Math.random() < chance) gripado = true;
  }
  if (pet.dormindo) {
    // Dormir recarrega devagar: do zero ao cheio leva cerca de 3 min (pelo menos 2 min).
    return {
      ...pet,
      gripado,
      energia: clampFloat(pet.energia + 6),
      fome: clampFloat(pet.fome - 0.15),
      felicidade: clampFloat(pet.felicidade - 0.05),
      doente: gripado || pet.saude < 30,
      lastSaved: Date.now(),
    };
  }
  const pesoDelta = pet.fome > 70 ? 0.06 : pet.fome < 25 ? -0.12 : 0;
  const pesoFora = pet.peso >= 90 || pet.peso <= 10 ? -0.15 : 0;
  return {
    ...pet,
    gripado,
    fome: clampFloat(pet.fome - 0.12),
    felicidade: clampFloat(pet.felicidade - 0.10 - extra - extraCarinho),
    energia: clampFloat(pet.energia - 0.05),
    higiene: clampFloat(pet.higiene - 0.08),
    peso: clampFloat(pet.peso + pesoDelta),
    saude: clampFloat(pet.saude + (gripado ? -0.4 : (pet.fome > 40 && pet.higiene > 40 ? 0.05 : -0.05)) + pesoFora),
    doente: gripado || pet.saude < 30,
    lastSaved: Date.now(),
  };
}
