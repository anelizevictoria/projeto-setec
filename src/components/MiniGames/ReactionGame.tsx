import { useEffect, useRef, useState } from 'react';
import { rand } from '../../utils/random';

interface Props {
  onFim: (moedas: number, xp: number, mensagem: string) => void;
}

/** Minigame 1: Caça-Bolhas — toque nas bolhas que aparecem! */
export function ReactionGame({ onFim }: Props) {
  const [rodando, setRodando] = useState(false);
  const [tempo, setTempo] = useState(20);
  const [pontos, setPontos] = useState(0);
  const [alvo, setAlvo] = useState<{ x: number; y: number; id: number } | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (!rodando) return;
    if (tempo <= 0) {
      setRodando(false);
      setAlvo(null);
      const moedas = Math.min(30, 5 + pontos * 2);
      const xp = Math.min(30, 5 + pontos * 2);
      onFim(moedas, xp, pontos >= 8 ? `Incrível! ${pontos} bolhas! 🏆` : `Bom jogo! ${pontos} bolhas! 🎈`);
      return;
    }
    const t = window.setTimeout(() => setTempo((x) => x - 1), 1000);
    return () => window.clearTimeout(t);
  }, [rodando, tempo, pontos, onFim]);

  useEffect(() => {
    if (!rodando) return;
    const mover = () => {
      idRef.current += 1;
      setAlvo({ x: rand(5, 85), y: rand(10, 75), id: idRef.current });
    };
    mover();
    const id = window.setInterval(mover, 900);
    return () => window.clearInterval(id);
  }, [rodando]);

  return (
    <div className="minigame" aria-label="Jogo de reação caça bolhas">
      <h3>🎈 Caça-Bolhas</h3>
      <p>Toque nas bolhas o mais rápido que conseguir! ⏱️ {tempo}s · Pontos: <strong>{pontos}</strong></p>
      {!rodando && tempo !== 20 && <p>Última pontuação: {pontos}</p>}
      {!rodando ? (
        <button className="btn-grande" onClick={() => { setPontos(0); setTempo(20); setRodando(true); }}>▶ Começar</button>
      ) : (
        <div className="arena-bolhas">
          {alvo && (
            <button
              key={alvo.id}
              className="bolha-alvo"
              style={{ left: `${alvo.x}%`, top: `${alvo.y}%` }}
              onClick={() => { setPontos((p) => p + 1); setAlvo(null); }}
              aria-label="Estourar bolha"
            >🫧</button>
          )}
        </div>
      )}
    </div>
  );
}
