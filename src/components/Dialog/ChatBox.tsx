import { useState } from 'react';
import type { ChatMessage } from '../../types/game';
import { useSpeech } from '../../hooks/useSpeech';
import { isTTSSupported } from '../../services/speechService';

interface Props {
  aberto: boolean;
  mensagens: ChatMessage[];
  carregando: boolean;
  nomePet: string;
  onFechar: () => void;
  onEnviar: (texto: string) => void;
}

export function ChatBox({ aberto, mensagens, carregando, nomePet, onFechar, onEnviar }: Props) {
  const [texto, setTexto] = useState('');
  const { ouvindo, transcricao, erro, suportado, comecar, cancelar } = useSpeech();

  if (!aberto) return null;

  const enviar = () => {
    const t = texto.trim();
    if (!t) return;
    onEnviar(t);
    setTexto('');
  };

  return (
    <div className="chat-overlay" role="dialog" aria-modal="true" aria-label={`Conversar com ${nomePet}`}>
      <div className="chat-janela">
        <header className="chat-topo">
          <strong>💬 Conversando com {nomePet}</strong>
          <button onClick={onFechar} aria-label="Fechar conversa">✖</button>
        </header>
        <div className="chat-mensagens" aria-live="polite">
          {mensagens.length === 0 && <p className="chat-dica">Diga oi! {nomePet} adora conversar. 💛</p>}
          {mensagens.map((m) => (
            <div key={m.id} className={`chat-msg ${m.de}`}>
              <span>{m.de === 'pet' ? `🟢 ${nomePet}` : '🧑 Você'}: {m.texto}</span>
            </div>
          ))}
          {carregando && <p className="chat-digitando">{nomePet} está pensando... 💭</p>}
          {ouvindo && <p className="chat-ouvindo">🎤 Ouvindo... fale agora! <button onClick={cancelar}>Cancelar</button></p>}
          {transcricao && <p className="chat-transcricao">Você disse: “{transcricao}”</p>}
          {erro && <p className="chat-erro">{erro}</p>}
          {!isTTSSupported() && <p className="chat-aviso">🔇 Voz de leitura indisponível neste navegador.</p>}
        </div>
        <div className="chat-entrada">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') enviar(); }}
            placeholder="Digite sua mensagem..."
            maxLength={200}
            aria-label="Digite sua mensagem para o bichinho"
          />
          <button
            onClick={() => (suportado ? comecar((t) => { setTexto(t); onEnviar(t); }) : setTexto(''))}
            aria-label="Falar com microfone"
            title={suportado ? 'Falar com microfone' : 'Microfone não suportado — use o teclado'}
            className="btn-mic"
          >🎤</button>
          <button onClick={enviar} disabled={carregando || !texto.trim()} aria-label="Enviar mensagem">➤</button>
        </div>
      </div>
    </div>
  );
}
