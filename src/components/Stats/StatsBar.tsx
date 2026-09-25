import type { PetState } from '../../types/pet';
import { xpParaProximoNivel } from '../../game/progression';

interface Props {
  pet: PetState;
}

const BARRAS: { chave: keyof Pick<PetState, 'fome' | 'felicidade' | 'energia' | 'higiene' | 'saude'>; icone: string; rotulo: string }[] = [
  { chave: 'fome', icone: '🍖', rotulo: 'Saciedade' },
  { chave: 'felicidade', icone: '😊', rotulo: 'Felicidade' },
  { chave: 'energia', icone: '⚡', rotulo: 'Energia' },
  { chave: 'higiene', icone: '🧼', rotulo: 'Higiene' },
  { chave: 'saude', icone: '💚', rotulo: 'Saúde' },
];

function corBarra(v: number): string {
  if (v >= 60) return 'boa';
  if (v >= 30) return 'media';
  return 'ruim';
}

function rotuloPeso(p: number): string {
  if (p <= 15) return 'Muito magrinho';
  if (p <= 35) return 'Magro';
  if (p < 70) return 'Normal';
  if (p < 88) return 'Gordinho';
  return 'Muito gordinho';
}

export function StatsBar({ pet }: Props) {
  const meta = xpParaProximoNivel(pet.nivel);
  const pctXp = Math.round((pet.xp / meta) * 100);
  return (
    <section className="stats" aria-label="Necessidades do bichinho">
      <div className="stats-xp">
        <span>⭐ Nv {pet.nivel}</span>
        <div className="xp-barra" role="progressbar" aria-valuenow={pet.xp} aria-valuemin={0} aria-valuemax={meta} aria-label={`Experiência ${pet.xp} de ${meta}`}>
          <div className="xp-preenchimento" style={{ width: `${pctXp}%` }} />
        </div>
        <span>{pet.xp}/{meta} XP</span>
        <span title="Amizade">💛 {pet.amizade}</span>
        <span className="stat-peso" title={`Peso ${Math.round(pet.peso)} de 100`}>⚖️ {rotuloPeso(Math.round(pet.peso))}</span>
      </div>
      <div className="stats-grade">
        {BARRAS.map((b) => (
          <div className="stat" key={b.chave}>
            <span className="stat-icone" aria-hidden>{b.icone}</span>
            <span className="stat-rotulo">{b.rotulo}</span>
            <div className={`stat-barra ${corBarra(pet[b.chave])}`} role="progressbar" aria-valuenow={Math.round(pet[b.chave])} aria-valuemin={0} aria-valuemax={100} aria-label={`${b.rotulo}: ${Math.round(pet[b.chave])} de 100`}>
              <div className="stat-preenchimento" style={{ width: `${pet[b.chave]}%` }} />
            </div>
            <span className="stat-num">{Math.round(pet[b.chave])}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
