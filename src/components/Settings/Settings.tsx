import { useState } from 'react';
import type { GameSettings } from '../../types/pet';
import { isAudioSupported } from '../../services/audioService';
import { isTTSSupported, isSTTSupported } from '../../services/speechService';
import { isAIConfigured } from '../../services/aiService';

interface Props {
  config: GameSettings;
  nomePet: string;
  onAtualizar: (patch: Partial<GameSettings>) => void;
  onResetar: () => void;
  onRenomear: (nome: string) => void;
  onExportar: () => void;
  onImportar: (json: string) => void;
}

export function Settings({ config, nomePet, onAtualizar, onResetar, onRenomear, onExportar, onImportar }: Props) {
  const [nome, setNome] = useState(nomePet);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <section className="painel" aria-label="Configurações">
      <h2>⚙️ Configurações</h2>

      <label className="cfg-linha">
        <span>Nome do bichinho</span>
        <span className="cfg-nome">
          <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={20} aria-label="Nome do bichinho" />
          <button onClick={() => onRenomear(nome)}>Salvar</button>
        </span>
      </label>

      <label className="cfg-linha">
        <span>🔊 Som {isAudioSupported() ? '' : '(não suportado)'}</span>
        <input type="checkbox" checked={config.som} onChange={(e) => onAtualizar({ som: e.target.checked })} aria-label="Ativar ou desativar som" />
      </label>

      <label className="cfg-linha">
        <span>🎚️ Volume: {Math.round(config.volume * 100)}%</span>
        <input type="range" min={0} max={1} step={0.1} value={config.volume} onChange={(e) => onAtualizar({ volume: Number(e.target.value) })} aria-label="Volume do som" />
      </label>

      <label className="cfg-linha">
        <span>🗣️ Voz do bichinho {isTTSSupported() ? '' : '(TTS não suportado)'}</span>
        <input type="checkbox" checked={config.voz} onChange={(e) => onAtualizar({ voz: e.target.checked })} aria-label="Ativar ou desativar voz" />
      </label>

      <label className="cfg-linha">
        <span>🔋 Modo economia (pausa game loop)</span>
        <input type="checkbox" checked={config.modoEconomia} onChange={(e) => onAtualizar({ modoEconomia: e.target.checked })} aria-label="Ativar modo economia" />
      </label>

      <div className="cfg-info">
        <p>🎤 Microfone (fala-para-texto): {isSTTSupported() ? 'suportado ✅' : 'não suportado — use o teclado ⌨️'}</p>
        <p>🤖 IA: {isAIConfigured() ? 'endpoint configurado ✅' : 'não configurada — usando diálogo local 💛 (configure VITE_AI_ENDPOINT)'}</p>
      </div>

      <div className="cfg-progresso">
        <h3>💾 Progresso</h3>
        <p className="dica">O progresso salva sozinho no navegador. Você também pode salvar, exportar (pra levar pra outro computador) ou importar:</p>
        <div className="progresso-botoes">
          <button className="btn-salvar" onClick={onExportar}>📁 Exportar progresso (JSON)</button>
          <label className="btn-importar">
            📂 Importar progresso
            <input
              type="file"
              accept="application/json,.json"
              aria-label="Escolher arquivo de progresso (JSON)"
              onChange={(e) => {
                const file = e.target.files?.[0];
                const input = e.target;
                if (!file) return;
                const leitor = new FileReader();
                leitor.onload = () => { onImportar(String(leitor.result ?? '')); input.value = ''; };
                leitor.onerror = () => { input.value = ''; };
                leitor.readAsText(file);
              }}
            />
          </label>
        </div>
      </div>

      {!confirmando ? (
        <button className="btn-perigo" onClick={() => setConfirmando(true)}>🗑️ Resetar progresso</button>
      ) : (
        <div className="cfg-reset">
          <p>Tem certeza? Isso apaga tudo!</p>
          <button className="btn-perigo" onClick={() => { onResetar(); setConfirmando(false); }}>Sim, apagar tudo</button>
          <button onClick={() => setConfirmando(false)}>Cancelar</button>
        </div>
      )}
    </section>
  );
}
