import type { PetAnimation, PetMood } from '../../types/pet';
import { PetSprite } from './PetSprite';

interface Props {
  animacao: PetAnimation;
  humor: PetMood;
  dormindo: boolean;
  energia: number;
  felicidade: number;
  higiene: number;
  peso: number;
  balao: string;
  efeito: string;
  acessorio?: string;
  decoracao?: string;
  nome: string;
  onPetClick: () => void;
}

const DECORACAO_FUNDO: Record<string, { emoji: string; classe: string }> = {
  'tapete-nuvem': { emoji: '☁️', classe: 'decor-nuvem' },
  'luminaria-estrela': { emoji: '🌟', classe: 'decor-estrela' },
  'vaso-flor': { emoji: '🌷', classe: 'decor-flor' },
  'quadro-mar': { emoji: '🌊', classe: 'decor-mar' },
  'tenda-listrada': { emoji: '🎪', classe: 'decor-tenda' },
};

/** Cenário diurno/noturno + personagem + balão de fala + efeitos */
export function PetScene({ animacao, humor, dormindo, energia, felicidade, higiene, peso, balao, efeito, acessorio, decoracao, nome, onPetClick }: Props) {
  const decor = decoracao ? DECORACAO_FUNDO[decoracao] : undefined;
  return (
    <section className={`cenario ${dormindo ? 'noite' : 'dia'}`} aria-label="Cenário do bichinho">
      <div className="cenario-ceu" aria-hidden>
        <span className="sol-lua">{dormindo ? '🌙' : '☀️'}</span>
        <span className="nuvem n1">☁️</span>
        <span className="nuvem n2">☁️</span>
        {dormindo && <span className="estrelas">✨ ⭐ ✨</span>}
      </div>
      {decor && <div className={`decoracao ${decor.classe}`} aria-hidden>{decor.emoji}</div>}
      <div className="balao-fala" role="status" aria-live="polite">
        <p>{balao}</p>
      </div>
      <PetSprite animacao={animacao} humor={humor} dormindo={dormindo} energia={energia} felicidade={felicidade} higiene={higiene} peso={peso} acessorio={acessorio} nome={nome} onPetClick={onPetClick} />
      {efeito && <div className="efeito-flutuante" aria-hidden>{efeito}</div>}
      <div className="chao" aria-hidden>🌱🌼🌱🌼🌱</div>
    </section>
  );
}
