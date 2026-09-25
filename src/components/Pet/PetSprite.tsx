import type { ReactNode } from 'react';
import type { PetAnimation, PetMood } from '../../types/pet';

interface Props {
  animacao: PetAnimation;
  humor: PetMood;
  dormindo: boolean;
  energia: number;
  felicidade: number;
  higiene: number;
  peso: number;
  acessorio?: string;
  nome: string;
  onPetClick?: () => void;
}

/** Desenha o acessório equipado DIRETO no corpo (SVG original, sem emoji). */
function AcessorioSVG({ id }: { id: string }): ReactNode {
  switch (id) {
    case 'laco-rosa':
      // Lacinho rosa no topo direito da cabeça
      return (
        <g transform="translate(158, 42)">
          <ellipse cx="-14" cy="0" rx="14" ry="10" fill="#ff7bac" stroke="#d14d84" strokeWidth="2" />
          <ellipse cx="14" cy="0" rx="14" ry="10" fill="#ff8fb8" stroke="#d14d84" strokeWidth="2" />
          <circle cx="0" cy="0" r="7" fill="#e0447c" stroke="#b03060" strokeWidth="2" />
          <circle cx="-2" cy="-2" r="2" fill="#ffd3e3" />
        </g>
      );
    case 'oculos-sol':
      // Óculos escuros sobre os olhos
      return (
        <g>
          <rect x="64" y="72" width="36" height="28" rx="9" fill="#22222e" opacity="0.95" />
          <rect x="120" y="72" width="36" height="28" rx="9" fill="#22222e" opacity="0.95" />
          <rect x="100" y="80" width="20" height="6" rx="3" fill="#22222e" />
          <rect x="68" y="76" width="28" height="7" rx="3.5" fill="#8ecbff" opacity="0.7" />
          <rect x="124" y="76" width="28" height="7" rx="3.5" fill="#8ecbff" opacity="0.7" />
        </g>
      );
    case 'chapeu-festa':
      // Chapéu de festa cônico no topo
      return (
        <g transform="translate(110, 8)">
          <polygon points="0,-38 22,14 -22,14" fill="#7c5cff" stroke="#4a2fb5" strokeWidth="2" />
          <polygon points="-13,-8 13,-8 17,2 -17,2" fill="#ffc93c" />
          <polygon points="-6,-22 6,-22 9,-15 -9,-15" fill="#ff7bac" />
          <circle cx="0" cy="-40" r="8" fill="#ff8fb8" stroke="#d14d84" strokeWidth="2" />
          <circle cx="-6" cy="20" r="22" fill="none" stroke="#4a2fb5" strokeWidth="0" />
        </g>
      );
    case 'cachecol-quente':
      // Cachecol quentinho no pescoço + ponta
      return (
        <g>
          <rect x="62" y="152" width="96" height="20" rx="10" fill="#ff5a6e" />
          <rect x="62" y="152" width="96" height="8" rx="4" fill="#ff8391" />
          <rect x="122" y="168" width="22" height="34" rx="8" fill="#ff5a6e" />
          <rect x="122" y="192" width="22" height="6" rx="3" fill="#ffc93c" />
          <rect x="122" y="184" width="22" height="4" rx="2" fill="#ffc93c" />
        </g>
      );
    case 'coroa-mini':
      // Mini coroa dourada no topo
      return (
        <g transform="translate(110, 30)">
          <polygon points="-24,12 -24,-6 -12,2 0,-12 12,2 24,-6 24,12" fill="#ffc93c" stroke="#b8860b" strokeWidth="2" strokeLinejoin="round" />
          <rect x="-24" y="12" width="48" height="7" rx="3" fill="#e0a800" stroke="#b8860b" strokeWidth="1.5" />
          <circle cx="0" cy="-12" r="4" fill="#ff5a6e" />
          <circle cx="-12" cy="2" r="2.5" fill="#7c5cff" />
          <circle cx="12" cy="2" r="2.5" fill="#2fbf8f" />
        </g>
      );
    default:
      return null;
  }
}

/** Bubi — Bolotinho original em SVG puro: corpo redondo menta, bochechas rosa, olhos grandes. */
export function PetSprite({ animacao, humor, dormindo, energia, felicidade, higiene, peso, acessorio, nome, onPetClick }: Props) {
  const classe = `bubi bubi-${animacao} ${dormindo ? 'is-sleeping' : ''}`;

  // estilo Pou: o corpo engorda comendo e murcha com fome (50 = normal)
  const pesoClamp = Math.max(0, Math.min(100, peso));
  const f = 0.85 + (pesoClamp / 100) * 0.3;
  const cyCorpo = 183 - 68 * f;

  // olhos por estado
  const olhosFechados = dormindo || animacao === 'sleeping';
  // Com sono (energia baixa), os olhos começam a fechar mesmo acordado
  const sonolento = !olhosFechados && energia < 30;
  // Felicidade baixa = carinha triste na hora, direto do valor (não só do humor)
  const cabisbaixo = !olhosFechados && felicidade < 35;
  const feliz = ['happy', 'playing', 'celebrating'].includes(animacao) || humor === 'feliz' || humor === 'animado';
  const triste = humor === 'triste' || animacao === 'sad' || cabisbaixo;
  const bravo = animacao === 'angry';
  const doente = humor === 'doente' || animacao === 'sick';
  const surpreso = animacao === 'surprised';
  const falando = animacao === 'talking';
  const deOculos = acessorio === 'oculos-sol' && !olhosFechados;

  // boca por estado
  let boca: ReactNode;
  if (olhosFechados) {
    boca = <path d="M 95 118 Q 110 124 125 118" stroke="#7a4a3a" strokeWidth="4" fill="none" strokeLinecap="round" />;
  } else if (animacao === 'eating') {
    boca = <ellipse cx="110" cy="120" rx="12" ry="10" fill="#7a3b2e"><ellipse cx="110" cy="124" rx="6" ry="4" fill="#e88" /></ellipse>;
  } else if (falando) {
    boca = <ellipse className="boca-falando" cx="110" cy="120" rx="9" ry="7" fill="#7a3b2e" />;
  } else if (feliz) {
    boca = <path d="M 92 112 Q 110 130 128 112" stroke="#7a4a3a" strokeWidth="5" fill="none" strokeLinecap="round" />;
  } else if (triste || doente) {
    boca = <path d="M 95 122 Q 110 112 125 122" stroke="#7a4a3a" strokeWidth="4" fill="none" strokeLinecap="round" />;
  } else if (bravo) {
    boca = <path d="M 95 120 L 125 120" stroke="#7a4a3a" strokeWidth="5" strokeLinecap="round" />;
  } else {
    boca = <path d="M 98 116 Q 110 124 122 116" stroke="#7a4a3a" strokeWidth="4" fill="none" strokeLinecap="round" />;
  }

  const olho = (cx: number) => {
    if (olhosFechados) {
      return <path d={`M ${cx - 12} 88 Q ${cx} 94 ${cx + 12} 88`} stroke="#3a2e2a" strokeWidth="4" fill="none" strokeLinecap="round" />;
    }
    if (deOculos) return null; // óculos cobrem os olhos
    if (sonolento) {
      // Olhos semicerrados de sono: pálpebra caída sobre o olho
      return (
        <g>
          <ellipse cx={cx} cy="88" rx="14" ry="15" fill="#fff" />
          <circle className="pupila" cx={cx} cy={93} r="6" fill="#2e2a3a" />
          <circle cx={cx - 2} cy={91} r="2.2" fill="#fff" />
          <path d={`M ${cx - 14} 78 Q ${cx} 70 ${cx + 14} 78 L ${cx + 14} 66 L ${cx - 14} 66 Z`} fill="#6fe3c1" />
          <path d={`M ${cx - 14} 78 Q ${cx} 70 ${cx + 14} 78`} stroke="#3a2e2a" strokeWidth="4" fill="none" strokeLinecap="round" />
          {bravo && <path d={`M ${cx - 14} 66 L ${cx + 14} 76`} stroke="#3a2e2a" strokeWidth="5" strokeLinecap="round" />}
        </g>
      );
    }
    const ry = surpreso ? 20 : feliz ? 16 : 17;
    return (
      <g>
        <ellipse cx={cx} cy="86" rx="14" ry={ry} fill="#fff" />
        <circle className="pupila" cx={cx} cy={89} r={surpreso ? 8 : 7} fill="#2e2a3a" />
        <circle cx={cx - 2.5} cy={86.5} r="2.6" fill="#fff" />
        {bravo && <path d={`M ${cx - 14} 66 L ${cx + 14} 76`} stroke="#3a2e2a" strokeWidth="5" strokeLinecap="round" />}
        {triste && <path d={`M ${cx - 10} 70 Q ${cx} 64 ${cx + 10} 70`} stroke="#3a2e2a" strokeWidth="3" fill="none" strokeLinecap="round" />}
      </g>
    );
  };

  return (
    <div className="pet-wrap">
      <button
        className={classe}
        onClick={onPetClick}
        aria-label={`Fazer carinho em ${nome}, um Bolotinho ${humor}${acessorio ? ' usando acessório' : ''}`}
        title="Toque para fazer carinho!"
      >
        <svg viewBox="0 0 220 210" role="img" aria-label={`${nome} o Bolotinho`}>
          {/* sombra */}
          <ellipse cx="110" cy="192" rx="52" ry="10" fill="rgba(0,0,0,0.15)" />
          {/* bracinhos */}
          <ellipse className="braco braco-e" cx="38" cy="125" rx="14" ry="22" fill="#5fd6b5" transform="rotate(20 38 125)" />
          <ellipse className="braco braco-d" cx="182" cy="125" rx="14" ry="22" fill="#5fd6b5" transform="rotate(-20 182 125)" />
          {/* pezinhos */}
          <ellipse cx="82" cy="178" rx="18" ry="12" fill="#3fb898" />
          <ellipse cx="138" cy="178" rx="18" ry="12" fill="#3fb898" />
          {/* corpo */}
          <ellipse cx="110" cy={cyCorpo} rx={72 * f} ry={68 * f} fill="#6fe3c1" />
          <ellipse cx="110" cy={cyCorpo} rx={72 * f} ry={68 * f} fill="url(#brilhoBubi)" />
          <ellipse cx={110 - 24 * f} cy={cyCorpo - 35 * f} rx="22" ry="14" fill="#ffffff" opacity="0.45" />
          {/* barriguinha */}
          <ellipse cx="110" cy={183 - 38 * f} rx={34 * f} ry={24 * f} fill="#fff7e6" opacity="0.9" />
          {/* bochechas */}
          <circle cx="62" cy="112" r="11" fill="#ff9db0" opacity="0.85" />
          <circle cx="158" cy="112" r="11" fill="#ff9db0" opacity="0.85" />
          {/* band-aid se doente */}
          {doente && (
            <g>
              <rect x="128" y="52" width="26" height="12" rx="4" fill="#ffd9a0" stroke="#c98" />
              <circle cx="141" cy="58" r="1.6" fill="#c98" /><circle cx="136" cy="58" r="1.6" fill="#c98" /><circle cx="146" cy="58" r="1.6" fill="#c98" />
            </g>
          )}
          {/* olhos */}
          {olho(84)}{olho(136)}
          {/* boca */}
          {boca}
          {/* acessório vestido no corpo */}
          {acessorio && <AcessorioSVG id={acessorio} />}
          {/* lágrima se triste */}
          {triste && <path d="M 70 100 q 6 10 0 16 q -6 -6 0 -16" fill="#7ecbff" />}
          {/* Zzz se dormindo */}
          {olhosFechados && (
            <g className="zzz" fill="#5a6bff" fontWeight="bold">
              <text x="170" y="50" fontSize="22">z</text>
              <text x="182" y="34" fontSize="28">Z</text>
              <text x="196" y="14" fontSize="34">Z</text>
            </g>
          )}
          {/* manchas de sujeira: aparecem quando a higiene cai, pioram quando está muito baixa */}
          {higiene < 50 && (
            <g fill="#8a6d4b" opacity={higiene < 25 ? 0.9 : 0.45}>
              <circle cx="60" cy="60" r={higiene < 25 ? 6 : 4} />
              <circle cx="160" cy="70" r="4" />
              <circle cx="145" cy="150" r="5" />
              {higiene < 25 && (
                <>
                  <circle cx="90" cy="45" r="4" />
                  <circle cx="45" cy="140" r="5" />
                  <circle cx="120" cy="165" r="3.5" />
                </>
              )}
            </g>
          )}
          {higiene < 25 && (
            <g stroke="#7a9a5a" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" aria-hidden>
              <path d="M 48 32 q 5 -7 0 -13 q -5 -7 0 -13" />
              <path d="M 172 42 q 5 -7 0 -13 q -5 -7 0 -13" />
            </g>
          )}
          <defs>
            <radialGradient id="brilhoBubi" cx="0.4" cy="0.3" r="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#1d8f6f" stopOpacity="0.25" />
            </radialGradient>
          </defs>
        </svg>
      </button>
      <div className="pet-nome" aria-live="polite">{nome} · Bolotinho</div>
    </div>
  );
}
