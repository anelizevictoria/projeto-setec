import { useMemo, useState } from 'react';
import { shuffle } from '../../utils/random';

interface Props {
  onFim: (moedas: number, xp: number, mensagem: string) => void;
}

const EMOJIS = ['🍎', '🎈', '🐳', '🌟', '🍰', '🦆'];

/** Minigame 2: Jogo da memória */
export function MemoryGame({ onFim }: Props) {
  const baralho = useMemo(() => shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({ id: i, emoji })), []);
  const [viradas, setViradas] = useState<number[]>([]);
  const [pares, setPares] = useState<number[]>([]);
  const [tentativas, setTentativas] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const clicar = (id: number) => {
    if (finalizado || viradas.includes(id) || pares.includes(baralho[id].emoji.charCodeAt(0) * 100 + id)) return;
    if (viradas.length === 2) return;
    const novas = [...viradas, id];
    setViradas(novas);
    if (novas.length === 2) {
      setTentativas((t) => t + 1);
      const [a, b] = novas;
      if (baralho[a].emoji === baralho[b].emoji) {
        const novosPares = [...pares, a, b];
        setPares(novosPares);
        setViradas([]);
        if (novosPares.length === baralho.length) {
          setFinalizado(true);
          const bonus = Math.max(5, 30 - tentativas);
          onFim(15 + bonus, 15 + bonus, `Memória incrível! ${tentativas + 1} tentativas! 🧠✨`);
        }
      } else {
        setTimeout(() => setViradas([]), 800);
      }
    }
  };

  const visivel = (id: number) => viradas.includes(id) || pares.includes(id);

  return (
    <div className="minigame" aria-label="Jogo da memória">
      <h3>🧠 Jogo da Memória</h3>
      <p>Encontre os pares! Tentativas: <strong>{tentativas}</strong> · Pares: {pares.length / 2}/{EMOJIS.length}</p>
      <div className="memoria-grade">
        {baralho.map((c) => (
          <button
            key={c.id}
            className={`carta ${visivel(c.id) ? 'virada' : ''}`}
            onClick={() => clicar(c.id)}
            aria-label={visivel(c.id) ? `Carta ${c.emoji}` : 'Carta virada, toque para revelar'}
          >
            {visivel(c.id) ? c.emoji : '❓'}
          </button>
        ))}
      </div>
      {finalizado && <p>🎉 Parabéns! Jogue de novo recarregando a aba de jogos!</p>}
    </div>
  );
}
