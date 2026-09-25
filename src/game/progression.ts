export function xpParaProximoNivel(nivel: number): number {
  return 80 + nivel * 40;
}

export function ganharXp(
  xpAtual: number,
  nivelAtual: number,
  ganho: number,
): { xp: number; nivel: number; subiu: boolean; niveisGanhos: number } {
  let xp = xpAtual + ganho;
  let nivel = nivelAtual;
  let niveisGanhos = 0;
  while (xp >= xpParaProximoNivel(nivel)) {
    xp -= xpParaProximoNivel(nivel);
    nivel += 1;
    niveisGanhos += 1;
  }
  return { xp, nivel, subiu: niveisGanhos > 0, niveisGanhos };
}

export function recompensaNivel(nivel: number): number {
  return 20 + nivel * 10;
}
