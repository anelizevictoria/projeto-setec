import type { MissionDef, MissionProgress } from '../types/items';
import { ALL_MISSIONS } from '../data/missions';
import { seededRandom } from '../utils/random';

/** Escolhe 4 missões do dia de forma determinística pela data */
export function gerarMissoesDiarias(dateKey: string): MissionProgress[] {
  const rnd = seededRandom('bubi-' + dateKey);
  const pool = [...ALL_MISSIONS];
  const escolhidas: MissionDef[] = [];
  while (pool.length && escolhidas.length < 4) {
    const i = Math.floor(rnd() * pool.length);
    escolhidas.push(pool.splice(i, 1)[0]);
  }
  return escolhidas.map((m) => ({ ...m, progresso: 0, concluida: false, resgatada: false }));
}

export function registrarAcao(
  missoes: MissionProgress[],
  contadores: Record<string, number>,
  acao: string,
): { missoes: MissionProgress[]; contadores: Record<string, number>; novasConcluidas: string[] } {
  const novosContadores = { ...contadores, [acao]: (contadores[acao] ?? 0) + 1 };
  const novasConcluidas: string[] = [];
  const novasMissoes = missoes.map((m) => {
    if (m.concluida) return m;
    if (m.tipoAcao === acao || (m.tipoAcao === 'cuidar' && ['alimentar', 'brincar', 'carinho', 'limpar'].includes(acao))) {
      const prog = Math.min(m.meta, (novosContadores[m.tipoAcao] ?? 0) + (m.tipoAcao === 'cuidar' ? 0 : 0));
      // Para 'cuidar', soma geral
      let p = m.progresso + 1;
      if (m.tipoAcao === 'cuidar') p = Math.min(m.meta, p);
      else p = Math.min(m.meta, novosContadores[acao] ?? 1);
      void prog;
      const concluida = p >= m.meta;
      if (concluida && !m.concluida) novasConcluidas.push(m.id);
      return { ...m, progresso: p, concluida };
    }
    return m;
  });
  return { missoes: novasMissoes, contadores: novosContadores, novasConcluidas };
}
