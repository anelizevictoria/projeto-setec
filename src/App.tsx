import { useEffect } from 'react';
import { usePet } from './hooks/usePet';
import { PetScene } from './components/Pet/PetScene';
import { StatsBar } from './components/Stats/StatsBar';
import { ActionButtons } from './components/Controls/ActionButtons';
import { ChatBox } from './components/Dialog/ChatBox';
import { Shop } from './components/Shop/Shop';
import { Inventory } from './components/Inventory/Inventory';
import { Missions } from './components/Missions/Missions';
import { MiniGames } from './components/MiniGames/MiniGames';
import { Settings } from './components/Settings/Settings';
import { MOOD_EMOJI, MOOD_LABEL } from './game/petMood';
import './App.css';

export default function App() {
  const pet = usePet();

  useEffect(() => {
    pet.checarMissoesDiarias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <a className="skip" href="#acoes-principal">Pular para ações</a>

      <header className="topo" role="banner">
        <div className="topo-pet">
          <span className="logo" aria-hidden>🟢</span>
          <div>
            <strong>{pet.save.pet.nome}</strong>
            <small>Nv {pet.save.pet.nivel} · {MOOD_EMOJI[pet.humorEfetivo]} {MOOD_LABEL[pet.humorEfetivo]}</small>
          </div>
        </div>
        <div className="topo-moedas" aria-label={`Você tem ${pet.save.pet.moedas} moedas`}>
          🪙 <strong>{pet.save.pet.moedas}</strong>
        </div>
        <button className="btn-config" onClick={pet.salvarAgora} aria-label="Salvar progresso">💾</button>
        <button className="btn-config" onClick={() => pet.setAba('config')} aria-label="Abrir configurações">⚙️</button>
      </header>

      <nav className="abas" aria-label="Navegação principal">
        {([
          ['jogo', '🏠 Casa'],
          ['loja', '🛍️ Loja'],
          ['mochila', '🎒 Mochila'],
          ['missoes', '📋 Missões'],
          ['jogos', '🎮 Jogos'],
          ['config', '⚙️ Ajustes'],
        ] as const).map(([id, rotulo]) => (
          <button key={id} className={pet.aba === id ? 'ativo' : ''} onClick={() => pet.setAba(id)} aria-current={pet.aba === id ? 'page' : undefined}>
            {rotulo}
          </button>
        ))}
      </nav>

      <main className="conteudo">
        {pet.aba === 'jogo' && (
          <>
            <PetScene
              animacao={pet.animacao}
              humor={pet.humorEfetivo}
              dormindo={pet.save.pet.dormindo}
              energia={pet.save.pet.energia}
              felicidade={pet.save.pet.felicidade}
              higiene={pet.save.pet.higiene}
              peso={pet.save.pet.peso}
              balao={pet.balao}
              efeito={pet.efeito}
              acessorio={pet.save.pet.equippedAccessory}
              decoracao={pet.save.pet.placedDecoration}
              nome={pet.save.pet.nome}
              onPetClick={pet.acaoCarinho}
            />
            <StatsBar pet={pet.save.pet} />
            <div id="acoes-principal">
              <ActionButtons
                dormindo={pet.save.pet.dormindo}
                onAlimentar={pet.acaoAlimentar}
                onBrincar={pet.acaoBrincar}
                onDancar={pet.acaoDancar}
                onCarinho={pet.acaoCarinho}
                onDormir={pet.acaoDormir}
                onLimpar={pet.acaoLimpar}
                onConversar={pet.acaoConversar}
              />
            </div>
          </>
        )}
        {pet.aba === 'loja' && <Shop moedas={pet.save.pet.moedas} nivel={pet.save.pet.nivel} inventario={pet.save.inventario} onComprar={pet.comprar} />}
        {pet.aba === 'mochila' && <Inventory inventario={pet.save.inventario} equipado={pet.save.pet.equippedAccessory} onUsar={pet.usarItem} />}
        {pet.aba === 'missoes' && <Missions missoes={pet.save.missoes} onResgatar={pet.resgatarMissao} />}
        {pet.aba === 'jogos' && <MiniGames onFim={pet.recompensaMinigame} />}
        {pet.aba === 'config' && (
          <Settings config={pet.save.configuracoes} nomePet={pet.save.pet.nome} onAtualizar={pet.atualizarConfig} onResetar={pet.resetar} onRenomear={pet.renomear} onExportar={pet.exportarProgresso} onImportar={pet.importarProgresso} />
        )}
      </main>

      <ChatBox
        aberto={pet.chatAberto}
        mensagens={pet.chat}
        carregando={pet.carregandoChat}
        nomePet={pet.save.pet.nome}
        onFechar={() => pet.setChatAberto(false)}
        onEnviar={pet.enviarChat}
      />

      {pet.toast && <div className="toast" role="status" aria-live="polite">{pet.toast}</div>}

      <footer className="rodape">
        <small>Bubi · o Bolotinho — jogo original feito com React + Vite · progresso salvo no navegador 💾</small>
        <small>Anelize victoria 2DS - barbosa ferraz</small>
      </footer>
    </div>
  );
}
