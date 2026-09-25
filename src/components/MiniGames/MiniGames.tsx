import { useState } from 'react';
import { ReactionGame } from './ReactionGame';
import { MemoryGame } from './MemoryGame';
import { CatchBubiGame } from './CatchBubiGame';
import { SnackChoiceGame } from './SnackChoiceGame';

interface Props {
  onFim: (moedas: number, xp: number, mensagem: string) => void;
}

type QualJogo = 'reacao' | 'memoria' | 'pega' | 'lanche';

export function MiniGames({ onFim }: Props) {
  const [qual, setQual] = useState<QualJogo>('reacao');
  // key força reset do jogo ao trocar
  const [sessao, setSessao] = useState(0);

  const trocar = (q: QualJogo) => {
    setQual(q);
    setSessao((s) => s + 1);
  };

  return (
    <section className="painel" aria-label="Minigames">
      <h2>🎮 Minigames</h2>
      <p className="dica">Jogue para ganhar moedas e XP! Moedas vêm SÓ daqui! 🪙 Também conta para missões. 🏆</p>
      <div className="loja-abas">
        <button className={qual === 'reacao' ? 'ativo' : ''} onClick={() => trocar('reacao')}>🎈 Caça-Bolhas</button>
        <button className={qual === 'memoria' ? 'ativo' : ''} onClick={() => trocar('memoria')}>🧠 Memória</button>
        <button className={qual === 'pega' ? 'ativo' : ''} onClick={() => trocar('pega')}>🟢 Pega o Bubi</button>
        <button className={qual === 'lanche' ? 'ativo' : ''} onClick={() => trocar('lanche')}>🍎 Lanchinho</button>
      </div>
      {qual === 'reacao' && <ReactionGame key={`r-${sessao}`} onFim={onFim} />}
      {qual === 'memoria' && <MemoryGame key={`m-${sessao}`} onFim={onFim} />}
      {qual === 'pega' && <CatchBubiGame key={`p-${sessao}`} onFim={onFim} />}
      {qual === 'lanche' && <SnackChoiceGame key={`l-${sessao}`} onFim={onFim} />}
    </section>
  );
}
