import { useEffect, useRef, useState } from 'react';
import { rand } from '../../utils/random';

interface Props {
  onFim: (moedas: number, xp: number, mensagem: string) => void;
}

/** Mini Bubi original em SVG para os minigames */
export function MiniBubi({ tamanho = 44 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" role="img" aria-label="Bubi, o Bolotinho">
      <circle cx="50" cy="55" r="40" fill="#6fe3c1" />
      <ellipse cx="38" cy="38" rx="12" ry="8" fill="#ffffff" opacity="0.5" />
      <circle cx="28" cy="62" r="7" fill="#ff9db0" opacity="0.9" />
      <circle cx="72" cy="62" r="7" fill="#ff9db0" opacity="0.9" />
      <ellipse cx="38" cy="50" rx="8" ry="9" fill="#fff" />
      <ellipse cx="62" cy="50" rx="8" ry="9" fill="#fff" />
      <circle cx="38" cy="52" r="4" fill="#2e2a3a" />
      <circle cx="62" cy="52" r="4" fill="#2e2a3a" />
      <path d="M 40 66 Q 50 74 60 66" stroke="#7a4a3a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Minigame 3: Pega o Bubi — ele aparece nas tocas, toque nele! */
export function CatchBubiGame({ onFim }: Props) {
  const [rodando, setRodando] = useState(false);
  const [tempo, setTempo] = useState(20);
  const [pontos, setPontos] = useState(0);
  const [toca, setToca] = useState<number | null>(null);
  const [finalizado, setFinalizado] = useState(false);
  const onFimRef = useRef(onFim);
  onFimRef.current = onFim;

  useEffect(() => {
    if (!rodando || finalizado) return;
    if (tempo <= 0) {
      setFinalizado(true);
      setRodando(false);
      setToca(null);
      setPontos((p) => {
        const moedas = Math.min(30, 5 + p * 2);
        const xp = Math.min(30, 5 + p * 2);
        onFimRef.current(moedas, xp, p >= 8 ? `Você pegou o Bubi ${p} vezes! Demais! 🏆` : `Pegou ${p} vezes! O Bubi é rapidinho! 🟢`);
        return p;
      });
      return;
    }
    const t = window.setTimeout(() => setTempo((x) => x - 1), 1000);
    return () => window.clearTimeout(t);
  }, [rodando, tempo, finalizado]);

  useEffect(() => {
    if (!rodando) return;
    setToca(rand(0, 8));
    const id = window.setInterval(() => setToca(rand(0, 8)), 800);
    return () => window.clearInterval(id);
  }, [rodando]);

  const comecar = () => {
    setPontos(0);
    setTempo(20);
    setFinalizado(false);
    setRodando(true);
  };

  return (
    <div className="minigame" aria-label="Jogo pega o Bubi">
      <h3>🟢 Pega o Bubi!</h3>
      <p>O Bubi se esconde nas tocas! Toque nele! ⏱️ {tempo}s · Pontos: <strong>{pontos}</strong></p>
      {!rodando ? (
        <button className="btn-grande" onClick={comecar}>▶ {finalizado ? 'Jogar de novo' : 'Começar'}</button>
      ) : (
        <div className="tocas-grade">
          {Array.from({ length: 9 }, (_, i) => (
            <button
              key={i}
              className={`toca ${toca === i ? 'com-bubi' : ''}`}
              onClick={() => { if (toca === i) { setPontos((p) => p + 1); setToca(null); } }}
              aria-label={toca === i ? 'Pegar o Bubi!' : 'Toca vazia'}
            >
              {toca === i ? <MiniBubi /> : <span aria-hidden>🕳️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
