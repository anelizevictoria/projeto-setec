interface Props {
  dormindo: boolean;
  onAlimentar: () => void;
  onBrincar: () => void;
  onDancar: () => void;
  onCarinho: () => void;
  onDormir: () => void;
  onLimpar: () => void;
  onConversar: () => void;
}

export function ActionButtons({ dormindo, onAlimentar, onBrincar, onDancar, onCarinho, onDormir, onLimpar, onConversar }: Props) {
  return (
    <nav className="acoes" aria-label="Ações de cuidado">
      <button className="btn-acao" onClick={onAlimentar} disabled={dormindo} aria-label="Alimentar o bichinho">🍖<span>Alimentar</span></button>
      <button className="btn-acao" onClick={onBrincar} disabled={dormindo} aria-label="Brincar com o bichinho">🎮<span>Brincar</span></button>
      <button className="btn-acao" onClick={onDancar} disabled={dormindo} aria-label="Fazer o bichinho dançar">🕺<span>Dançar</span></button>
      <button className="btn-acao" onClick={onCarinho} aria-label="Fazer carinho">❤️<span>Carinho</span></button>
      <button className={`btn-acao ${dormindo ? 'acordar' : ''}`} onClick={onDormir} aria-label={dormindo ? 'Acordar o bichinho' : 'Colocar o bichinho para dormir'}>{dormindo ? '☀️' : '🛏️'}<span>{dormindo ? 'Acordar' : 'Dormir'}</span></button>
      <button className="btn-acao" onClick={onLimpar} disabled={dormindo} aria-label="Dar banho no bichinho">🧼<span>Limpar</span></button>
      <button className="btn-acao destaque" onClick={onConversar} aria-label="Conversar com o bichinho">💬<span>Conversar</span></button>
    </nav>
  );
}
