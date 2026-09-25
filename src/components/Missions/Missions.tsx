import type { MissionProgress } from '../../types/items';

interface Props {
  missoes: MissionProgress[];
  onResgatar: (id: string) => void;
}

export function Missions({ missoes, onResgatar }: Props) {
  return (
    <section className="painel" aria-label="Missões diárias">
      <h2>📋 Missões de hoje</h2>
      <p className="dica">Complete tarefas cuidando do Bubi e resgate XP! Moedas? Só nos minigames! 🪙🎮 Missões renovam todo dia. 🌅</p>
      <ul className="loja-lista">
        {missoes.map((m) => (
          <li key={m.id} className="loja-item missao">
            <span className="loja-emoji" aria-hidden>{m.emoji}</span>
            <div className="loja-info">
              <strong>{m.titulo} {m.concluida && '✅'}</strong>
              <small>{m.descricao}</small>
              <div className="missao-barra" role="progressbar" aria-valuenow={m.progresso} aria-valuemin={0} aria-valuemax={m.meta} aria-label={`${m.titulo}: ${m.progresso} de ${m.meta}`}>
                <div style={{ width: `${Math.round((m.progresso / m.meta) * 100)}%` }} />
              </div>
              <span className="loja-preco">{m.progresso}/{m.meta} · 🎁 +{m.recompensaXp}XP{m.recompensaMoedas > 0 ? ` +${m.recompensaMoedas}🪙` : ''}</span>
            </div>
            <button onClick={() => onResgatar(m.id)} disabled={!m.concluida || m.resgatada} aria-label={m.resgatada ? `Recompensa de ${m.titulo} já resgatada` : m.concluida ? `Resgatar recompensa de ${m.titulo}` : `Complete ${m.titulo} para resgatar`}>
              {m.resgatada ? 'Ok!' : m.concluida ? 'Resgatar' : 'Falta'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
