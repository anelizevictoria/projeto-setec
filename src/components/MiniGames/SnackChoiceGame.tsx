import { useMemo, useState } from 'react';
import { FOODS } from '../../data/foods';
import { shuffle } from '../../utils/random';
import { MiniBubi } from './CatchBubiGame';

interface Props {
  onFim: (moedas: number, xp: number, mensagem: string) => void;
}

const TOTAL_RODADAS = 5;

/** Minigame 4: Lanchinho Certo — o Bubi pede um lanche, escolha o certo! */
export function SnackChoiceGame({ onFim }: Props) {
  const rodadas = useMemo(() => {
    const comidas = shuffle(FOODS.filter((f) => f.id !== 'cha-cura')).slice(0, TOTAL_RODADAS);
    return comidas.map((certa) => {
      const erradas = shuffle(FOODS.filter((f) => f.id !== certa.id)).slice(0, 2);
      return { certa, opcoes: shuffle([certa, ...erradas]) };
    });
  }, []);
  const [etapa, setEtapa] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  const atual = rodadas[etapa];

  const escolher = (id: string) => {
    if (finalizado || feedback) return;
    const acertou = id === atual.certa.id;
    if (acertou) {
      setAcertos((a) => a + 1);
      setFeedback(`Isso! ${atual.certa.nome}! Nhom nhom! 😋`);
    } else {
      setFeedback(`Ops! Eu queria ${atual.certa.nome}! Tenta o próximo! 💛`);
    }
    window.setTimeout(() => {
      setFeedback('');
      if (etapa + 1 >= TOTAL_RODADAS) {
        setFinalizado(true);
        const total = acertos + (acertou ? 1 : 0);
        const moedas = 5 + total * 4;
        const xp = 5 + total * 4;
        onFim(moedas, xp, total === TOTAL_RODADAS ? `Perfeito! ${total}/${TOTAL_RODADAS} lanchinhos! O Bubi está de barriga cheia! 🏆` : `Acertou ${total}/${TOTAL_RODADAS}! Bom apetite! 🍎`);
      } else {
        setEtapa((e) => e + 1);
      }
    }, 1100);
  };

  if (finalizado) {
    return (
      <div className="minigame" aria-label="Jogo lanchinho certo">
        <h3>🍎 Lanchinho Certo</h3>
        <p>Você acertou <strong>{acertos}/{TOTAL_RODADAS}</strong>! O Bubi amou! 💛</p>
      </div>
    );
  }

  return (
    <div className="minigame" aria-label="Jogo lanchinho certo">
      <h3>🍎 Lanchinho Certo</h3>
      <p>Rodada {etapa + 1}/{TOTAL_RODADAS} · Acertos: <strong>{acertos}</strong></p>
      <div className="pedido-bubi">
        <MiniBubi tamanho={64} />
        <p className="pedido-fala">Quero <strong>{atual.certa.nome}</strong>! {atual.certa.emoji}</p>
      </div>
      <div className="lanche-opcoes">
        {atual.opcoes.map((op) => (
          <button key={op.id} className="lanche-opcao" onClick={() => escolher(op.id)} aria-label={`Dar ${op.nome}`}>
            <span className="lanche-emoji" aria-hidden>{op.emoji}</span>
            <span>{op.nome}</span>
          </button>
        ))}
      </div>
      {feedback && <p className="lanche-feedback" role="status">{feedback}</p>}
    </div>
  );
}
