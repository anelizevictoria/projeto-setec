import { useCallback, useEffect, useRef, useState } from 'react';
import type { SaveData, ChatMessage } from '../types/game';
import type { PetAnimation, PetMood } from '../types/pet';
import { getMood } from '../game/petMood';
import { applyOfflineProgress, tickSimulation } from '../game/petSimulation';
import { alimentar, brincar, carinho, limpar, alternarDormir, usarItemComida, dancar } from '../game/petActions';
import { registrarAcao } from '../game/missions';
import { ganharXp, recompensaNivel } from '../game/progression';
import { carregarSave, salvarSave, criarSaveNovo, exportarSave as exportarSaveJSON } from '../services/storageService';
import { isValidSave } from '../utils/validation';
import { audioService, configurarAudio } from '../services/audioService';
import { falar } from '../services/speechService';
import { gerarRespostaPet } from '../services/aiService';
import { fraseHumor, fraseSaudacao, FRASES_EVENTO_ALEATORIO, AVISOS_ESTADO } from '../data/dialogue';
import { getItemById } from '../data/foods';
import { pick } from '../utils/random';
import { todayKey } from '../utils/time';
import { gerarMissoesDiarias } from '../game/missions';
import { clampStat } from '../types/pet';

export function usePet() {
  const [save, setSave] = useState<SaveData>(() => carregarSave());
  const [animacao, setAnimacao] = useState<PetAnimation>('idle');
  const [balao, setBalao] = useState<string>(() => fraseSaudacao());
  const [efeito, setEfeito] = useState<string>('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatAberto, setChatAberto] = useState(false);
  const [carregandoChat, setCarregandoChat] = useState(false);
  const [toast, setToast] = useState<string>('');
  const [aba, setAba] = useState<'jogo' | 'loja' | 'mochila' | 'missoes' | 'jogos' | 'config'>('jogo');
  const timeouts = useRef<number[]>([]);

  const humor = getMood(save.pet);
  // Após alimentar/carinho, ele fica feliz por um tempo (mesmo que a felicidade ainda esteja baixa)
  const [felizAtivo, setFelizAtivo] = useState(false);
  const humorEfetivo: PetMood = felizAtivo ? 'feliz' : humor;

  const mostrarToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2600);
  }, []);

  const falarBalao = useCallback((texto: string, anim?: PetAnimation, dur = 3500, comVoz = false, vozAtivada = true) => {
    setBalao(texto);
    if (anim) {
      setAnimacao(anim);
      const id = window.setTimeout(() => setAnimacao('idle'), dur);
      timeouts.current.push(id);
    }
    if (comVoz) falar(texto, vozAtivada);
  }, []);

  const marcarFeliz = useCallback(() => {
    setFelizAtivo(true);
    const id = window.setTimeout(() => setFelizAtivo(false), 9000);
    timeouts.current.push(id);
  }, []);

  const animarDepois = useCallback((atraso: number, anim: PetAnimation, dur: number) => {
    const id = window.setTimeout(() => {
      setAnimacao(anim);
      const id2 = window.setTimeout(() => setAnimacao('idle'), dur);
      timeouts.current.push(id2);
    }, atraso);
    timeouts.current.push(id);
  }, []);

  // aplica progresso offline na montagem
  useEffect(() => {
    setSave((s) => {
      const atualizado = applyOfflineProgress(s.pet);
      const ausenteMin = Math.round((Date.now() - s.pet.lastSaved) / 60000);
      if (ausenteMin >= 5) {
        setTimeout(() => setBalao(`Você voltou! Senti sua falta! 💛 (${ausenteMin}min fora)`), 600);
      }
      return { ...s, pet: atualizado };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persiste + configura áudio
  useEffect(() => {
    salvarSave(save);
    configurarAudio(save.configuracoes.som, save.configuracoes.volume);
  }, [save]);

  // game loop: tick a cada 10s
  useEffect(() => {
    if (save.configuracoes.modoEconomia) return;
    const id = window.setInterval(() => {
      setSave((s) => ({ ...s, pet: tickSimulation(s.pet) }));
    }, 10000);
    return () => window.clearInterval(id);
  }, [save.configuracoes.modoEconomia]);

  // eventos aleatórios com cooldown
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      if (save.pet.dormindo) return;
      if (Math.random() < 0.4) {
        setBalao(pick(FRASES_EVENTO_ALEATORIO));
      }
    }, 45000);
    return () => window.clearInterval(id);
  }, [save.pet.dormindo]);

  useEffect(() => () => { timeouts.current.forEach(clearTimeout); }, []);

  // Avisos falados: ele DIZ sozinho quando está com fome, sono, cheio ou sujo
  const condicoesRef = useRef({ fome: false, sono: false, cheio: false, sujo: false, descansado: false, gripe: false, pesoAlto: false, pesoBaixo: false });
  const ultimoAvisoRef = useRef<Record<string, number>>({});
  const avisosInitRef = useRef(false);

  useEffect(() => {
    const p = save.pet;
    const agora = Date.now();
    const cond = {
      fome: !p.dormindo && p.fome < 25,
      sono: !p.dormindo && p.energia < 25,
      cheio: !p.dormindo && p.fome >= 90,
      sujo: !p.dormindo && p.higiene < 25,
      descansado: p.dormindo && p.energia >= 95,
      gripe: !!p.gripado,
      pesoAlto: !p.dormindo && p.peso >= 90,
      pesoBaixo: !p.dormindo && p.peso <= 10,
    };
    if (!avisosInitRef.current) {
      condicoesRef.current = cond;
      avisosInitRef.current = true;
      return;
    }
    const prev = condicoesRef.current;
    condicoesRef.current = cond;
    const comCooldown = (chave: string, ms: number) => (agora - (ultimoAvisoRef.current[chave] ?? 0)) > ms;
    const avisar = (chave: 'fome' | 'sono' | 'cheio' | 'sujo' | 'descansado' | 'gripe' | 'pesoAlto' | 'pesoBaixo', anim: PetAnimation, atraso = 0) => {
      ultimoAvisoRef.current[chave] = agora + atraso;
      const texto = pick(AVISOS_ESTADO[chave]);
      if (atraso > 0) {
        const id = window.setTimeout(() => falarBalao(texto, anim, 3500, true, save.configuracoes.voz), atraso);
        timeouts.current.push(id);
      } else {
        falarBalao(texto, anim, 3500, true, save.configuracoes.voz);
      }
    };
    if (cond.fome && !prev.fome && comCooldown('fome', 120000)) avisar('fome', 'hungry');
    if (cond.sono && !prev.sono && comCooldown('sono', 120000)) avisar('sono', 'tired');
    if (cond.sujo && !prev.sujo && comCooldown('sujo', 120000)) avisar('sujo', 'sad');
    // "cheio" vem logo após comer: espera a mensagem do lanche aparecer antes
    if (cond.cheio && !prev.cheio && comCooldown('cheio', 120000)) avisar('cheio', 'happy', 4000);
    if (cond.descansado && !prev.descansado && comCooldown('descansado', 180000)) avisar('descansado', 'happy');
    if (cond.gripe && !prev.gripe && comCooldown('gripe', 180000)) {
      setEfeito('🤧');
      setTimeout(() => setEfeito(''), 1500);
      avisar('gripe', 'sick');
    }
    if (cond.pesoAlto && !prev.pesoAlto && comCooldown('pesoAlto', 240000)) avisar('pesoAlto', 'surprised');
    if (cond.pesoBaixo && !prev.pesoBaixo && comCooldown('pesoBaixo', 240000)) avisar('pesoBaixo', 'sad');
  }, [save.pet, save.configuracoes.voz, falarBalao]);

  const registrar = useCallback((acao: string, base: SaveData): SaveData => {
    const { missoes, contadores } = registrarAcao(base.missoes, base.contadores, acao);
    return { ...base, missoes, contadores };
  }, []);

  const aplicarResultadoGenerico = useCallback((novoPet: SaveData['pet'], mensagem: string, anim: PetAnimation, acao: string, comVoz = false) => {
    setSave((s) => {
      let next: SaveData = { ...s, pet: { ...novoPet, lastSaved: Date.now() } };
      next = registrar(acao, next);
      if (acao === 'alimentar' || acao === 'brincar' || acao === 'carinho' || acao === 'limpar') {
        next = registrar('cuidar', next);
      }
      return next;
    });
    falarBalao(mensagem, anim, 3000, comVoz, save.configuracoes.voz);
  }, [falarBalao, registrar, save.configuracoes.voz]);

  const acaoAlimentar = useCallback(() => {
    if (save.pet.dormindo) { audioService.erro(); falarBalao('Shhh... dormindo! 😴', 'sleeping'); return; }
    audioService.comer();
    setEfeito('🍎');
    setTimeout(() => setEfeito(''), 1200);
    const r = alimentar(save.pet);
    if (r.subiuNivel) { audioService.nivel(); setEfeito('🎉'); setTimeout(() => setEfeito(''), 1800); }
    aplicarResultadoGenerico(r.pet, r.mensagem + (r.moedasGanhas ? ` (+${r.moedasGanhas}🪙)` : ''), 'eating', 'alimentar', false);
    marcarFeliz();
    animarDepois(3200, 'happy', 2500);
    if (r.subiuNivel) mostrarToast(`Subiu para o nível ${r.pet.nivel}! 🎉`);
  }, [save.pet, aplicarResultadoGenerico, falarBalao, mostrarToast, marcarFeliz, animarDepois]);

  const acaoBrincar = useCallback(() => {
    if (save.pet.dormindo) { audioService.erro(); return; }
    audioService.pop();
    setEfeito('🎈');
    setTimeout(() => setEfeito(''), 1200);
    const r = brincar(save.pet);
    if (r.subiuNivel) audioService.nivel();
    aplicarResultadoGenerico(r.pet, r.mensagem + (r.moedasGanhas ? ` (+${r.moedasGanhas}🪙)` : ''), 'playing', 'brincar');
    setSave((s) => ({ ...s, pet: { ...s.pet, ultimoBrincar: Date.now() } }));
  }, [save.pet, aplicarResultadoGenerico]);

  const acaoCarinho = useCallback(() => {
    audioService.carinho();
    setEfeito('💕');
    setTimeout(() => setEfeito(''), 1200);
    const r = carinho(save.pet);
    aplicarResultadoGenerico(r.pet, r.mensagem, 'happy', 'carinho');
    marcarFeliz();
    setSave((s) => ({ ...s, pet: { ...s.pet, ultimoCarinho: Date.now() } }));
  }, [save.pet, aplicarResultadoGenerico, marcarFeliz]);

  const acaoLimpar = useCallback(() => {
    if (save.pet.dormindo) { audioService.erro(); return; }
    audioService.sucesso();
    setEfeito('🫧');
    setTimeout(() => setEfeito(''), 1400);
    const r = limpar(save.pet);
    aplicarResultadoGenerico(r.pet, r.mensagem, 'cleaning', 'limpar');
  }, [save.pet, aplicarResultadoGenerico]);

  const acaoDormir = useCallback(() => {
    audioService.dormir();
    const { pet, mensagem } = alternarDormir(save.pet);
    setSave((s) => ({ ...s, pet: { ...pet, lastSaved: Date.now() } }));
    falarBalao(mensagem, pet.dormindo ? 'sleeping' : 'happy', 3000);
  }, [save.pet, falarBalao]);

  const acaoConversar = useCallback(() => {
    setChatAberto(true);
    setSave((s) => registrar('conversar', registrar('cuidar', s)));
    const frase = fraseHumor(humor);
    falarBalao(frase, 'talking', 3000, true, save.configuracoes.voz);
    audioService.clique();
  }, [humor, registrar, falarBalao, save.configuracoes.voz]);

  const acaoDancar = useCallback(() => {
    if (save.pet.dormindo) { audioService.erro(); falarBalao('Shhh... dormindo! 😴', 'sleeping'); return; }
    if (save.pet.energia < 15) { audioService.erro(); falarBalao('Sem energia pra dançar... deixa eu dormir um pouco? 😴', 'tired'); return; }
    audioService.danca();
    setEfeito('🕺');
    setTimeout(() => setEfeito(''), 1600);
    const r = dancar(save.pet);
    if (r.subiuNivel) audioService.nivel();
    aplicarResultadoGenerico(r.pet, r.mensagem, 'dancando', 'brincar', true);
    setSave((s) => ({ ...s, pet: { ...s.pet, ultimoBrincar: Date.now() } }));
  }, [save.pet, aplicarResultadoGenerico, falarBalao]);

  const enviarChat = useCallback(async (texto: string) => {
    const limpo = texto.trim().slice(0, 200);
    if (!limpo || carregandoChat) return;
    const msgJ: ChatMessage = { id: `j-${Date.now()}`, de: 'jogador', texto: limpo, quando: Date.now() };
    setChat((c) => [...c.slice(-19), msgJ]);
    setCarregandoChat(true);
    setAnimacao('talking');
    try {
      const hist = [...chat.slice(-6).map((m) => ({ de: m.de, texto: m.texto }))];
      const resp = await gerarRespostaPet(limpo, save.pet, humor, hist);
      const msgP: ChatMessage = { id: `p-${Date.now()}`, de: 'pet', texto: resp, quando: Date.now() };
      setChat((c) => [...c.slice(-19), msgP]);
      setBalao(resp);
      falar(resp, save.configuracoes.voz);
      // conversar dá um pouquinho de amizade/xp
      setSave((s) => {
        const amizade = clampStat(s.pet.amizade + 1);
        const g = ganharXp(s.pet.xp, s.pet.nivel, 2);
        return { ...s, pet: { ...s.pet, amizade, xp: g.xp, nivel: g.nivel, felicidade: clampStat(s.pet.felicidade + 2), lastSaved: Date.now() } };
      });
    } finally {
      setCarregandoChat(false);
      setTimeout(() => setAnimacao((a) => (a === 'talking' ? 'idle' : a)), 2000);
    }
  }, [carregandoChat, chat, humor, save.pet, save.configuracoes.voz]);

  const comprar = useCallback((id: string) => {
    const item = getItemById(id);
    if (!item) return;
    if (item.descontoNivel && save.pet.nivel < item.descontoNivel) {
      audioService.erro();
      mostrarToast(`Desbloqueia no nível ${item.descontoNivel}!`);
      return;
    }
    if (item.tipo !== 'comida' && (save.inventario[id] ?? 0) > 0) {
      audioService.erro();
      mostrarToast('Você já tem esse item! Olha na mochila! 🎒✅');
      return;
    }
    if (save.pet.moedas < item.preco) {
      audioService.erro();
      mostrarToast('Moedas insuficientes! Jogue minigames para ganhar! 🎮🪙');
      return;
    }
    audioService.recompensa();
    setSave((s) => ({
      ...s,
      pet: { ...s.pet, moedas: s.pet.moedas - item.preco },
      inventario: { ...s.inventario, [id]: (s.inventario[id] ?? 0) + 1 },
    }));
    mostrarToast(`${item.emoji} ${item.nome} comprado!`);
  }, [save.pet.moedas, save.pet.nivel, mostrarToast]);

  const usarItem = useCallback((id: string) => {
    const qtd = save.inventario[id] ?? 0;
    if (qtd <= 0) { audioService.erro(); return; }
    const item = getItemById(id);
    if (!item) return;
    if (item.tipo === 'comida') {
      audioService.comer();
      const r = usarItemComida(save.pet, item.efeito ?? {});
      // Remédios curam a gripe!
      const ehRemedio = id === 'remedio-bolha' || id === 'cha-cura';
      const curou = ehRemedio && save.pet.gripado;
      const petCurado = curou
        ? { ...r.pet, gripado: false, doente: r.pet.saude < 30 }
        : r.pet;
      if (curou) audioService.nivel();
      setSave((s) => ({ ...s, pet: petCurado, inventario: { ...s.inventario, [id]: Math.max(0, (s.inventario[id] ?? 0) - 1) } }));
      falarBalao(`${item.emoji} ${r.mensagem}` + (curou ? ' A gripe foi embora! Estou curado! 🤧✨' : ''), 'eating', 2500);
    } else if (item.tipo === 'acessorio') {
      audioService.sucesso();
      setSave((s) => ({
        ...s,
        pet: { ...s.pet, equippedAccessory: s.pet.equippedAccessory === id ? undefined : id },
      }));
      mostrarToast(save.pet.equippedAccessory === id ? 'Acessório removido!' : `${item.emoji} Equipado: ${item.nome}!`);
    } else if (item.tipo === 'decoracao') {
      audioService.sucesso();
      setSave((s) => ({ ...s, pet: { ...s.pet, placedDecoration: id } }));
      mostrarToast(`${item.emoji} Decoração aplicada ao cenário!`);
    } else {
      // brinquedo: diverte
      audioService.pop();
      const r = brincar({ ...save.pet, energia: save.pet.energia + 5 });
      setSave((s) => ({ ...s, pet: { ...r.pet, ultimoBrincar: Date.now() }, inventario: s.inventario }));
      falarBalao(`Brincando com ${item.nome}! ${r.mensagem}`, 'playing', 3000);
    }
  }, [save.inventario, save.pet, falarBalao, mostrarToast]);

  const resgatarMissao = useCallback((id: string) => {
    const m = save.missoes.find((x) => x.id === id);
    if (!m || !m.concluida || m.resgatada) return;
    audioService.recompensa();
    setSave((s) => {
      const g = ganharXp(s.pet.xp, s.pet.nivel, m.recompensaXp);
      // Missões dão XP. Moedas vêm somente dos minigames.
      return {
        ...s,
        pet: { ...s.pet, xp: g.xp, nivel: g.nivel, ultimaMissao: Date.now() },
        missoes: s.missoes.map((x) => (x.id === id ? { ...x, resgatada: true } : x)),
      };
    });
    mostrarToast(`+${m.recompensaXp}XP! Moedas? Só nos minigames! 🎮`);
  }, [save.missoes, mostrarToast]);

  const recompensaMinigame = useCallback((moedas: number, xp: number, mensagem: string) => {
    audioService.recompensa();
    setSave((s) => {
      let next: SaveData = registrar('minigame', registrar('cuidar', s));
      const g = ganharXp(next.pet.xp, next.pet.nivel, xp);
      let total = next.pet.moedas + moedas;
      if (g.subiu) total += recompensaNivel(g.nivel);
      next = { ...next, pet: { ...next.pet, xp: g.xp, nivel: g.nivel, moedas: total, felicidade: clampStat(next.pet.felicidade + 6), ultimoBrincar: Date.now(), lastSaved: Date.now() } };
      return next;
    });
    falarBalao(mensagem, 'celebrating', 3000);
    mostrarToast(`+${moedas}🪙 +${xp}XP!`);
  }, [falarBalao, mostrarToast, registrar]);

  const resetar = useCallback(() => {
    const novo = criarSaveNovo();
    // mantém configurações
    novo.configuracoes = save.configuracoes;
    setSave(novo);
    setChat([]);
    setBalao('Oi! Sou o Bubi! Vamos começar de novo? 💛');
    setAnimacao('happy');
    mostrarToast('Progresso resetado!');
  }, [save.configuracoes, mostrarToast]);

  const atualizarConfig = useCallback((patch: Partial<SaveData['configuracoes']>) => {
    setSave((s) => ({ ...s, configuracoes: { ...s.configuracoes, ...patch } }));
  }, []);

  const renomear = useCallback((nome: string) => {
    const n = nome.trim().slice(0, 20) || 'Bubi';
    setSave((s) => ({ ...s, pet: { ...s.pet, nome: n } }));
  }, []);

  const salvarAgora = useCallback(() => {
    salvarSave(save);
    audioService.sucesso();
    mostrarToast('Progresso salvo! 💾');
  }, [save, mostrarToast]);

  const exportarProgresso = useCallback(() => {
    try {
      const json = exportarSaveJSON(save);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bubi-progresso-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      audioService.sucesso();
      mostrarToast('Progresso exportado! Arquivo baixado. 📁');
    } catch {
      audioService.erro();
      mostrarToast('Não consegui exportar o progresso. 😢');
    }
  }, [save, mostrarToast]);

  const importarProgresso = useCallback((json: string) => {
    try {
      const parsed: unknown = JSON.parse(json);
      if (!isValidSave(parsed)) {
        audioService.erro();
        mostrarToast('Arquivo de progresso inválido! ❌');
        return;
      }
      setSave(parsed as SaveData);
      audioService.recompensa();
      setBalao('Uhuul! Lembrei de tudo! Obrigado! 💾💛');
      mostrarToast('Progresso importado! ✅');
    } catch {
      audioService.erro();
      mostrarToast('Não consegui ler o arquivo! ❌');
    }
  }, [mostrarToast]);

  const checarMissoesDiarias = useCallback(() => {
    const hoje = todayKey();
    if (save.missoesData !== hoje) {
      setSave((s) => ({ ...s, missoes: gerarMissoesDiarias(hoje), missoesData: hoje, contadores: {} }));
    }
  }, [save.missoesData]);

  return {
    save, animacao, setAnimacao, balao, efeito, chat, chatAberto, setChatAberto,
    carregandoChat, toast, aba, setAba, humor, humorEfetivo, mostrarToast, falarBalao,
    acaoAlimentar, acaoBrincar, acaoCarinho, acaoLimpar, acaoDormir, acaoConversar, acaoDancar,
    enviarChat, comprar, usarItem, resgatarMissao, recompensaMinigame,
    salvarAgora, exportarProgresso, importarProgresso,
    resetar, atualizarConfig, renomear, checarMissoesDiarias,
  };
}

export type UsePetReturn = ReturnType<typeof usePet>;
