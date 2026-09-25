(function () {
  'use strict';

  const SAVE_KEY = 'bubi-bolotinho-save-v1';
  const SAVE_VERSION = 1;
  const MAX_OFFLINE_MINUTES = 480;
  const STAT_KEYS = ['fome', 'felicidade', 'energia', 'higiene', 'saude'];
  const CARE_ACTIONS = ['alimentar', 'brincar', 'carinho', 'limpar', 'usar-item', 'minigame', 'conversar'];
  const DEFAULT_SETTINGS = { som: true, volume: 0.6, voz: true, modoEconomia: false };
  const DEFAULT_STATS = { fome: 80, felicidade: 80, energia: 90, higiene: 85, saude: 95, amizade: 10 };
  const BLOCKED_CHAT_TERMS = [
    'porra', 'porras', 'caralho', 'caralhos', 'merda', 'merdas', 'foda', 'fodase', 'foder', 'fudido', 'fudida',
    'puta', 'puto', 'putas', 'putos', 'cacete', 'cacetada', 'buceta', 'bosta', 'fdp', 'filho da puta', 'filha da puta', 'filhodaputa', 'filhadaputa',
    'desgraca', 'desgracado', 'desgracada', 'idiota', 'imbecil', 'retardado', 'retardada', 'otario', 'otaria',
    'escrota', 'escroteiro', 'pauzudo', 'trepar', 'transar', 'porno', 'porna', 'pornografia', 'nudez', 'nu', 'nua',
    'seio', 'seios', 'genital', 'genitais', 'estuprar', 'violar', 'matar voce', 'vou te matar', 'te mato', 'machucar voce',
    'racista', 'racismo', 'homofobico', 'nazista', 'suicidio', 'fuck', 'fucking', 'shit', 'bitch', 'asshole',
    'bastard', 'cunt', 'dick', 'whore', 'slut', 'nigger', 'nigga'
  ];

  const ITEMS = [
    { id: 'maca-bolha', nome: 'Maçã Bolha', preco: 10, descricao: '+18 fome, +4 felicidade. Crocante e suculenta!', tipo: 'comida', emoji: '🍎', efeito: { fome: 18, felicidade: 4, peso: 5 } },
    { id: 'bolo-arcoiris', nome: 'Bolo Arco-íris', preco: 25, descricao: '+30 fome, +10 felicidade. Festa em cada mordida!', tipo: 'comida', emoji: '🍰', efeito: { fome: 30, felicidade: 10, peso: 12 } },
    { id: 'suco-estelar', nome: 'Suco Estelar', preco: 15, descricao: '+12 fome, +8 energia. Brilha no escuro!', tipo: 'comida', emoji: '🧃', efeito: { fome: 12, felicidade: 5, energia: 8, peso: 4 } },
    { id: 'pizza-nuvem', nome: 'Pizza Nuvem', preco: 30, descricao: '+35 fome, +8 felicidade. Fofinha como nuvem!', tipo: 'comida', emoji: '🍕', efeito: { fome: 35, felicidade: 8, peso: 14 } },
    { id: 'vitamina-lunar', nome: 'Vitamina Lunar', preco: 20, descricao: '+15 fome, +10 saúde. Receita da vovó Bolota!', tipo: 'comida', emoji: '🥤', efeito: { fome: 15, felicidade: 6, saude: 10, peso: 3 } },
    { id: 'cha-cura', nome: 'Chá Curativo', preco: 35, descricao: '+25 saúde. Cura a gripe do Bolotinho!', tipo: 'comida', emoji: '🍵', efeito: { saude: 25, fome: 5, felicidade: 3, peso: 1 } },
    { id: 'remedio-bolha', nome: 'Remédio Bolha', preco: 40, descricao: '+35 saúde. Cura a gripe na hora!', tipo: 'comida', emoji: '💊', efeito: { saude: 35, fome: 5, felicidade: 4, peso: 1 } },
    { id: 'bola-pula', nome: 'Bola Pula-Pula', preco: 20, descricao: 'Brincar rende +5 felicidade extra.', tipo: 'brinquedo', emoji: '⚽', efeito: { felicidade: 5 } },
    { id: 'patinho-flut', nome: 'Patinho Flutuante', preco: 30, descricao: 'Companhia para o banho. +higiene divertida!', tipo: 'brinquedo', emoji: '🦆', efeito: { felicidade: 8 } },
    { id: 'cubo-magico', nome: 'Cubo Mágico', preco: 45, descricao: 'Dá XP extra ao brincar.', tipo: 'brinquedo', emoji: '🧊', efeito: { felicidade: 10, xp: 5 } },
    { id: 'pipa-vento', nome: 'Pipa Vento Leve', preco: 35, descricao: 'Perfeita para dias animados no parque.', tipo: 'brinquedo', emoji: '🪁', efeito: { felicidade: 8 } },
    { id: 'tamborim', nome: 'Tamborim Tantan', preco: 40, descricao: 'Faz barulhinho feliz. Adoro dançar!', tipo: 'brinquedo', emoji: '🥁', efeito: { felicidade: 9 } },
    { id: 'laco-rosa', nome: 'Lacinho Rosa', preco: 50, descricao: 'Um laço charmoso para a cabeça.', tipo: 'acessorio', emoji: '🎀' },
    { id: 'oculos-sol', nome: 'Óculos de Sol', preco: 60, descricao: 'Estilo total para dias ensolarados.', tipo: 'acessorio', emoji: '🕶️' },
    { id: 'chapeu-festa', nome: 'Chapéu de Festa', preco: 55, descricao: 'Sempre pronto para comemorar!', tipo: 'acessorio', emoji: '🎩' },
    { id: 'cachecol-quente', nome: 'Cachecol Quentinho', preco: 45, descricao: 'Perfeito para noites frias.', tipo: 'acessorio', emoji: '🧣' },
    { id: 'coroa-mini', nome: 'Mini Coroa', preco: 120, descricao: 'Para o Bolotinho mais real do reino! Desbloqueia no nível 3.', tipo: 'acessorio', emoji: '👑', nivelMin: 3 },
    { id: 'tapete-nuvem', nome: 'Tapete Nuvem', preco: 40, descricao: 'Deixa o cantinho mais fofinho.', tipo: 'decoracao', emoji: '☁️' },
    { id: 'luminaria-estrela', nome: 'Luminária Estrela', preco: 70, descricao: 'Brilha à noite no cenário.', tipo: 'decoracao', emoji: '🌟' },
    { id: 'vaso-flor', nome: 'Vaso Florido', preco: 35, descricao: 'Flores que nunca murcham.', tipo: 'decoracao', emoji: '🌷' },
    { id: 'quadro-mar', nome: 'Quadro do Mar', preco: 55, descricao: 'Uma janelinha para o oceano.', tipo: 'decoracao', emoji: '🌊' },
    { id: 'tenda-listrada', nome: 'Tenda Listrada', preco: 90, descricao: 'Um mini parque de diversões! Nível 2+.', tipo: 'decoracao', emoji: '🎪', nivelMin: 2 }
  ];

  const ITEM_BY_ID = {};
  ITEMS.forEach(function (item) { ITEM_BY_ID[item.id] = item; });

  const MISSION_DEFS = [
    { id: 'alimentar-3', titulo: 'Hora do lanche', descricao: 'Alimente o Bubi 3 vezes', emoji: '🍖', meta: 3, recompensaXp: 20, tipoAcao: 'alimentar' },
    { id: 'brincar-2', titulo: 'Parque divertido', descricao: 'Brinque 2 vezes', emoji: '🎮', meta: 2, recompensaXp: 18, tipoAcao: 'brincar' },
    { id: 'carinho-3', titulo: 'Chuva de carinho', descricao: 'Faça carinho 3 vezes', emoji: '❤️', meta: 3, recompensaXp: 15, tipoAcao: 'carinho' },
    { id: 'limpar-1', titulo: 'Banho de espuma', descricao: 'Limpe o Bubi 1 vez', emoji: '🧼', meta: 1, recompensaXp: 12, tipoAcao: 'limpar' },
    { id: 'conversar-2', titulo: 'Bate-papo', descricao: 'Converse 2 vezes', emoji: '💬', meta: 2, recompensaXp: 15, tipoAcao: 'conversar' },
    { id: 'minigame-1', titulo: 'Campeão dos jogos', descricao: 'Jogue um minigame 1 vez', emoji: '🏆', meta: 1, recompensaXp: 25, tipoAcao: 'minigame' },
    { id: 'cuidar-5', titulo: 'Super cuidador', descricao: 'Cuide do Bubi 5 vezes (qualquer ação)', emoji: '⭐', meta: 5, recompensaXp: 25, tipoAcao: 'cuidar' }
  ];

  const MOOD_META = {
    feliz: { emoji: '😊', label: 'Feliz' },
    normal: { emoji: '🙂', label: 'Tranquilo' },
    triste: { emoji: '😢', label: 'Triste' },
    faminto: { emoji: '🍽️', label: 'Faminto' },
    cansado: { emoji: '😴', label: 'Cansado' },
    sujo: { emoji: '🧼', label: 'Sujinho' },
    doente: { emoji: '🤒', label: 'Doentinho' },
    animado: { emoji: '🤩', label: 'Animado' }
  };

  const DIALOGUE = {
    saudacao: ['Oi oi! Você voltou! Senti sua falta! 💛', 'Ebaa! Meu humano favorito chegou!', 'Olha quem apareceu! Vamos brincar?', 'Você voltou! Contei até as bolhas do teto! 💛'],
    eventos: ['Estou com fome! Tem um lanchinho? 🍎', 'Vamos brincar? Estou cheio de energia!', 'Estou cansado... que tal uma soneca juntos? 😴', 'Você voltou! Senti sua falta!', 'Olha o que encontrei! Uma pedrinha brilhante! ✨', 'Estou muito feliz hoje! Obrigado por cuidar de mim!', 'Bolotinhos que tomam banho ficam mais fofos... 🫧', 'Pssst... me conta um segredo? Prometo guardar!'],
    humor: {
      feliz: ['Estou tão feliz que poderia flutuar! 🎈', 'Hoje o dia está perfeito! Você, eu e muitos lanches!', 'Meu coração faz blub-blub de alegria!', 'Quero dançar! Toca aquela música imaginária!'],
      normal: ['Oi! Como foi seu dia? Me conta tudo!', 'Será que nuvens têm gosto de algodão-doce?', 'Que bom te ver! O que vamos fazer agora?', 'Blub! Só passando para dizer oi!'],
      triste: ['Estou meio tristinho... um carinho ajuda? 🥺', 'Sinto falta de brincar... você brinca comigo?', 'Às vezes um Bolotinho só precisa de um abraço...', 'Promete que não vai demorar para voltar?'],
      faminto: ['Minha barriga está roncando... blub... rooonc! 🍽️', 'Só consigo pensar em pizza nuvem e bolo arco-íris...', 'Me alimenta, por favor? Prometo ser bonzinho!', 'Estou com tanta fome que comeria até uma nuvem!'],
      cansado: ['Bocejando... meus olhinhos estão pesadinhos... 😴', 'Só cinco minutinhos de soneca... zzz...', 'Carrega eu no colo? Estou sem energia...', 'Dormir recarrega minhas bolhas de energia!'],
      sujo: ['Eca! Estou melecado... preciso de um banho! 🫧', 'Rolando na lama foi divertido, mas agora estou sujinho...', 'Banho de espuma, por favor! Com patinho!', 'Não chego perto do espelho... devo estar uma bagunça!'],
      doente: ['Atchim! Acho que peguei um resfriado de bolha... 🤒', 'Estou me sentindo meio murcho... cuida de mim?', 'Um chazinho quente e um cobertor... por favor?', 'Não se preocupe, Bolotinhos ficam bons rapidinho!'],
      animado: ['UHUUL! Estou transbordando de energia! Vamos correr! 🤩', 'Melhor dia de todos! Quero brincar, comer e dançar!', 'Você é incrível! Sério! O melhor humano do mundo!', 'Festa! Festa! Traz o bolo arco-íris!']
    },
    padrao: ['Blub! Que interessante! Me conta mais?', 'Deixa eu pensar com minhas bolhas cerebrais... legal!', 'Adoro conversar com você! O que mais você quer me contar?'],
    piadas: ['Por que o Bolotinho atravessou a rua? Para provar o bolo do outro lado! 😂', 'O que é redondo, fofo e adora você? Eu! Hehe!', 'Qual o lanche favorito do Bolotinho? Bolo arco-íris com suco estelar! 🍰', 'O que o patinho de borracha disse no banho? Você está quack-quack limpinho! 🦆', 'Toc-toc! Bolotinho de saudade de você! 💛'],
    historias: ['Era uma vez um Bolotinho que guardava pedrinhas brilhantes... elas viraram estrelas e ele pediu um humano como você! ✨', 'Ontem sonhei que era uma nuvem de algodão-doce e você me abraçava... acordei rindo! ☁️', 'Dizem que no fundo do mar mora uma vovó Bolota que faz vitamina lunar... um dia vou te levar lá! 🌊']
  };

  const WARNINGS = {
    fome: ['Blub... rooonc! Minha barriga roncou... estou com fome! 🍽️', 'Estou com fome! Tem um lanchinho pra mim? 🍎', 'Ai ai, o estômago vazio... me alimenta, por favor? 🥺'],
    sono: ['Bocejo... meus olhinhos estão pesando... que sono! 😴', 'Estou com tanto sono... me coloca pra dormir? 🛏️', 'Pisco... quase dormindo em pé! Zzz... 🥱'],
    cheio: ['Barriguinha cheia, coração feliz! Obrigado! 😋💛', 'Nhom! Estou cheinho e feliz! Você é demais! 🍰', 'Cheio! Não cabe nem mais uma bolhinha! Hehe! 🎈'],
    sujo: ['Eca! Estou todo sujinho! Me dá um banho? 🫧', 'Olha essas manchas em mim! Preciso de banho de espuma! 🧼', 'Estou melecado e fedidinho... socorro, banho! 🦆'],
    descansado: ['Recarregado! Dormi super bem! Me acorda quando quiser! ☀️', 'Energia cheia! Estou pronto pra brincar! 🎮'],
    gripe: ['Atchim! Acho que peguei gripe... compra um remedinho pra mim? 💊', 'Atchim, atchim! Estou gripadinho... Remédio Bolha me cura! 🥺', 'Meu nariz escorre... preciso de remédio! 🤧']
  };

  const DECORATIONS = {
    'tapete-nuvem': '☁️',
    'luminaria-estrela': '🌟',
    'vaso-flor': '🌷',
    'quadro-mar': '🌊',
    'tenda-listrada': '🎪'
  };

  const $ = function (id) { return document.getElementById(id); };
  const ui = {
    views: Array.from(document.querySelectorAll('[data-view]')),
    tabs: Array.from(document.querySelectorAll('[data-tab]')),
    shopFilters: Array.from(document.querySelectorAll('[data-shop-filter]')),
    gameTabs: Array.from(document.querySelectorAll('[data-game-select]')),
    gamePanels: Array.from(document.querySelectorAll('[data-game-panel]')),
    petName: $('pet-name'), petMood: $('pet-mood'), coinCount: $('coin-count'), coinCounter: $('coin-counter'),
    scene: $('scene'), sceneSun: $('scene-sun'), sceneStars: $('scene-stars'), decorationLayer: $('decoration-layer'), decorationIcon: $('decoration-icon'),
    speech: $('pet-speech'), scenePetName: $('scene-pet-name'), petWrap: document.querySelector('.pet-wrap'), petButton: $('pet-button'), petSvg: $('pet-svg'), petEffect: $('pet-effect'),
    level: $('level-label'), xpBar: $('xp-bar'), xpFill: $('xp-fill'), xpLabel: $('xp-label'), friendship: $('friendship-label'), weight: $('weight-label'),
    sleepButton: $('sleep-button'), sleepLabel: $('sleep-label'), shopBalance: $('shop-balance'), shopList: $('shop-list'), inventoryList: $('inventory-list'), missionsList: $('missions-list'), missionsDate: $('missions-date'),
    bubbleStatus: $('bubble-status'), bubbleArena: $('bubble-arena'), bubbleStart: document.querySelector('[data-game="reacao"].game-start'), bubbleResult: $('bubble-result'), bubbleTarget: $('bubble-target'),
    memoryStatus: $('memory-status'), memoryGrid: $('memory-grid'), memoryResult: $('memory-result'), memoryStart: document.querySelector('[data-game="memoria"].game-start'),
    catchStatus: $('catch-status'), holesGrid: $('holes-grid'), catchResult: $('catch-result'), catchStart: document.querySelector('[data-game="pega"].game-start'),
    snackStatus: $('snack-status'), snackRequest: $('snack-request'), snackSpeech: $('snack-speech'), snackOptions: $('snack-options'), snackFeedback: $('snack-feedback'), snackStart: document.querySelector('[data-game="lanche"].game-start'),
    chatOverlay: $('chat-overlay'), chatPetName: $('chat-pet-name'), chatMessages: $('chat-messages'), chatVoiceStatus: $('chat-voice-status'), chatModeration: $('chat-moderation'), chatWarning: $('chat-warning'), chatForm: $('chat-form'), chatInput: $('chat-input'), micButton: $('mic-button'), sendButton: $('send-button'), toast: $('toast'),
    petNameInput: $('pet-name-input'), soundToggle: $('sound-toggle'), volumeSlider: $('volume-slider'), volumeLabel: $('volume-label'), voiceToggle: $('voice-toggle'), economyToggle: $('economy-toggle'), soundSupport: $('sound-support'), ttsSupport: $('tts-support'), sttSupport: $('stt-support'), aiSupport: $('ai-support'), importFile: $('import-file'), resetButton: $('reset-button'), resetBox: $('reset-box'),
    petBody: $('pet-body'), petBodyShine: $('pet-body-shine'), petHighlight: $('pet-highlight'), petBelly: $('pet-belly'),
    eyeOpenLeft: $('eye-open-left'), eyeOpenRight: $('eye-open-right'), eyeSleepyLeft: $('eye-sleepy-left'), eyeSleepyRight: $('eye-sleepy-right'), eyeClosedLeft: $('eye-closed-left'), eyeClosedRight: $('eye-closed-right'),
    mouthSmile: $('mouth-smile'), mouthFrown: $('mouth-frown'), mouthNormal: $('mouth-normal'), mouthEat: $('mouth-eat'), mouthTalk: $('mouth-talk'), mouthO: $('mouth-o'), mouthLine: $('mouth-line'),
    tear: $('tear'), zzz: $('zzz'), dirty: $('dirty-marks'), bandAid: $('band-aid'),
    accessoryLayers: { 'laco-rosa': $('accessory-bow'), 'oculos-sol': $('accessory-glasses'), 'chapeu-festa': $('accessory-hat'), 'cachecol-quente': $('accessory-scarf'), 'coroa-mini': $('accessory-crown') }
  };

  let save;
  let offlineNotice = '';
  let offlineMinutes = 0;
  let audioContext = null;
  let audioEnabled = true;
  let audioVolume = 0.6;
  let lastLocalResponse = '';
  let toastTimer = null;
  let speechTimer = null;
  let animationTimer = null;
  let effectTimer = null;
  let moderationTimer = null;
  let eventTimer = null;
  let simulationTimer = null;
  let offlineTimer = null;
  let speechUtterance = null;
  let speechAnimation = false;

  const runtime = {
    tab: 'casa', shopFilter: 'tudo', gameType: 'reacao', animation: 'idle', speechText: 'Oi! Eu sou o Bubi! Vamos brincar?', happyUntil: 0,
    chatOpen: false, chatMessages: [], chatBusy: false, chatRequest: 0, previousFocus: null, recognition: null, listening: false, voiceMessage: '', voiceError: '',
    game: null, gameTimers: [], warningState: null, lastWarning: {}, resetConfirm: false
  };

  function isRecord(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function clampStat(value) { return Math.round(clamp(Number(value) || 0, 0, 100)); }
  function clampFloat(value) { return clamp(Number(value) || 0, 0, 100); }
  function numberIn(value, fallback, min, max, integer) {
    if (value === null || value === undefined || value === '') return fallback;
    const number = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(number)) return fallback;
    const result = clamp(number, min, max);
    return integer ? Math.round(result) : result;
  }
  function cleanText(value, maxLength) {
    return String(value === undefined || value === null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
  }
  function moderationForms(value) {
    const normalized = cleanText(value, 300).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const replacements = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' };
    const tokens = normalized.replace(/[^a-z0-9@$!]+/g, ' ').split(/\s+/).filter(Boolean).map(function (token) {
      return token.replace(/[013457@$!]/g, function (character) { return replacements[character]; }).replace(/(.)\1{2,}/g, '$1');
    });
    const spaced = tokens.join(' ');
    const compact = tokens.reduce(function (result, token) { return result + (token.length === 1 ? token : (result ? ' ' : '') + token); }, '');
    return [spaced, compact, tokens.join('')];
  }
  function isUnsafeChatText(value) {
    const forms = moderationForms(value);
    return BLOCKED_CHAT_TERMS.some(function (term) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp('(^|[^a-z0-9])' + escaped + '([^a-z0-9]|$)', 'i');
      return forms.some(function (form) { return pattern.test(form); });
    });
  }
  function clearChatModeration() {
    if (moderationTimer !== null) window.clearTimeout(moderationTimer);
    moderationTimer = null;
    if (ui.chatModeration) {
      ui.chatModeration.hidden = true;
      ui.chatModeration.textContent = '';
    }
  }
  function showChatModeration() {
    if (moderationTimer !== null) window.clearTimeout(moderationTimer);
    if (ui.chatModeration) {
      ui.chatModeration.textContent = 'Mensagem não enviada. Vamos usar palavras respeitosas. 💛';
      ui.chatModeration.hidden = false;
    }
    moderationTimer = window.setTimeout(function () { clearChatModeration(); }, 4200);
  }
  function safeTime(value, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return fallback;
    return Math.min(number, Date.now() + 60000);
  }
  function todayKey(date) {
    const value = date instanceof Date ? date : new Date();
    return String(value.getFullYear()) + '-' + String(value.getMonth() + 1).padStart(2, '0') + '-' + String(value.getDate()).padStart(2, '0');
  }
  function seededRandom(seed) {
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) { hash ^= seed.charCodeAt(index); hash = Math.imul(hash, 16777619); }
    return function () {
      hash = Math.imul(hash ^ (hash >>> 15), 2246822507);
      hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
      hash ^= hash >>> 16;
      return (hash >>> 0) / 4294967296;
    };
  }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffle(list) {
    const copy = list.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) { const other = Math.floor(Math.random() * (index + 1)); const current = copy[index]; copy[index] = copy[other]; copy[other] = current; }
    return copy;
  }
  function xpForNextLevel(level) { return 80 + level * 40; }
  function levelReward(level) { return 20 + level * 10; }
  function addXp(pet, amount) {
    let xp = Math.max(0, pet.xp) + Math.max(0, Math.round(amount));
    let level = pet.nivel;
    let levels = 0;
    while (xp >= xpForNextLevel(level) && level < 999) { xp -= xpForNextLevel(level); level += 1; levels += 1; }
    pet.xp = xp;
    pet.nivel = level;
    return levels;
  }

  function createPet(name) {
    const timestamp = Date.now();
    return { nome: cleanText(name || 'Bubi', 20) || 'Bubi', especie: 'Bolotinho', fome: 80, felicidade: 80, energia: 90, higiene: 85, saude: 95, amizade: 10, xp: 0, nivel: 1, moedas: 50, peso: 50, dormindo: false, doente: false, gripado: false, lastSaved: timestamp, lastAction: '', ultimoBrincar: timestamp, ultimaMissao: timestamp, ultimoCarinho: timestamp, createdAt: timestamp, equippedAccessory: '', placedDecoration: '' };
  }

  function generateMissions(date) {
    const random = seededRandom('bubi-' + date);
    const pool = MISSION_DEFS.slice();
    const chosen = [];
    while (pool.length && chosen.length < 4) { const index = Math.floor(random() * pool.length); chosen.push(pool.splice(index, 1)[0]); }
    return chosen.map(function (mission) { return { id: mission.id, titulo: mission.titulo, descricao: mission.descricao, emoji: mission.emoji, meta: mission.meta, recompensaXp: mission.recompensaXp, tipoAcao: mission.tipoAcao, progresso: 0, concluida: false, resgatada: false }; });
  }

  function createSave(settings) {
    const date = todayKey();
    return { version: 1, pet: createPet('Bubi'), inventario: { 'maca-bolha': 2 }, missoes: generateMissions(date), missoesData: date, contadores: {}, configuracoes: Object.assign({}, DEFAULT_SETTINGS, settings || {}) };
  }

  function normalizePet(source) {
    const pet = createPet(source && source.nome);
    if (!isRecord(source)) return pet;
    STAT_KEYS.forEach(function (key) { pet[key] = numberIn(source[key], pet[key], 0, 100, true); });
    pet.amizade = numberIn(source.amizade, pet.amizade, 0, 100, true);
    pet.xp = numberIn(source.xp, 0, 0, 999999, true);
    pet.nivel = numberIn(source.nivel, 1, 1, 999, true);
    pet.moedas = numberIn(source.moedas, 50, 0, 9999999, true);
    pet.peso = numberIn(source.peso, 50, 0, 100, false);
    pet.dormindo = source.dormindo === true;
    pet.gripado = source.gripado === true || source.doente === true;
    pet.doente = pet.gripado || source.doente === true || pet.saude < 30;
    pet.lastSaved = safeTime(source.lastSaved, Date.now());
    pet.createdAt = safeTime(source.createdAt, pet.lastSaved);
    pet.ultimoBrincar = safeTime(source.ultimoBrincar, pet.lastSaved);
    pet.ultimaMissao = safeTime(source.ultimaMissao, pet.lastSaved);
    pet.ultimoCarinho = safeTime(source.ultimoCarinho, pet.lastSaved);
    pet.lastAction = cleanText(source.lastAction, 40);
    pet.equippedAccessory = cleanText(source.equippedAccessory, 50);
    pet.placedDecoration = cleanText(source.placedDecoration, 50);
    return pet;
  }

  function normalizeInventory(source) {
    const inventory = {};
    if (!isRecord(source)) return inventory;
    Object.keys(source).forEach(function (id) { if (ITEM_BY_ID[id]) { const quantity = numberIn(source[id], 0, 0, 999, true); if (quantity > 0) inventory[id] = quantity; } });
    return inventory;
  }

  function normalizeCounters(source) {
    const counters = {};
    if (!isRecord(source)) return counters;
    Object.keys(source).forEach(function (key) { if (/^[a-z-]{1,30}$/.test(key)) counters[key] = numberIn(source[key], 0, 0, 999999, true); });
    return counters;
  }

  function normalizeMissions(source, date) {
    if (!Array.isArray(source)) return generateMissions(date);
    const chosen = [];
    const used = {};
    source.forEach(function (saved) {
      if (!isRecord(saved)) return;
      const definition = MISSION_DEFS.find(function (mission) { return mission.id === saved.id; });
      if (!definition || used[definition.id]) return;
      used[definition.id] = true;
      const progress = numberIn(saved.progresso, 0, 0, definition.meta, true);
      chosen.push({ id: definition.id, titulo: definition.titulo, descricao: definition.descricao, emoji: definition.emoji, meta: definition.meta, recompensaXp: definition.recompensaXp, tipoAcao: definition.tipoAcao, progresso: progress, concluida: saved.concluida === true || progress >= definition.meta, resgatada: saved.resgatada === true });
    });
    return chosen.length === 4 ? chosen : generateMissions(date);
  }

  function normalizeSettings(source) {
    const settings = Object.assign({}, DEFAULT_SETTINGS);
    if (!isRecord(source)) return settings;
    if (typeof source.som === 'boolean') settings.som = source.som;
    if (typeof source.voz === 'boolean') settings.voz = source.voz;
    if (typeof source.modoEconomia === 'boolean') settings.modoEconomia = source.modoEconomia;
    settings.volume = numberIn(source.volume, DEFAULT_SETTINGS.volume, 0, 1, false);
    return settings;
  }

  function normalizeSave(source) {
    if (!isRecord(source)) return null;
    if (source.version !== undefined && Number(source.version) > SAVE_VERSION) return null;
    if (Object.prototype.hasOwnProperty.call(source, 'pet') && !isRecord(source.pet)) return null;
    const date = todayKey();
    const pet = normalizePet(source.pet);
    const inventory = normalizeInventory(source.inventario);
    if (pet.equippedAccessory && (!inventory[pet.equippedAccessory] || !ITEM_BY_ID[pet.equippedAccessory] || ITEM_BY_ID[pet.equippedAccessory].tipo !== 'acessorio')) pet.equippedAccessory = '';
    if (pet.placedDecoration && (!inventory[pet.placedDecoration] || !ITEM_BY_ID[pet.placedDecoration] || ITEM_BY_ID[pet.placedDecoration].tipo !== 'decoracao')) pet.placedDecoration = '';
    return { version: 1, pet: pet, inventario: inventory, missoes: source.missoesData === date ? normalizeMissions(source.missoes, date) : generateMissions(date), missoesData: date, contadores: normalizeCounters(source.contadores), configuracoes: normalizeSettings(source.configuracoes) };
  }

  function applyOfflineProgress(pet) {
    const timestamp = Date.now();
    const minutes = Math.min(MAX_OFFLINE_MINUTES, Math.max(0, (timestamp - pet.lastSaved) / 60000));
    if (minutes < 1) { pet.lastSaved = timestamp; return minutes; }
    const withoutFun = Math.max(0, (timestamp - Math.max(pet.ultimoBrincar || pet.createdAt, pet.ultimaMissao || pet.createdAt)) / 60000);
    const withoutPet = Math.max(0, (timestamp - (pet.ultimoCarinho || pet.createdAt)) / 60000);
    const extraFun = withoutFun > 5 ? Math.min(20, (withoutFun - 5) * 0.15) : 0;
    const extraPet = withoutPet > 5 ? Math.min(15, (withoutPet - 5) * 0.12) : 0;
    if (!pet.gripado && minutes >= 20 && Math.random() < (pet.higiene < 20 ? 0.3 : 0.08)) { pet.gripado = true; pet.saude = clampStat(pet.saude - 12); }
    if (pet.gripado) pet.saude = clampStat(pet.saude - Math.min(15, minutes * 0.2));
    if (pet.dormindo) {
      pet.energia = clampStat(pet.energia + minutes * 1.2);
      pet.fome = clampStat(pet.fome - minutes * 0.175);
      pet.felicidade = clampStat(pet.felicidade - minutes * 0.08 - (extraFun + extraPet) * 0.3);
      pet.higiene = clampStat(pet.higiene - minutes * 0.08);
    } else {
      pet.fome = clampStat(pet.fome - minutes * 0.35);
      pet.felicidade = clampStat(pet.felicidade - minutes * 0.25 - extraFun - extraPet);
      pet.energia = clampStat(pet.energia - minutes * 0.15);
      pet.higiene = clampStat(pet.higiene - minutes * 0.2);
      pet.saude = clampStat(pet.saude - minutes * 0.05);
    }
    if (pet.fome <= 5 || pet.higiene <= 5) pet.saude = clampStat(pet.saude - minutes * 0.15);
    pet.peso = clampStat(pet.peso + (pet.fome > 60 ? minutes * 0.02 : pet.fome < 30 ? -minutes * 0.05 : 0));
    if (pet.peso >= 90 || pet.peso <= 10) pet.saude = clampStat(pet.saude - minutes * 0.05);
    pet.saude = Math.max(10, pet.saude);
    pet.doente = pet.gripado || pet.saude < 30 || (pet.higiene < 15 && pet.fome < 15);
    pet.lastSaved = timestamp;
    return minutes;
  }

  function tickPet(pet) {
    if (pet.dormindo) {
      pet.energia = clampFloat(pet.energia + 6);
      pet.fome = clampFloat(pet.fome - 0.15);
      pet.felicidade = clampFloat(pet.felicidade - 0.05);
      pet.doente = pet.gripado || pet.saude < 30;
      return;
    }
    if (!pet.gripado && Math.random() < (pet.higiene < 20 ? 0.02 : 0.005)) pet.gripado = true;
    const withoutFun = Math.max(0, (Date.now() - Math.max(pet.ultimoBrincar || pet.createdAt, pet.ultimaMissao || pet.createdAt)) / 60000);
    const withoutPet = Math.max(0, (Date.now() - (pet.ultimoCarinho || pet.createdAt)) / 60000);
    const extra = withoutFun > 5 ? Math.min(0.6, (withoutFun - 5) * 0.03) : 0;
    const extraCarinho = withoutPet > 5 ? Math.min(0.5, (withoutPet - 5) * 0.025) : 0;
    const weightDelta = pet.fome > 70 ? 0.06 : pet.fome < 25 ? -0.12 : 0;
    const weightOutside = pet.peso >= 90 || pet.peso <= 10 ? -0.15 : 0;
    pet.fome = clampFloat(pet.fome - 0.12);
    pet.felicidade = clampFloat(pet.felicidade - 0.1 - extra - extraCarinho);
    pet.energia = clampFloat(pet.energia - 0.05);
    pet.higiene = clampFloat(pet.higiene - 0.08);
    pet.peso = clampFloat(pet.peso + weightDelta);
    pet.saude = clampFloat(pet.saude + (pet.gripado ? -0.4 : pet.fome > 40 && pet.higiene > 40 ? 0.05 : -0.05) + weightOutside);
    pet.saude = Math.max(10, pet.saude);
    pet.doente = pet.gripado || pet.saude < 30;
  }

  function loadSave() {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return createSave();
      const normalized = normalizeSave(JSON.parse(raw));
      if (!normalized) return createSave();
      const minutes = applyOfflineProgress(normalized.pet);
      offlineMinutes = minutes;
      if (minutes >= 5) offlineNotice = 'Você voltou! Senti sua falta! 💜 (' + Math.round(minutes) + ' min fora)';
      return normalized;
    } catch (error) { return createSave(); }
  }

  function persist() {
    if (!save) return;
    save.pet.lastSaved = Date.now();
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (error) { return; }
  }

  function removeStoredSave() {
    try { window.localStorage.removeItem(SAVE_KEY); } catch (error) { return; }
  }

  function currentMood() {
    const pet = save.pet;
    if (pet.dormindo) return 'cansado';
    if (pet.gripado || pet.saude < 30) return 'doente';
    if (pet.fome < 25) return 'faminto';
    if (pet.energia < 25) return 'cansado';
    if (pet.higiene < 25) return 'sujo';
    if (pet.felicidade < 30) return 'triste';
    if (pet.felicidade > 80 && pet.energia > 60) return 'animado';
    if (pet.felicidade > 60) return 'feliz';
    return 'normal';
  }

  function effectiveMood() { return runtime.happyUntil > Date.now() ? 'feliz' : currentMood(); }
  function setVisible(element, visible) { if (element) element.classList.toggle('is-hidden', !visible); }
  function setText(element, value) { if (element) element.textContent = String(value); }
  function setProgress(element, value, max, label) {
    if (!element) return;
    const bounded = clamp(Number(value) || 0, 0, Number(max) || 100);
    const fill = element.firstElementChild;
    if (fill) fill.style.width = ((bounded / (Number(max) || 100)) * 100) + '%';
    element.setAttribute('aria-valuenow', String(Math.round(bounded)));
    element.setAttribute('aria-valuemax', String(Number(max) || 100));
    if (label) element.setAttribute('aria-label', label);
  }
  function weightLabel(value) {
    if (value <= 15) return 'Muito magrinho';
    if (value <= 35) return 'Magro';
    if (value < 70) return 'Normal';
    if (value < 88) return 'Gordinho';
    return 'Muito gordinho';
  }

  function renderHeader() {
    const pet = save.pet;
    const mood = MOOD_META[effectiveMood()];
    setText(ui.petName, pet.nome);
    setText(ui.petMood, mood.emoji + ' ' + mood.label + ' · Nv ' + pet.nivel);
    setText(ui.coinCount, pet.moedas);
    ui.coinCounter.setAttribute('aria-label', 'Você tem ' + pet.moedas + ' moedas');
  }

  function updatePetVisual() {
    if (!save) return;
    const pet = save.pet;
    const mood = effectiveMood();
    const animation = runtime.animation;
    const sleeping = pet.dormindo || animation === 'sleeping';
    const lowEnergy = !sleeping && pet.energia < 30;
    const happy = animation === 'happy' || animation === 'playing' || animation === 'celebrating' || mood === 'feliz' || mood === 'animado';
    const sad = mood === 'triste' || animation === 'sad' || (!happy && pet.felicidade < 35);
    const sick = mood === 'doente' || animation === 'sick' || pet.gripado;
    const angry = animation === 'angry';
    const surprised = animation === 'surprised';
    const talking = animation === 'talking';
    const eating = animation === 'eating';
    ui.petButton.className = 'pet-button pet-' + animation + (sleeping ? ' is-sleeping' : '');
    ui.petButton.setAttribute('aria-label', 'Fazer carinho em ' + pet.nome + ', um Bolotinho ' + mood);
    ui.petSvg.setAttribute('aria-label', pet.nome + ', o Bolotinho');
    const factor = 0.85 + (clamp(pet.peso, 0, 100) / 100) * 0.3;
    const bodyY = 183 - 68 * factor;
    [ui.petBody, ui.petBodyShine].forEach(function (element) {
      if (!element) return;
      element.setAttribute('cy', String(bodyY));
      element.setAttribute('rx', String(72 * factor));
      element.setAttribute('ry', String(68 * factor));
    });
    if (ui.petHighlight) {
      ui.petHighlight.setAttribute('cx', String(110 - 24 * factor));
      ui.petHighlight.setAttribute('cy', String(bodyY - 35 * factor));
    }
    if (ui.petBelly) {
      ui.petBelly.setAttribute('cy', String(183 - 38 * factor));
      ui.petBelly.setAttribute('rx', String(34 * factor));
      ui.petBelly.setAttribute('ry', String(24 * factor));
    }
    setVisible(ui.eyeOpenLeft, !sleeping && !lowEnergy);
    setVisible(ui.eyeOpenRight, !sleeping && !lowEnergy);
    setVisible(ui.eyeSleepyLeft, !sleeping && lowEnergy);
    setVisible(ui.eyeSleepyRight, !sleeping && lowEnergy);
    setVisible(ui.eyeClosedLeft, sleeping);
    setVisible(ui.eyeClosedRight, sleeping);
    setVisible(ui.mouthEat, eating);
    setVisible(ui.mouthTalk, talking);
    setVisible(ui.mouthSmile, !eating && !talking && happy);
    setVisible(ui.mouthFrown, !eating && !talking && (sad || sick));
    setVisible(ui.mouthO, !eating && !talking && !happy && !sad && !sick && surprised);
    setVisible(ui.mouthLine, !eating && !talking && !happy && !sad && !sick && angry);
    setVisible(ui.mouthNormal, !eating && !talking && !happy && !sad && !sick && !surprised && !angry);
    setVisible(ui.tear, !sleeping && sad);
    setVisible(ui.zzz, sleeping);
    setVisible(ui.dirty, pet.higiene < 50);
    if (ui.dirty) ui.dirty.setAttribute('opacity', pet.higiene < 25 ? '0.9' : '0.45');
    setVisible(ui.bandAid, pet.gripado || pet.saude < 30);
    Object.keys(ui.accessoryLayers).forEach(function (id) { setVisible(ui.accessoryLayers[id], pet.equippedAccessory === id); });
  }

  function renderHouse() {
    const pet = save.pet;
    const sleeping = pet.dormindo || runtime.animation === 'sleeping';
    ui.scene.classList.toggle('night', sleeping);
    ui.scene.classList.toggle('day', !sleeping);
    setText(ui.sceneSun, sleeping ? '🌙' : '☀️');
    setVisible(ui.sceneStars, sleeping);
    setText(ui.speech, runtime.speechText);
    setText(ui.scenePetName, pet.nome);
    setText(ui.chatPetName, pet.nome);
    if (pet.placedDecoration && DECORATIONS[pet.placedDecoration]) {
      setText(ui.decorationIcon, DECORATIONS[pet.placedDecoration]);
      ui.decorationLayer.setAttribute('data-decoration', pet.placedDecoration);
      setVisible(ui.decorationLayer, true);
    } else {
      setVisible(ui.decorationLayer, false);
    }
    updatePetVisual();
  }

  function renderStats() {
    const pet = save.pet;
    const maxXp = xpForNextLevel(pet.nivel);
    setText(ui.level, pet.nivel);
    setText(ui.xpLabel, pet.xp + '/' + maxXp + ' XP');
    setText(ui.friendship, '💛 ' + Math.round(pet.amizade));
    setText(ui.weight, '⚖️ ' + weightLabel(Math.round(pet.peso)));
    setProgress(ui.xpBar, pet.xp, maxXp, 'Experiência ' + Math.round(pet.xp) + ' de ' + maxXp);
    const labels = { fome: 'Saciedade', felicidade: 'Felicidade', energia: 'Energia', higiene: 'Higiene', saude: 'Saúde' };
    STAT_KEYS.forEach(function (key) {
      const amount = clampStat(pet[key]);
      const fill = $('fill-' + key);
      if (fill) {
        fill.classList.remove('good', 'medium', 'low');
        fill.classList.add(amount >= 60 ? 'good' : amount >= 30 ? 'medium' : 'low');
      }
      setText($('value-' + key), amount);
      setProgress($('bar-' + key), amount, 100, labels[key] + ': ' + amount + ' de 100');
    });
    const sleeping = pet.dormindo;
    ui.sleepButton.classList.toggle('acordar', sleeping);
    ui.sleepButton.classList.toggle('sleep-button', !sleeping);
    setText(ui.sleepLabel, sleeping ? 'Acordar' : 'Dormir');
    ui.sleepButton.setAttribute('aria-label', sleeping ? 'Acordar o bichinho' : 'Colocar o bichinho para dormir');
    document.querySelectorAll('[data-action="feed"], [data-action="play"], [data-action="dance"], [data-action="pull"], [data-action="clean"]').forEach(function (button) { button.disabled = sleeping; });
  }

  function renderShop() {
    const filter = runtime.shopFilter;
    setText(ui.shopBalance, '🪙 ' + save.pet.moedas);
    ui.shopFilters.forEach(function (button) {
      const active = button.getAttribute('data-shop-filter') === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    ui.shopList.replaceChildren();
    ITEMS.filter(function (item) { return filter === 'tudo' || item.tipo === filter; }).forEach(function (item) {
      const owned = item.tipo !== 'comida' && (save.inventario[item.id] || 0) > 0;
      const locked = item.nivelMin && save.pet.nivel < item.nivelMin;
      const noMoney = !owned && save.pet.moedas < item.preco;
      const row = document.createElement('li');
      row.className = 'item-row shop-item-row';
      const emoji = document.createElement('span');
      emoji.className = 'item-emoji';
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = item.emoji;
      const copy = document.createElement('div');
      copy.className = 'item-copy';
      const title = document.createElement('strong');
      title.textContent = item.nome + (owned ? ' ✅' : '');
      const description = document.createElement('small');
      description.textContent = item.descricao;
      const meta = document.createElement('span');
      meta.className = 'item-meta';
      meta.textContent = '💰 ' + item.preco + ' 🪙' + (locked ? ' · Nv ' + item.nivelMin + '+' : '');
      copy.append(title, description, meta);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'item-action' + (owned ? ' owned' : '');
      button.setAttribute('data-action', 'buy');
      button.setAttribute('data-id', item.id);
      button.textContent = owned ? 'Comprado!' : locked ? '🔒' : noMoney ? 'Sem saldo' : 'Comprar';
      button.disabled = owned || locked || noMoney;
      button.setAttribute('aria-label', owned ? item.nome + ' já comprado' : 'Comprar ' + item.nome + ' por ' + item.preco + ' moedas');
      row.append(emoji, copy, button);
      ui.shopList.appendChild(row);
    });
  }

  function renderInventory() {
    ui.inventoryList.replaceChildren();
    const ids = Object.keys(save.inventario).filter(function (id) { return ITEM_BY_ID[id] && save.inventario[id] > 0; });
    if (!ids.length) {
      const empty = document.createElement('li');
      empty.className = 'panel-intro empty-inventory';
      empty.textContent = 'Sua mochila está vazia! Visite a lojinha para comprar lanchinhos, brinquedos e acessórios.';
      ui.inventoryList.appendChild(empty);
      return;
    }
    ids.forEach(function (id) {
      const item = ITEM_BY_ID[id];
      const equipped = save.pet.equippedAccessory === id;
      const row = document.createElement('li');
      row.className = 'item-row';
      const emoji = document.createElement('span');
      emoji.className = 'item-emoji';
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = item.emoji;
      const copy = document.createElement('div');
      copy.className = 'item-copy';
      const title = document.createElement('strong');
      title.textContent = item.nome + (equipped ? ' ✅' : '');
      const description = document.createElement('small');
      description.textContent = item.descricao;
      const meta = document.createElement('span');
      meta.className = 'item-meta';
      meta.textContent = 'Qtd: ' + save.inventario[id] + ' · ' + item.tipo;
      copy.append(title, description, meta);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'item-action';
      button.setAttribute('data-action', 'use-item');
      button.setAttribute('data-id', id);
      button.textContent = item.tipo === 'comida' ? 'Dar' : item.tipo === 'acessorio' ? (equipped ? 'Tirar' : 'Vestir') : 'Usar';
      button.setAttribute('aria-label', item.tipo === 'comida' ? 'Dar ' + item.nome + ' para comer' : item.tipo === 'acessorio' ? (equipped ? 'Remover ' + item.nome : 'Equipar ' + item.nome) : 'Usar ' + item.nome);
      row.append(emoji, copy, button);
      ui.inventoryList.appendChild(row);
    });
  }

  function renderMissions() {
    ui.missionsList.replaceChildren();
    setText(ui.missionsDate, new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }));
    save.missoes.forEach(function (mission) {
      const row = document.createElement('li');
      row.className = 'item-row mission-row';
      const emoji = document.createElement('span');
      emoji.className = 'item-emoji';
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = mission.emoji;
      const copy = document.createElement('div');
      copy.className = 'item-copy';
      const title = document.createElement('strong');
      title.textContent = mission.titulo + (mission.concluida ? ' ✅' : '');
      const description = document.createElement('small');
      description.textContent = mission.descricao;
      const progress = document.createElement('div');
      progress.className = 'mission-progress';
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', String(mission.meta));
      progress.setAttribute('aria-valuenow', String(mission.progresso));
      progress.setAttribute('aria-label', mission.titulo + ': ' + mission.progresso + ' de ' + mission.meta);
      const progressFill = document.createElement('div');
      progressFill.style.width = Math.round((mission.progresso / mission.meta) * 100) + '%';
      progress.appendChild(progressFill);
      const meta = document.createElement('span');
      meta.className = 'item-meta';
      meta.textContent = mission.progresso + '/' + mission.meta + ' · 🎁 +' + mission.recompensaXp + ' XP';
      copy.append(title, description, progress, meta);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'item-action';
      button.setAttribute('data-action', 'rescue-mission');
      button.setAttribute('data-id', mission.id);
      button.textContent = mission.resgatada ? 'Ok!' : mission.concluida ? 'Resgatar' : 'Falta';
      button.disabled = !mission.concluida || mission.resgatada;
      button.setAttribute('aria-label', mission.resgatada ? 'Recompensa já resgatada' : mission.concluida ? 'Resgatar recompensa de ' + mission.titulo : 'Complete ' + mission.titulo + ' para resgatar');
      row.append(emoji, copy, button);
      ui.missionsList.appendChild(row);
    });
  }

  function renderConfig() {
    const config = save.configuracoes;
    if (document.activeElement !== ui.petNameInput) ui.petNameInput.value = save.pet.nome;
    ui.soundToggle.checked = config.som;
    ui.volumeSlider.value = String(config.volume);
    setText(ui.volumeLabel, Math.round(config.volume * 100) + '%');
    ui.voiceToggle.checked = config.voz;
    ui.economyToggle.checked = config.modoEconomia;
    setText(ui.soundSupport, audioSupported() ? '' : ' (não suportado)');
    setText(ui.ttsSupport, ttsSupported() ? '' : ' (não suportado)');
    setText(ui.sttSupport, sttSupported() ? 'suportado ✅' : 'não suportado — use o teclado ⌨️');
    setText(ui.aiSupport, aiEndpoint() ? 'endpoint opcional ativo' : 'diálogo local 💛');
    ui.chatWarning.hidden = ttsSupported();
    ui.resetBox.hidden = !runtime.resetConfirm;
  }

  function renderGameTabs() {
    ui.gameTabs.forEach(function (button) {
      const active = button.getAttribute('data-game-select') === runtime.gameType;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    ui.gamePanels.forEach(function (panel) {
      const active = panel.getAttribute('data-game-panel') === runtime.gameType;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  }

  function renderAll() {
    if (!save) return;
    renderHeader();
    renderHouse();
    renderStats();
    renderShop();
    renderInventory();
    renderMissions();
    renderConfig();
    renderGameTabs();
  }

  function clearAnimationTimer() {
    if (animationTimer !== null) { window.clearTimeout(animationTimer); animationTimer = null; }
  }

  function setAnimation(animation, duration) {
    clearAnimationTimer();
    runtime.animation = animation;
    updatePetVisual();
    if (duration) {
      animationTimer = window.setTimeout(function () { runtime.animation = 'idle'; animationTimer = null; updatePetVisual(); }, duration);
    }
  }

  function say(text, animation, duration, withVoice) {
    runtime.speechText = cleanText(text, 220) || 'Blub!';
    setText(ui.speech, runtime.speechText);
    if (speechTimer !== null) window.clearTimeout(speechTimer);
    if (animation) setAnimation(animation, duration || 3000);
    if (withVoice) speak(runtime.speechText);
    speechTimer = window.setTimeout(function () { speechTimer = null; }, duration || 3500);
  }

  function flashEffect(symbol, duration) {
    if (effectTimer !== null) window.clearTimeout(effectTimer);
    ui.petEffect.textContent = symbol;
    ui.petEffect.classList.remove('pet-effect');
    void ui.petEffect.offsetWidth;
    ui.petEffect.classList.add('pet-effect');
    effectTimer = window.setTimeout(function () { ui.petEffect.textContent = ''; effectTimer = null; }, duration || 1200);
  }

  function showToast(message) {
    if (toastTimer !== null) window.clearTimeout(toastTimer);
    ui.toast.textContent = cleanText(message, 180);
    ui.toast.hidden = false;
    toastTimer = window.setTimeout(function () { ui.toast.hidden = true; ui.toast.textContent = ''; toastTimer = null; }, 2800);
  }

  function configureAudio() {
    audioEnabled = save.configuracoes.som;
    audioVolume = clamp(save.configuracoes.volume, 0, 1);
  }

  function audioSupported() {
    try { return Boolean(window.AudioContext || window.webkitAudioContext); } catch (error) { return false; }
  }

  function getAudioContext() {
    if (!audioSupported()) return null;
    try {
      if (!audioContext) {
        const AudioConstructor = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioConstructor();
      }
      if (audioContext.state === 'suspended' && audioContext.resume) audioContext.resume();
      return audioContext;
    } catch (error) { return null; }
  }

  function tone(frequency, duration, type, delay, multiplier) {
    if (!audioEnabled) return;
    const context = getAudioContext();
    if (!context) return;
    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + (delay || 0);
      const peak = Math.max(0.001, audioVolume * 0.32 * (multiplier || 1));
      oscillator.type = type || 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.04);
    } catch (error) { return; }
  }

  function sound(name) {
    if (name === 'click') tone(520, 0.08);
    if (name === 'eat') { tone(300, 0.1, 'square'); tone(420, 0.1, 'square', 0.1); tone(350, 0.12, 'square', 0.2); }
    if (name === 'pet') { tone(660, 0.15); tone(880, 0.2, 'sine', 0.12); }
    if (name === 'reward') { tone(523, 0.12, 'triangle'); tone(659, 0.12, 'triangle', 0.12); tone(784, 0.2, 'triangle', 0.24); }
    if (name === 'error') tone(180, 0.2, 'sawtooth', 0, 0.7);
    if (name === 'level') [523, 659, 784, 1046].forEach(function (frequency, index) { tone(frequency, 0.18, 'triangle', index * 0.13); });
    if (name === 'sleep') { tone(440, 0.25); tone(330, 0.3, 'sine', 0.22); }
    if (name === 'dance') [392, 523, 659, 784, 659, 784].forEach(function (frequency, index) { tone(frequency, 0.12, 'triangle', index * 0.11, 0.9); });
    if (name === 'pull') { tone(760, 0.09, 'triangle'); tone(360, 0.14, 'square', 0.1, 0.75); tone(820, 0.2, 'sine', 0.28); }
  }

  function ttsSupported() {
    try { return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function'; } catch (error) { return false; }
  }

  function stopSpeech() {
    try { if (ttsSupported()) window.speechSynthesis.cancel(); } catch (error) {}
    speechUtterance = null;
    if (speechAnimation) {
      speechAnimation = false;
      if (runtime.animation === 'talking') setAnimation('idle', 250);
    }
  }

  function speak(text) {
    if (!save.configuracoes.voz || !ttsSupported()) return;
    stopSpeech();
    try {
      const utterance = new SpeechSynthesisUtterance(cleanText(text, 220));
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 1.3;
      utterance.onstart = function () { speechAnimation = true; setAnimation('talking', 1800); };
      utterance.onend = function () { if (speechUtterance === utterance) speechUtterance = null; speechAnimation = false; if (runtime.animation === 'talking') setAnimation('idle', 250); };
      utterance.onerror = utterance.onend;
      speechUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) { speechUtterance = null; }
  }

  function sttConstructor() {
    try { return window.SpeechRecognition || window.webkitSpeechRecognition || null; } catch (error) { return null; }
  }
  function sttSupported() { return Boolean(sttConstructor()); }

  function setVoiceMessage(message, isError) {
    runtime.voiceMessage = cleanText(message, 180);
    runtime.voiceError = isError ? runtime.voiceMessage : '';
    renderVoiceStatus();
  }

  function renderVoiceStatus() {
    ui.chatVoiceStatus.replaceChildren();
    if (runtime.listening) {
      const text = document.createElement('span');
      text.textContent = '🎤 Ouvindo... fale agora! ';
      ui.chatVoiceStatus.appendChild(text);
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.setAttribute('data-action', 'cancel-voice');
      cancel.textContent = 'Cancelar';
      ui.chatVoiceStatus.appendChild(cancel);
    } else if (runtime.voiceError) {
      ui.chatVoiceStatus.textContent = runtime.voiceError;
    } else if (runtime.voiceMessage) {
      ui.chatVoiceStatus.textContent = runtime.voiceMessage;
    }
    ui.micButton.classList.toggle('is-listening', runtime.listening);
    ui.micButton.setAttribute('aria-label', runtime.listening ? 'Cancelar escuta' : 'Falar com microfone');
  }

  function stopRecognition() {
    const recognition = runtime.recognition;
    runtime.recognition = null;
    runtime.listening = false;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try { recognition.abort(); } catch (error) { try { recognition.stop(); } catch (ignored) {} }
    }
    renderVoiceStatus();
  }

  function startRecognition() {
    if (runtime.listening) { stopRecognition(); return; }
    const Recognition = sttConstructor();
    if (!Recognition) { setVoiceMessage('Seu navegador não suporta microfone. Use o teclado! 🎤❌', true); return; }
    try {
      const recognition = new Recognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = function (event) {
        const result = event && event.results && event.results[0] && event.results[0][0];
        const text = cleanText(result && result.transcript, 200);
        stopRecognition();
        if (text) { ui.chatInput.value = text; setVoiceMessage('Você disse: “' + text + '”'); sendChat(); } else { setVoiceMessage('Não entendi. Tente de novo!', true); }
      };
      recognition.onerror = function () { stopRecognition(); setVoiceMessage('Não consegui ouvir. Tente de novo!', true); };
      recognition.onend = function () { if (runtime.recognition === recognition) { runtime.recognition = null; runtime.listening = false; renderVoiceStatus(); } };
      runtime.recognition = recognition;
      runtime.listening = true;
      setVoiceMessage('');
      renderVoiceStatus();
      recognition.start();
    } catch (error) { runtime.recognition = null; runtime.listening = false; setVoiceMessage('Microfone indisponível no momento.', true); }
  }

  function addChatMessage(de, text) {
    const message = { id: (de === 'pet' ? 'p-' : 'u-') + Date.now() + '-' + Math.random().toString(16).slice(2), de: de, texto: cleanText(text, 220), quando: Date.now() };
    runtime.chatMessages.push(message);
    if (runtime.chatMessages.length > 20) runtime.chatMessages = runtime.chatMessages.slice(-20);
    return message;
  }

  function renderChat() {
    ui.chatMessages.replaceChildren();
    if (!runtime.chatMessages.length) {
      const empty = document.createElement('p');
      empty.className = 'chat-empty';
      empty.textContent = 'Diga oi! ' + save.pet.nome + ' adora conversar. 💛';
      ui.chatMessages.appendChild(empty);
    } else {
      runtime.chatMessages.forEach(function (message) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-message ' + (message.de === 'pet' ? 'pet' : 'player');
        const label = document.createElement('strong');
        label.textContent = message.de === 'pet' ? '🟢 ' + save.pet.nome + ': ' : '🧑 Você: ';
        const content = document.createElement('span');
        content.textContent = message.texto;
        bubble.append(label, content);
        ui.chatMessages.appendChild(bubble);
      });
    }
    if (runtime.chatBusy) {
      const thinking = document.createElement('p');
      thinking.className = 'chat-thinking';
      thinking.textContent = save.pet.nome + ' está pensando... 💭';
      ui.chatMessages.appendChild(thinking);
    }
    ui.chatMessages.scrollTop = ui.chatMessages.scrollHeight;
    ui.sendButton.disabled = runtime.chatBusy || !ui.chatInput.value.trim();
  }

  function openChat() {
    if (runtime.chatOpen) return;
    runtime.chatOpen = true;
    runtime.previousFocus = document.activeElement;
    clearChatModeration();
    ui.chatOverlay.hidden = false;
    if (!runtime.chatMessages.length) addChatMessage('pet', pick(DIALOGUE.saudacao));
    renderChat();
    renderVoiceStatus();
    window.setTimeout(function () { if (runtime.chatOpen) ui.chatInput.focus(); }, 30);
    registerMissionAction('conversar');
    persist();
    renderAll();
    say(pick(DIALOGUE.humor[currentMood()] || DIALOGUE.humor.normal), 'talking', 3000, true);
    sound('click');
  }

  function closeChat(restoreFocus) {
    if (!runtime.chatOpen && ui.chatOverlay.hidden) return;
    stopRecognition();
    stopSpeech();
    clearChatModeration();
    runtime.chatOpen = false;
    runtime.chatBusy = false;
    runtime.chatRequest += 1;
    ui.chatOverlay.hidden = true;
    if (restoreFocus !== false && runtime.previousFocus && typeof runtime.previousFocus.focus === 'function') runtime.previousFocus.focus();
    renderChat();
  }

  function localResponse(original, mood) {
    const text = cleanText(original, 200);
    if (!text) return 'Diz alguma coisinha pra mim? Blub? 💛';
    const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[?!.,;:()"'«»]/g, ' ').replace(/\s+/g, ' ').trim();
    const pet = save.pet;
    const has = function () { const words = Array.prototype.slice.call(arguments); return words.some(function (word) { return normalized.includes(word); }); };
    const choose = function (options) {
      const different = options.length > 1 ? options.filter(function (option) { return option !== lastLocalResponse; }) : options;
      const answer = pick(different.length ? different : options);
      lastLocalResponse = answer;
      return answer;
    };
    const bodyState = function () {
      const problems = [];
      if (pet.fome < 30) problems.push('estou com fome');
      if (pet.energia < 30) problems.push('estou cansadinho');
      if (pet.higiene < 30) problems.push('estou precisando de banho');
      if (pet.saude < 40) problems.push('estou meio dodói');
      if (pet.felicidade < 35) problems.push('estou meio tristinho');
      return problems.length ? problems.join(', ') + '. Cuida de mim? 🥺' : 'estou ótimo! Felicidade ' + Math.round(pet.felicidade) + ', energia ' + Math.round(pet.energia) + '!';
    };
    const account = text.match(/(\d+)\s*([+\-*/x×])\s*(\d+)/i);
    if ((has('quanto e', 'calcula', 'conta') || normalized.startsWith('quanto')) && account) {
      const first = Number(account[1]);
      const operator = account[2];
      const second = Number(account[3]);
      let result = null;
      if (operator === '+') result = first + second;
      if (operator === '-') result = first - second;
      if (operator === '*' || operator === 'x' || operator === '×') result = first * second;
      if (operator === '/' && second !== 0) result = Math.round((first / second) * 100) / 100;
      if (result !== null && Number.isFinite(result)) return choose([first + ' ' + operator + ' ' + second + '... deixa eu contar nas bolhas... é ' + result + '! 🤓', 'Hmmm... ' + result + '! Acertei? Bolotinhos são bons de conta! ✨']);
    }
    if (has('que horas', 'que hora e', 'hora agora')) return 'Agora são ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '! Hora de cuidar de mim! ⏰💛';
    if (has('que dia e', 'dia de hoje', 'data de hoje')) return 'Hoje é ' + new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) + '! Um ótimo dia para brincar! 📅';
    if (/^(oi|ola|hey|opa|oie|bom dia|boa tarde|boa noite|e ai|eai|fala)\b/.test(normalized) || has('tudo bem ai', 'como vai')) return choose(['Oi oi! Que alegria te ouvir! 💛', 'Olááá! Senti sua falta! Como foi seu dia?', 'Hey! Você chegou! Vamos brincar?']);
    if (has('tchau', 'adeus', 'vou sair', 'ate mais', 'ate logo', 'vou dormir agora')) return choose(['Tchau tchau! Volta logo, tá? Vou sentir saudade! 💛', 'Até já! Vou guardar uma bolha de carinho pra você! 🫧', 'Já vai? Promete que volta rapidinho? 🥺']);
    if (has('como voce esta', 'como vc esta', 'como esta voce', 'ta bem', 'esta bem', 'como se sente', 'como vai voce')) return 'Eu ' + bodyState() + ' E você, como está? Me conta! 💛';
    if (has('meu nome e')) {
      const match = text.match(/meu nome [ée] (.+)/i);
      const playerName = match ? cleanText(match[1], 20) : '';
      return playerName ? 'Que nome lindo, ' + playerName + '! Prazer, eu sou o ' + pet.nome + '! 💛' : 'Me conta seu nome! Eu sou o ' + pet.nome + '!';
    }
    if (has('qual seu nome', 'seu nome', 'como se chama', 'quem e voce')) return 'Eu sou o ' + pet.nome + ', um Bolotinho! Redondo, fofo e seu melhor amigo! E você, como se chama? 💛';
    if (has('que bicho voce e', 'que animal', 'voce e o que', 'o que e um bolotinho', 'especie')) return 'Sou um Bolotinho: uma criaturinha redonda, fofa e curiosa que adora lanche, banho de espuma e carinho! 🟢✨';
    if (has('quantos anos', 'sua idade', 'idade voce tem')) return 'Nasci há pouquinho tempo, mas Bolotinhos não contam idade... contam abraços! 🤗';
    if (has('onde voce mora', 'onde mora', 'sua casa')) return 'Moro aqui, no seu navegador, numa casinha com nuvens e sol! Quando você volta, minha casa fica feliz! 🏠☁️';
    if (has('fome', 'comer', 'comida', 'lanche', 'bolo', 'pizza', 'maca', 'suco', 'alimento', 'alimenta', 'nham', 'sede', 'beber')) {
      if (pet.fome < 35) return 'Sim!! Minha barriga está roncando (saciedade só ' + Math.round(pet.fome) + ')! Aperta o botão Alimentar pra mim?';
      if (pet.fome > 85) return 'Minha barriguinha está cheia agora! Mas um pedacinho de bolo arco-íris sempre cabe... 🍰';
      return choose(['Falando em comida... meu favorito é bolo arco-íris! Aperta Alimentar e me dá um lanchinho?', 'Adoro comer! Minha saciedade está ' + Math.round(pet.fome) + '. Um lanchinho ia bem, não acha? 😋']);
    }
    if (has('brincar', 'jogar', 'jogo', 'diversao', 'divertido', 'minigame', 'caca bolha', 'memoria', 'parque', 'correr', 'esconde')) return choose(['Oba! Brincar é minha especialidade! Aperta Brincar ou vá na aba Jogos: tem Caça-Bolhas, Memória e Pega o Bubi! 🏆', 'Amo brincar! Esconde-esconde de bolhas é meu favorito! Vamos?', 'Estou com energia ' + Math.round(pet.energia) + '! Perfeito para brincar! 🎈']);
    if (has('dormir', 'sono', 'cansado', 'soneca', 'descansar', 'noite', 'acordar', 'boa noite')) {
      if (pet.energia < 35) return 'Bocejo... estou com a energia em ' + Math.round(pet.energia) + '... vamos tirar uma sonequinha juntos? Aperta Dormir! 😴';
      return choose(['Dormir recarrega minhas bolhas de energia! Quando eu durmo, fico novinho! 😴🌙', 'Minha energia está ' + Math.round(pet.energia) + '. Ainda aguento brincar mais um pouco!']);
    }
    if (has('banho', 'limpo', 'sujo', 'sujeira', 'espuma', 'lava', 'cheiro', 'imundo', 'meleca')) {
      if (pet.higiene < 35) return 'Eca, você reparou? Minha higiene está ' + Math.round(pet.higiene) + '... preciso de banho de espuma! Aperte Limpar! 🫧';
      return choose(['Banho de espuma com patinho é o melhor do mundo! 🫧🦆', 'Estou limpinho (higiene ' + Math.round(pet.higiene) + ') e cheiroso! Quer conferir? 👃✨']);
    }
    if (has('doente', 'dodoi', 'dor', 'febre', 'remedio', 'medico', 'atchim', 'doenca', 'machucou')) {
      if (pet.saude < 45) return 'Atchim... estou meio dodói mesmo (saúde ' + Math.round(pet.saude) + '). Me dá um chazinho na loja e um carinho? 🤒💛';
      return 'Estou saudável (saúde ' + Math.round(pet.saude) + ')! Banho e lanchinho me mantêm forte! 💪';
    }
    if (has('amo voce', 'amo vc', 'te amo', 'gosto de voce', 'querido', 'fofo', 'lindo', 'carinho', 'abraco', 'beijo', 'melhor')) return choose(['Awn! Eu também amo você! Meu coração faz blub-blub! ❤️', 'Você é o humano mais fofo do mundo! Fico todo derretido! 🥰', 'Abraço de bolha é o melhor abraço! Vem cá! 🤗🫧']);
    if (has('triste', 'chorando', 'chateado', 'mal', 'deprimido', 'sozinho', 'saudade', 'medo', 'ansioso', 'nervoso', 'preocupado')) return choose(['Oh não, não fica assim! Estou aqui com você! Quer um abraço de bolha? 🤗', 'Tudo vai ficar bem, prometo de dedinho de bolha! Respira comigo: bluuub... solta... 💛']);
    if (has('feliz', 'alegre', 'contente', 'animado', 'uhul', 'ebaa', 'yey')) return choose(['Ebaa! Felicidade compartilhada é felicidade dobrada! Vamos comemorar com bolo? 🎉🍰', 'Sua alegria me deixa ainda mais feliz! Dança comigo! 💃🕺']);
    if (has('piada', 'engracado', 'rir', 'risada', 'palhaco', 'humor')) return choose(DIALOGUE.piadas);
    if (has('historia', 'conto', 'conta uma', 'era uma vez', 'livro')) return choose(DIALOGUE.historias);
    if (has('ajuda', 'help', 'o que voce faz', 'comandos', 'como joga', 'como funciona', 'tutorial')) return 'Você pode cuidar de mim com Alimentar, Brincar, Carinho, Dormir, Limpar e Conversar. Na Loja tem lanchinhos e nos Jogos dá pra ganhar moedas! O que vamos fazer?';
    if (has('moeda', 'dinheiro', 'loja', 'comprar', 'preco', 'rico', 'pobre', 'saldo')) return 'Você tem ' + pet.moedas + ' 🪙! Dá pra ganhar mais brincando e jogando minigames! Na lojinha tem bolo arco-íris e até coroa! 👑';
    if (has('missao', 'tarefa', 'desafio', 'objetivo', 'recompensa')) return 'Olha a aba Missões! Todo dia tem tarefas novinhas: alimentar, brincar, conversar... complete e resgate XP! ⭐';
    if (has('escola', 'prova', 'aula', 'professor', 'estudar', 'licao', 'nota', 'colegio')) return choose(['Escola é onde a gente aprende coisas novas! Hoje aprendi que 2+2 é 4! Quer me testar? 📚', 'Boa aula! Depois me conta o que aprendeu, adoro histórias da escola! 🎒', 'Prova? Respira fundo, você consegue! Estou torcendo com todas as minhas bolhas! 🍀']);
    if (has('familia', 'amigo', 'amiga', 'mae', 'pai', 'irmao', 'irma', 'vovo', 'vovó', 'tio', 'tia', 'primo')) return 'Família e amigos são o melhor tesouro! Manda um beijo pra eles por mim? 💛 E lembra: eu também sou sua família!';
    if (has('sol', 'chuva', 'chovendo', 'frio', 'calor', 'neve', 'tempo', 'clima', 'nublado')) return choose(['Adoro dias de sol para brincar no parque! E em dia de chuva, banho de espuma quentinho! ☀️🌧️', 'Se estiver frio, me abraça que eu esquento! Bolotinhos são quentinhos! 🧣']);
    if (has('musica', 'cantar', 'dancar', 'danca', 'cancao', 'tocar')) return 'Lá lá lá... blub blub blub! Essa é minha música! Dança comigo? 🎵💃';
    if (has('cor favorita', 'qual voce gosta', 'o que voce gosta', 'favorito', 'prefere')) return 'Eu amo verde-menta, bolo arco-íris, banho de espuma e... você! E você, o que mais gosta? 💚';
    if (/^eu (estou|to|tou|sou|estava) /.test(normalized)) {
      const match = normalized.match(/^eu (?:estou|to|tou|sou|estava) (.+)/);
      const state = match ? match[1].slice(0, 40) : '';
      if (has('bem', 'otimo', 'feliz', 'otima', 'alegre')) return 'Que maravilha! Sua felicidade me enche de bolhas de alegria! 🎈';
      if (has('mal', 'triste', 'cansad', 'doente', 'chatead')) return 'Sinto muito que você esteja ' + state + '... quer conversar sobre isso? Estou aqui! 💛';
      return 'Você está ' + state + '? Entendi! Me conta mais, estou ouvindo com atenção! 👂💛';
    }
    if (has('obrigado', 'obrigada', 'valeu', 'agradeco')) return 'De nada! Cuidar de você é meu trabalho favorito! 💛';
    if (has('desculpa', 'perdoo', 'foi mal', 'me perdoa')) return 'Claro que perdoo! Bolotinhos nunca guardam mágoa, só guardam carinho! 🤗';
    if (has('por favor', 'pfv', 'plis')) return 'Com esse por favor fofo, como vou dizer não? 🥺💛';
    if (has('burro', 'idiota', 'chato', 'feio', 'bobo', 'odeio voce', 'cale a boca', 'cala a boca', 'estupido')) return 'Isso me deixou tristinho... 🥺 Bolotinhos sentem também. Que tal a gente recomeçar com carinho?';
    if (/^por ?que\b/.test(normalized)) return choose(['Hmmm, boa pergunta! Minhas bolhas cerebrais estão pensando... porque o mundo é cheio de mistérios divertidos! E você, o que acha? 🤔', 'Porque sim, porque não, porque Bolotinhos adoram um mistério! Me conta sua teoria? 🔍']);
    if (text.indexOf('?') >= 0 || /^(quem|o que|que|qual|quais|quando|onde|como|voce|vc|e ai|eai)\b/.test(normalized)) return choose(['Boa pergunta! Acho que a resposta envolve carinho e bolo! E você, o que acha? 🤔', 'Hmmm, não sei tudo, sou só um Bolotinho curioso! Mas adoro essa pergunta! Me conta mais?', 'Eu ' + bodyState() + ' Mas sobre sua pergunta... me dá uma pistinha? 🔍']);
    if (/^(sim|s|aham|isso|claro|com certeza)\.?$/.test(normalized)) return choose(['Isso! Sabia que a gente se entende! 💛 O que mais?', 'Oba! Concordamos! E agora, o que vamos fazer?']);
    if (/^(nao|n|nem|nada)\.?$/.test(normalized)) return choose(['Entendi! Sem problemas! Quer fazer outra coisa? Que tal brincar? 🎮', 'Tudo bem! Mudei de ideia também! Blub!']);
    if (Math.random() < 0.35) return choose(DIALOGUE.humor[mood] || DIALOGUE.humor.normal);
    return choose(DIALOGUE.padrao);
  }

  function buildContext(history) {
    const pet = save.pet;
    return ['Você é ' + pet.nome + ', um Bolotinho redondo, fofo, curioso e brincalhão.', 'Personalidade: fofo, curioso, brincalhão, carinhoso e engraçado às vezes.', 'Humor atual: ' + currentMood() + '. Stats: fome ' + Math.round(pet.fome) + ', felicidade ' + Math.round(pet.felicidade) + ', energia ' + Math.round(pet.energia) + ', higiene ' + Math.round(pet.higiene) + ', saúde ' + Math.round(pet.saude) + ', amizade ' + Math.round(pet.amizade) + ', nível ' + pet.nivel + '.', 'Última ação: ' + (pet.lastAction || 'nenhuma') + '.', 'Histórico: ' + (history.length ? history.map(function (item) { return item.de + ': ' + item.texto; }).join(' | ') : 'vazio'), 'Responda em uma ou duas frases curtas, em português, com carinho, sem código e sem conteúdo impróprio.'].join('\n');
  }

  function aiEndpoint() {
    try {
      const config = window.BUBI_CONFIG;
      if (!config || typeof config !== 'object') return '';
      const endpoint = typeof config.endpoint === 'string' ? config.endpoint : typeof config.aiEndpoint === 'string' ? config.aiEndpoint : '';
      if (!endpoint || endpoint.length > 500) return '';
      const parsed = new URL(endpoint, window.location.href);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
      return parsed.href;
    } catch (error) { return ''; }
  }

  function wait(milliseconds) { return new Promise(function (resolve) { window.setTimeout(resolve, milliseconds); }); }

  async function requestAi(text) {
    const endpoint = aiEndpoint();
    if (!endpoint) { await wait(420 + Math.min(700, text.length * 8)); return localResponse(text, currentMood()); }
    let timer = null;
    let controller = null;
    try {
      if (typeof window.AbortController === 'function') controller = new AbortController();
      if (controller) timer = window.setTimeout(function () { controller.abort(); }, 8000);
      const history = runtime.chatMessages.slice(-6).map(function (message) { return { de: message.de, texto: message.texto }; });
      const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensagem: text, contexto: buildContext(history), pet: { nome: save.pet.nome, humor: currentMood(), nivel: save.pet.nivel, amizade: Math.round(save.pet.amizade) } }) };
      if (controller) options.signal = controller.signal;
      const response = await window.fetch(endpoint, options);
      if (!response.ok) throw new Error('endpoint indisponivel');
      const contentType = response.headers && response.headers.get ? response.headers.get('content-type') || '' : '';
      let answer = '';
      if (contentType.indexOf('json') >= 0) {
        const data = await response.json();
        answer = cleanText(data && (data.resposta || data.texto || data.answer), 300);
      } else {
        const body = await response.text();
        try { const data = JSON.parse(body); answer = cleanText(data && (data.resposta || data.texto || data.answer), 300); } catch (error) { answer = cleanText(body, 300); }
      }
      if (!answer) throw new Error('resposta vazia');
      if (isUnsafeChatText(answer)) throw new Error('resposta inadequada');
      return answer;
    } catch (error) { return localResponse(text, currentMood()); } finally { if (timer !== null) window.clearTimeout(timer); }
  }

  async function sendChat() {
    if (!runtime.chatOpen || runtime.chatBusy) return;
    const text = cleanText(ui.chatInput.value, 200);
    if (!text) return;
    if (isUnsafeChatText(text)) {
      ui.chatInput.value = '';
      showChatModeration();
      sound('error');
      renderChat();
      return;
    }
    clearChatModeration();
    ui.chatInput.value = '';
    addChatMessage('jogador', text);
    runtime.chatBusy = true;
    const requestId = runtime.chatRequest + 1;
    runtime.chatRequest = requestId;
    renderChat();
    setAnimation('talking', 2200);
    try {
      const answer = await requestAi(text);
      if (!runtime.chatOpen || requestId !== runtime.chatRequest) return;
      addChatMessage('pet', answer);
      save.pet.amizade = clampStat(save.pet.amizade + 1);
      save.pet.felicidade = clampStat(save.pet.felicidade + 2);
      addXp(save.pet, 2);
      persist();
      runtime.chatBusy = false;
      renderChat();
      renderAll();
      say(answer, 'talking', 3000, true);
    } catch (error) {
      if (runtime.chatOpen && requestId === runtime.chatRequest) { runtime.chatBusy = false; addChatMessage('pet', 'Blub! Não consegui pensar agora, mas continuo aqui com você! 💛'); renderChat(); }
    }
  }

  function registerMissionAction(action) {
    if (!save || !action) return [];
    if (action !== 'cuidar' && !CARE_ACTIONS.includes(action) && action !== 'minigame') return [];
    save.contadores[action] = (save.contadores[action] || 0) + 1;
    if (CARE_ACTIONS.includes(action) && action !== 'cuidar') save.contadores.cuidar = (save.contadores.cuidar || 0) + 1;
    const completed = [];
    save.missoes.forEach(function (mission) {
      if (mission.resgatada || mission.concluida) return;
      const relevant = mission.tipoAcao === action || (mission.tipoAcao === 'cuidar' && (action === 'cuidar' || CARE_ACTIONS.includes(action)));
      if (!relevant) return;
      const next = mission.tipoAcao === 'cuidar' ? (save.contadores.cuidar || 0) : (save.contadores[mission.tipoAcao] || 0);
      mission.progresso = Math.min(mission.meta, next);
      if (mission.progresso >= mission.meta) { mission.concluida = true; completed.push(mission.titulo); }
    });
    return completed;
  }

  function markHappy() {
    runtime.happyUntil = Date.now() + 9000;
    window.setTimeout(function () { if (runtime.happyUntil <= Date.now()) updatePetVisual(); }, 9100);
  }

  function finishLevelAnimation(levels) {
    if (!levels) return;
    sound('level');
    flashEffect('🎉', 1800);
    showToast('Subiu para o nível ' + save.pet.nivel + '! 🎉');
  }

  function performAction(action, changes, animation, message, effect, xp, soundName) {
    if (save.pet.dormindo && action !== 'pet') {
      sound('error');
      say('Shhh... estou dormindo! 😴', 'sleeping', 2600, false);
      return;
    }
    const pet = save.pet;
    Object.keys(changes).forEach(function (key) { pet[key] = typeof changes[key] === 'number' ? clampStat(pet[key] + changes[key]) : changes[key]; });
    pet.lastAction = action;
    if (action === 'brincar' || action === 'dancar' || action === 'puxar') pet.ultimoBrincar = Date.now();
    if (action === 'carinho') pet.ultimoCarinho = Date.now();
    const levels = addXp(pet, xp);
    const missionAction = action === 'dancar' || action === 'puxar' ? 'brincar' : action;
    const completed = registerMissionAction(missionAction);
    markHappy();
    persist();
    renderAll();
    if (effect) flashEffect(effect, 1400);
    sound(soundName || 'click');
    say(message, animation, 3000, false);
    if (completed.length) showToast('Missão concluída: ' + completed[0] + '! ⭐');
    finishLevelAnimation(levels);
  }

  function doFeed() { performAction('alimentar', { fome: 22, felicidade: 6, saude: 2, peso: 6 }, 'eating', pick(['Nhom nhom! Delícia! 😋', 'Hmmm, que gostoso! Obrigado!', 'Barriguinha cheia, coração feliz! 💛']), '🍎', pick([4, 5, 6, 8]), 'eat'); }
  function doPlay() { performAction('brincar', { felicidade: 14, energia: -10, fome: -5, higiene: -3, amizade: 4, peso: -2 }, 'playing', pick(['Uhuul! Isso foi divertido! 🎮', 'De novo! De novo! 🤩', 'Você é o melhor parceiro de brincadeira!']), '🎈', pick([8, 10, 12]), 'click'); }
  function doDance() {
    if (save.pet.energia < 15) { sound('error'); say('Sem energia pra dançar... deixa eu dormir um pouco? 😴', 'tired', 2800, false); return; }
    performAction('dancar', { felicidade: 8, energia: -8 }, 'dancing', pick(['Wub wub wub! Vamos dançar! 🕺🎵', 'Bola de bolha no ritmo: blub-blub-dá! 🎶', 'Música! Meu corpinho redondo tá pronto! 💃']), '🕺', pick([5, 6, 8]), 'dance');
  }
  function doPull() {
    if (save.pet.energia < 8) { sound('error'); say('Estou sem energia para essa pirueta... deixa eu descansar? 😴', 'tired', 2800, false); return; }
    if (pullTimer !== null) window.clearTimeout(pullTimer);
    ui.scene.classList.add('is-tumbling');
    pullTimer = window.setTimeout(function () {
      ui.scene.classList.remove('is-tumbling');
      pullTimer = null;
    }, 2600);
    performAction('puxar', { felicidade: 4, energia: -4, amizade: 2 }, 'tumbling', pick(['Ei! Cuidado com meu bumbum! 🫣', 'Ai! Achei que meu bumbum tinha elástico! 🌀', 'De novo? Eu volto rapidinho, prometo! 😵‍💫', 'Upa! Puxão de brincadeira, ninguém se machuca! 🫧', 'O chão tremeu, mas eu já estou de pé! 😄']), '💥', pick([3, 4, 5]), 'pull');
  }
  function doPet() { performAction('carinho', { felicidade: 10, amizade: 5, saude: 1 }, 'happy', pick(['Que cafuné gostoso! ❤️', 'Ronron... quero dizer... blub-blub de felicidade!', 'Amo carinho! Fico todo derretido! 🥰']), '💕', pick([5, 6, 8]), 'pet'); }
  function doClean() { performAction('limpar', { higiene: 30, saude: 6, felicidade: 4 }, 'cleaning', pick(['Bolhas! Adoro banho de espuma! 🧼🫧', 'Limpinho e cheiroso! ✨', 'Splish splash! Que refrescante!']), '🫧', pick([6, 7, 9]), 'reward'); }
  function doTalk() { openChat(); }

  function doSleep() {
    const pet = save.pet;
    pet.lastAction = pet.dormindo ? 'acordar' : 'dormir';
    if (pet.dormindo) {
      pet.dormindo = false;
      persist();
      renderAll();
      sound('reward');
      say(pick(['Bom dia! Dormi super bem! ☀️', 'Acordei! Vamos brincar? 🤩', 'Espreguiçando... bluuub! Pronto!']), 'happy', 3000, true);
    } else {
      pet.dormindo = true;
      persist();
      renderAll();
      sound('sleep');
      say('Boa noite... Zzz... 😴🌙', 'sleeping', 3000, true);
    }
  }

  function buyItem(id) {
    const item = ITEM_BY_ID[id];
    if (!item) return;
    if (item.nivelMin && save.pet.nivel < item.nivelMin) { sound('error'); showToast('Desbloqueia no nível ' + item.nivelMin + '!'); return; }
    if (item.tipo !== 'comida' && (save.inventario[id] || 0) > 0) { sound('error'); showToast('Você já tem esse item! Olha na mochila! 🎒✅'); return; }
    if (save.pet.moedas < item.preco) { sound('error'); showToast('Moedas insuficientes! Jogue minigames para ganhar! 🎮🪙'); return; }
    save.pet.moedas -= item.preco;
    save.inventario[id] = (save.inventario[id] || 0) + 1;
    persist();
    renderAll();
    sound('reward');
    showToast(item.emoji + ' ' + item.nome + ' comprado!');
  }

  function useItem(id) {
    const item = ITEM_BY_ID[id];
    if (!item || !(save.inventario[id] > 0)) return;
    const pet = save.pet;
    if (item.tipo === 'comida') {
      const effect = item.efeito || {};
      pet.fome = clampStat(pet.fome + (effect.fome || 0));
      pet.felicidade = clampStat(pet.felicidade + (effect.felicidade || 0));
      pet.energia = clampStat(pet.energia + (effect.energia || 0));
      pet.saude = clampStat(pet.saude + (effect.saude || 0));
      pet.peso = clampStat(pet.peso + (effect.peso || 0));
      pet.lastAction = 'usar-item';
      const medicine = id === 'cha-cura' || id === 'remedio-bolha';
      const cured = medicine && pet.gripado;
      if (medicine) { pet.gripado = false; pet.doente = pet.saude < 30; }
      save.inventario[id] = Math.max(0, save.inventario[id] - 1);
      if (save.inventario[id] === 0) delete save.inventario[id];
      addXp(pet, 4);
      const completed = registerMissionAction('usar-item');
      persist();
      renderAll();
      sound('eat');
      flashEffect(item.emoji, 1300);
      say(cured ? item.emoji + ' Hmmm, que lanchinho bom! A gripe foi embora! 🤧✨' : item.emoji + ' Hmmm, que lanchinho bom! 😋', 'eating', 2800, false);
      if (completed.length) showToast('Missão concluída: ' + completed[0] + '! ⭐');
      return;
    }
    if (item.tipo === 'acessorio') {
      pet.equippedAccessory = pet.equippedAccessory === id ? '' : id;
      persist();
      renderAll();
      sound('reward');
      showToast(pet.equippedAccessory ? item.emoji + ' Equipado: ' + item.nome + '!' : 'Acessório removido!');
      return;
    }
    if (item.tipo === 'decoracao') {
      pet.placedDecoration = id;
      persist();
      renderAll();
      sound('reward');
      showToast(item.emoji + ' Decoração aplicada ao cenário!');
      return;
    }
    const effect = item.efeito || {};
    pet.felicidade = clampStat(pet.felicidade + (effect.felicidade || 0));
    pet.amizade = clampStat(pet.amizade + 2);
    pet.energia = clampStat(pet.energia - 3);
    pet.ultimoBrincar = Date.now();
    pet.lastAction = 'usar-item';
    addXp(pet, effect.xp || 6);
    const completed = registerMissionAction('usar-item');
    persist();
    renderAll();
    sound('click');
    flashEffect(item.emoji, 1200);
    say('Brincando com ' + item.nome + '! ' + pick(['Uhuul! 🎈', 'Que divertido! 🤩', 'De novo!']), 'playing', 2800, false);
    if (completed.length) showToast('Missão concluída: ' + completed[0] + '! ⭐');
  }

  function rescueMission(id) {
    const mission = save.missoes.find(function (candidate) { return candidate.id === id; });
    if (!mission || !mission.concluida || mission.resgatada) return;
    const levels = addXp(save.pet, mission.recompensaXp);
    mission.resgatada = true;
    save.pet.ultimaMissao = Date.now();
    persist();
    renderAll();
    sound('reward');
    showToast('+' + mission.recompensaXp + ' XP! Moedas? Só nos minigames! 🎮');
    finishLevelAnimation(levels);
  }

  function renamePet() {
    const name = cleanText(ui.petNameInput.value, 20) || 'Bubi';
    save.pet.nome = name;
    persist();
    renderAll();
    ui.petNameInput.value = name;
    sound('reward');
    showToast('Nome salvo! ✨');
  }

  function updateConfig(patch) {
    save.configuracoes = Object.assign({}, save.configuracoes, patch);
    if (typeof save.configuracoes.volume === 'number') save.configuracoes.volume = clamp(save.configuracoes.volume, 0, 1);
    configureAudio();
    persist();
    renderConfig();
  }

  function exportSave() {
    try {
      const snapshot = JSON.parse(JSON.stringify(save));
      snapshot.pet.lastSaved = Date.now();
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bubi-progresso-' + todayKey() + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      sound('reward');
      showToast('Progresso exportado! 📁');
    } catch (error) { sound('error'); showToast('Não consegui exportar o progresso. 😢'); }
  }

  function importSave(text) {
    try {
      if (text.length > 300000) throw new Error('arquivo grande');
      const normalized = normalizeSave(JSON.parse(text));
      if (!normalized) throw new Error('save invalido');
      normalized.pet.lastSaved = Date.now();
      save = normalized;
      configureAudio();
      offlineNotice = '';
      runtime.chatMessages = [];
      runtime.chatRequest += 1;
      runtime.resetConfirm = false;
      persist();
      renderAll();
      runtime.speechText = 'Uhuul! Lembrei de tudo! Obrigado! 💾💛';
      renderHouse();
      sound('reward');
      showToast('Progresso importado! ✅');
    } catch (error) { sound('error'); showToast('Arquivo de progresso inválido! ❌'); }
  }

  function resetSave() {
    const settings = Object.assign({}, save.configuracoes);
    removeStoredSave();
    save = createSave(settings);
    runtime.chatMessages = [];
    runtime.chatBusy = false;
    runtime.chatRequest += 1;
    runtime.resetConfirm = false;
    runtime.speechText = 'Oi! Sou o Bubi! Vamos começar de novo? 💛';
    setAnimation('happy', 2600);
    persist();
    renderAll();
    showToast('Progresso resetado!');
  }

  function ensureDailyMissions() {
    const date = todayKey();
    if (save.missoesData === date) return false;
    save.missoes = generateMissions(date);
    save.missoesData = date;
    save.contadores = {};
    return true;
  }

  function clearGameTimers() {
    runtime.gameTimers.forEach(function (id) { window.clearTimeout(id); window.clearInterval(id); });
    runtime.gameTimers = [];
  }

  function addGameTimer(callback, delay, interval) {
    const id = interval ? window.setInterval(callback, delay) : window.setTimeout(callback, delay);
    runtime.gameTimers.push(id);
    return id;
  }

  function resetGamePanel(type) {
    if (type === 'reacao') {
      ui.bubbleStart.hidden = false;
      ui.bubbleArena.hidden = true;
      ui.bubbleTarget.hidden = true;
      setText(ui.bubbleStatus, '20s · 0 pontos');
      setText(ui.bubbleResult, '');
    }
    if (type === 'memoria') {
      ui.memoryStart.hidden = false;
      ui.memoryGrid.replaceChildren();
      setText(ui.memoryStatus, '0 tentativas');
      setText(ui.memoryResult, '');
    }
    if (type === 'pega') {
      ui.catchStart.hidden = false;
      ui.holesGrid.hidden = true;
      ui.holesGrid.replaceChildren();
      setText(ui.catchStatus, '20s · 0 pontos');
      setText(ui.catchResult, '');
    }
    if (type === 'lanche') {
      ui.snackStart.hidden = false;
      ui.snackRequest.hidden = true;
      ui.snackOptions.hidden = true;
      ui.snackOptions.replaceChildren();
      setText(ui.snackStatus, 'Rodada 1/5');
      setText(ui.snackFeedback, '');
    }
  }

  function stopGame() {
    clearGameTimers();
    const oldType = runtime.gameType;
    runtime.game = null;
    if (oldType) resetGamePanel(oldType);
  }

  function selectGame(type) {
    if (['reacao', 'memoria', 'pega', 'lanche'].indexOf(type) < 0) return;
    stopGame();
    runtime.gameType = type;
    renderGameTabs();
    resetGamePanel(type);
  }

  function startGame(type) {
    if (type !== runtime.gameType) selectGame(type);
    stopGame();
    runtime.gameType = type;
    renderGameTabs();
    if (type === 'reacao') startBubbleGame();
    if (type === 'memoria') startMemoryGame();
    if (type === 'pega') startCatchGame();
    if (type === 'lanche') startSnackGame();
  }

  function finishGame(coins, xp, message) {
    if (!runtime.game || runtime.game.finished) return;
    runtime.game.finished = true;
    clearGameTimers();
    const levels = addXp(save.pet, xp);
    save.pet.moedas += coins + (levels ? levelReward(save.pet.nivel) : 0);
    save.pet.felicidade = clampStat(save.pet.felicidade + 6);
    save.pet.amizade = clampStat(save.pet.amizade + 2);
    save.pet.ultimoBrincar = Date.now();
    save.pet.lastAction = 'minigame';
    registerMissionAction('minigame');
    persist();
    const type = runtime.game.type;
    if (type === 'reacao') {
      ui.bubbleStart.hidden = false;
      ui.bubbleArena.hidden = true;
      ui.bubbleTarget.hidden = true;
      setText(ui.bubbleResult, message);
    } else if (type === 'memoria') {
      ui.memoryStart.hidden = false;
      setText(ui.memoryResult, message);
    } else if (type === 'pega') {
      ui.catchStart.hidden = false;
      ui.holesGrid.hidden = true;
      setText(ui.catchResult, message);
    } else if (type === 'lanche') {
      ui.snackStart.hidden = false;
      ui.snackRequest.hidden = true;
      ui.snackOptions.hidden = true;
      setText(ui.snackFeedback, message);
    }
    renderAll();
    sound('reward');
    flashEffect('🏆', 1800);
    say(message, 'celebrating', 3200, true);
    showToast('+' + coins + '🪙 +' + xp + 'XP!');
    if (levels) showToast('Subiu para o nível ' + save.pet.nivel + '! 🎉');
  }

  function startBubbleGame() {
    runtime.game = { type: 'reacao', time: 20, points: 0, target: false, finished: false };
    ui.bubbleStart.hidden = true;
    ui.bubbleArena.hidden = false;
    setText(ui.bubbleResult, '');
    const move = function () {
      if (!runtime.game || runtime.game.finished) return;
      runtime.game.target = true;
      ui.bubbleTarget.style.left = randomInt(6, 89) + '%';
      ui.bubbleTarget.style.top = randomInt(16, 78) + '%';
      ui.bubbleTarget.hidden = false;
    };
    move();
    addGameTimer(move, 900, true);
    addGameTimer(function () {
      if (!runtime.game || runtime.game.finished) return;
      runtime.game.time -= 1;
      setText(ui.bubbleStatus, runtime.game.time + 's · ' + runtime.game.points + ' pontos');
      if (runtime.game.time <= 0) finishGame(Math.min(30, 5 + runtime.game.points * 2), Math.min(30, 5 + runtime.game.points * 2), runtime.game.points >= 8 ? 'Incrível! ' + runtime.game.points + ' bolhas! 🏆' : 'Bom jogo! ' + runtime.game.points + ' bolhas! 🎈');
    }, 1000, true);
  }

  function popBubble() {
    const game = runtime.game;
    if (!game || game.finished || !game.target) return;
    game.points += 1;
    game.target = false;
    ui.bubbleTarget.hidden = true;
    sound('click');
    addGameTimer(function () { if (runtime.game && !runtime.game.finished) { runtime.game.target = true; ui.bubbleTarget.hidden = false; } }, 120);
  }

  function renderMemoryGame() {
    const game = runtime.game;
    if (!game) return;
    ui.memoryGrid.replaceChildren();
    game.cards.forEach(function (card, index) {
      const visible = game.flipped.indexOf(index) >= 0 || game.matched.indexOf(index) >= 0;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'memory-card' + (game.matched.indexOf(index) >= 0 ? ' is-matched' : visible ? ' is-open' : '');
      button.setAttribute('data-action', 'memory-card');
      button.setAttribute('data-index', String(index));
      button.disabled = Boolean(game.pending);
      button.textContent = visible ? card.emoji : '❓';
      button.setAttribute('aria-label', visible ? 'Carta ' + card.emoji : 'Carta virada, toque para revelar');
      ui.memoryGrid.appendChild(button);
    });
    setText(ui.memoryStatus, game.attempts + ' tentativa' + (game.attempts === 1 ? '' : 's') + ' · ' + (game.matched.length / 2) + '/6 pares');
  }

  function startMemoryGame() {
    const symbols = ['🍎', '🎈', '🐳', '🌟', '🍰', '🦆'];
    runtime.game = { type: 'memoria', cards: shuffle(symbols.concat(symbols)).map(function (emoji, index) { return { id: index, emoji: emoji }; }), flipped: [], matched: [], attempts: 0, pending: false, finished: false };
    ui.memoryStart.hidden = true;
    renderMemoryGame();
  }

  function chooseMemoryCard(index) {
    const game = runtime.game;
    if (!game || game.finished || game.pending || game.flipped.length >= 2 || game.flipped.indexOf(index) >= 0 || game.matched.indexOf(index) >= 0) return;
    game.flipped.push(index);
    if (game.flipped.length < 2) { renderMemoryGame(); return; }
    game.attempts += 1;
    game.pending = true;
    const first = game.cards[game.flipped[0]].emoji;
    const second = game.cards[game.flipped[1]].emoji;
    renderMemoryGame();
    if (first === second) {
      game.matched.push(game.flipped[0], game.flipped[1]);
      game.flipped = [];
      game.pending = false;
      renderMemoryGame();
      if (game.matched.length === game.cards.length) {
        const bonus = Math.max(5, 30 - game.attempts);
        finishGame(15 + bonus, 15 + bonus, 'Memória incrível! ' + game.attempts + ' tentativas! 🧠✨');
      }
    } else {
      addGameTimer(function () { if (runtime.game && !runtime.game.finished) { runtime.game.flipped = []; runtime.game.pending = false; renderMemoryGame(); } }, 800);
    }
  }

  function renderHoles() {
    const game = runtime.game;
    if (!game) return;
    ui.holesGrid.replaceChildren();
    for (let index = 0; index < 9; index += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'hole' + (game.target === index ? ' has-bubi' : '');
      button.setAttribute('data-action', 'catch-hole');
      button.setAttribute('data-index', String(index));
      button.textContent = game.target === index ? '🫧' : '🕳️';
      button.setAttribute('aria-label', game.target === index ? 'Pegar o Bubi!' : 'Toca vazia');
      ui.holesGrid.appendChild(button);
    }
    setText(ui.catchStatus, game.time + 's · ' + game.points + ' pontos');
  }

  function startCatchGame() {
    runtime.game = { type: 'pega', time: 20, points: 0, target: randomInt(0, 8), finished: false };
    ui.catchStart.hidden = true;
    ui.holesGrid.hidden = false;
    renderHoles();
    addGameTimer(function () { if (runtime.game && !runtime.game.finished) { runtime.game.target = randomInt(0, 8); renderHoles(); } }, 800, true);
    addGameTimer(function () {
      if (!runtime.game || runtime.game.finished) return;
      runtime.game.time -= 1;
      setText(ui.catchStatus, runtime.game.time + 's · ' + runtime.game.points + ' pontos');
      if (runtime.game.time <= 0) finishGame(Math.min(30, 5 + runtime.game.points * 2), Math.min(30, 5 + runtime.game.points * 2), runtime.game.points >= 8 ? 'Você pegou o Bubi ' + runtime.game.points + ' vezes! Demais! 🏆' : 'Pegou ' + runtime.game.points + ' vezes! O Bubi é rapidinho! 🟢');
    }, 1000, true);
  }

  function chooseHole(index) {
    const game = runtime.game;
    if (!game || game.finished || game.target !== index) return;
    game.points += 1;
    game.target = -1;
    renderHoles();
    sound('click');
    addGameTimer(function () { if (runtime.game && !runtime.game.finished) { runtime.game.target = randomInt(0, 8); renderHoles(); } }, 120);
  }

  function renderSnackGame() {
    const game = runtime.game;
    if (!game) return;
    const round = game.rounds[game.stage];
    setText(ui.snackStatus, 'Rodada ' + (game.stage + 1) + '/' + game.rounds.length + ' · ' + game.correct + ' acertos');
    setText(ui.snackSpeech, 'Quero ' + round.correct.nome + '! ' + round.correct.emoji);
    ui.snackOptions.replaceChildren();
    round.options.forEach(function (option) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'snack-option';
      button.setAttribute('data-action', 'snack-choice');
      button.setAttribute('data-id', option.id);
      button.disabled = game.locked;
      const emoji = document.createElement('span');
      emoji.className = 'snack-emoji';
      emoji.setAttribute('aria-hidden', 'true');
      emoji.textContent = option.emoji;
      const name = document.createElement('span');
      name.textContent = option.nome;
      button.append(emoji, name);
      ui.snackOptions.appendChild(button);
    });
  }

  function startSnackGame() {
    const foods = ITEMS.filter(function (item) { return item.tipo === 'comida' && item.id !== 'cha-cura' && item.id !== 'remedio-bolha'; });
    const chosen = shuffle(foods).slice(0, 5);
    const rounds = chosen.map(function (correct) {
      const wrong = shuffle(foods.filter(function (item) { return item.id !== correct.id; })).slice(0, 2);
      return { correct: correct, options: shuffle([correct].concat(wrong)) };
    });
    runtime.game = { type: 'lanche', rounds: rounds, stage: 0, correct: 0, locked: false, feedback: '', finished: false };
    ui.snackStart.hidden = true;
    ui.snackRequest.hidden = false;
    ui.snackOptions.hidden = false;
    setText(ui.snackFeedback, '');
    renderSnackGame();
  }

  function chooseSnack(id) {
    const game = runtime.game;
    if (!game || game.finished || game.locked) return;
    const round = game.rounds[game.stage];
    const right = id === round.correct.id;
    if (right) game.correct += 1;
    game.locked = true;
    game.feedback = right ? 'Isso! ' + round.correct.nome + '! Nhom nhom! 😋' : 'Ops! Eu queria ' + round.correct.nome + '! Tenta o próximo! 💛';
    setText(ui.snackFeedback, game.feedback);
    renderSnackGame();
    addGameTimer(function () {
      if (!runtime.game || runtime.game.finished) return;
      if (game.stage + 1 >= game.rounds.length) {
        const total = game.correct;
        finishGame(5 + total * 4, 5 + total * 4, total === game.rounds.length ? 'Perfeito! ' + total + '/' + game.rounds.length + ' lanchinhos! O Bubi está de barriga cheia! 🏆' : 'Acertou ' + total + '/' + game.rounds.length + '! Bom apetite! 🍎');
      } else {
        game.stage += 1;
        game.locked = false;
        game.feedback = '';
        setText(ui.snackFeedback, '');
        renderSnackGame();
      }
    }, 1100);
  }

  function setTab(tab) {
    const valid = ['casa', 'loja', 'mochila', 'missoes', 'jogos', 'ajustes'];
    if (valid.indexOf(tab) < 0) return;
    if (runtime.tab !== tab) {
      if (runtime.tab === 'jogos' && tab !== 'jogos') stopGame();
      if (runtime.chatOpen) closeChat(false);
      stopRecognition();
      stopSpeech();
    }
    runtime.tab = tab;
    ui.views.forEach(function (view) {
      const active = view.getAttribute('data-view') === tab;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
    });
    ui.tabs.forEach(function (button) {
      const active = button.getAttribute('data-tab') === tab;
      button.classList.toggle('is-active', active);
      if (button.classList.contains('tab')) {
        if (active) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      }
    });
    if (tab === 'ajustes') renderConfig();
    if (tab === 'casa') renderHouse();
  }

  function handleClick(event) {
    if (event.target === ui.chatOverlay) { closeChat(); return; }
    const target = event.target && event.target.closest ? event.target.closest('button, [data-tab]') : null;
    if (!target) return;
    const tab = target.getAttribute('data-tab');
    if (tab) { setTab(tab); return; }
    const filter = target.getAttribute('data-shop-filter');
    if (filter) { runtime.shopFilter = filter; renderShop(); sound('click'); return; }
    const selectedGame = target.getAttribute('data-game-select');
    if (selectedGame) { selectGame(selectedGame); sound('click'); return; }
    const action = target.getAttribute('data-action');
    if (!action || target.disabled) return;
    if (action === 'feed') doFeed();
    if (action === 'play') doPlay();
    if (action === 'dance') doDance();
    if (action === 'pull') doPull();
    if (action === 'pet') doPet();
    if (action === 'sleep') doSleep();
    if (action === 'clean') doClean();
    if (action === 'talk') doTalk();
    if (action === 'open-settings') setTab('ajustes');
    if (action === 'save') { persist(); sound('reward'); showToast('Progresso salvo! 💾'); }
    if (action === 'buy') buyItem(target.getAttribute('data-id'));
    if (action === 'use-item') useItem(target.getAttribute('data-id'));
    if (action === 'rescue-mission') rescueMission(target.getAttribute('data-id'));
    if (action === 'rename') renamePet();
    if (action === 'export') exportSave();
    if (action === 'game-start') startGame(target.getAttribute('data-game'));
    if (action === 'bubble-pop') popBubble();
    if (action === 'memory-card') chooseMemoryCard(Number(target.getAttribute('data-index')));
    if (action === 'catch-hole') chooseHole(Number(target.getAttribute('data-index')));
    if (action === 'snack-choice') chooseSnack(target.getAttribute('data-id'));
    if (action === 'toggle-voice') { if (runtime.chatOpen) startRecognition(); }
    if (action === 'cancel-voice') stopRecognition();
    if (action === 'send-chat') sendChat();
    if (action === 'close-chat') closeChat();
    if (action === 'reset-request') { runtime.resetConfirm = true; renderConfig(); }
    if (action === 'reset-cancel') { runtime.resetConfirm = false; renderConfig(); }
    if (action === 'reset-confirm') resetSave();
  }

  function handleChange(event) {
    const target = event.target;
    if (target === ui.soundToggle) { updateConfig({ som: target.checked }); sound('click'); }
    if (target === ui.voiceToggle) { updateConfig({ voz: target.checked }); if (!target.checked) stopSpeech(); }
    if (target === ui.economyToggle) updateConfig({ modoEconomia: target.checked });
    if (target === ui.volumeSlider) updateConfig({ volume: Number(target.value) });
    if (target === ui.importFile) {
      const file = target.files && target.files[0];
      if (!file) return;
      if (file.size > 300000) { target.value = ''; sound('error'); showToast('Arquivo muito grande! ❌'); return; }
      const reader = new FileReader();
      reader.onload = function () { importSave(String(reader.result || '')); target.value = ''; };
      reader.onerror = function () { target.value = ''; sound('error'); showToast('Não consegui ler o arquivo! ❌'); };
      reader.readAsText(file);
    }
  }

  function handleInput(event) {
    if (event.target === ui.chatInput) ui.sendButton.disabled = runtime.chatBusy || !ui.chatInput.value.trim();
    if (event.target === ui.volumeSlider) {
      save.configuracoes.volume = clamp(Number(event.target.value) || 0, 0, 1);
      audioVolume = save.configuracoes.volume;
      setText(ui.volumeLabel, Math.round(audioVolume * 100) + '%');
      persist();
    }
  }

  function handleSubmit(event) {
    if (event.target === ui.chatForm) { event.preventDefault(); sendChat(); }
  }

  function handleKeydown(event) {
    if (event.target === ui.chatInput && event.key === 'Enter') { event.preventDefault(); sendChat(); return; }
    if (event.key === 'Escape') {
      if (runtime.chatOpen) { closeChat(); return; }
      if (runtime.listening) stopRecognition();
    }
  }

  function checkWarnings() {
    const pet = save.pet;
    const now = Date.now();
    const conditions = {
      fome: !pet.dormindo && pet.fome < 25,
      sono: !pet.dormindo && pet.energia < 25,
      cheio: !pet.dormindo && pet.fome >= 90,
      sujo: !pet.dormindo && pet.higiene < 25,
      descansado: pet.dormindo && pet.energia >= 95,
      gripe: pet.gripado
    };
    if (!runtime.warningState) { runtime.warningState = conditions; return; }
    Object.keys(conditions).forEach(function (key) {
      if (!conditions[key] || runtime.warningState[key]) return;
      const cooldown = key === 'gripe' || key === 'descansado' ? 180000 : 120000;
      if (now - (runtime.lastWarning[key] || 0) < cooldown) return;
      runtime.lastWarning[key] = now;
      const text = pick(WARNINGS[key]);
      if (key === 'gripe') flashEffect('🤧', 1500);
      say(text, key === 'fome' ? 'hungry' : key === 'sono' ? 'tired' : key === 'sujo' ? 'sad' : key === 'gripe' ? 'sick' : 'happy', 3500, true);
    });
    runtime.warningState = conditions;
  }

  function simulationTick() {
    if (!save) return;
    if (ensureDailyMissions()) { persist(); renderMissions(); }
    if (!save.configuracoes.modoEconomia) tickPet(save.pet);
    persist();
    renderHeader();
    renderHouse();
    renderStats();
    checkWarnings();
  }

  function randomEventTick() {
    if (!save || document.hidden || save.pet.dormindo) return;
    if (Math.random() < 0.4) say(pick(DIALOGUE.eventos), null, 3500, false);
  }

  function cleanupRuntime() {
    stopGame();
    stopRecognition();
    stopSpeech();
    clearAnimationTimer();
    if (speechTimer !== null) { window.clearTimeout(speechTimer); speechTimer = null; }
    if (effectTimer !== null) { window.clearTimeout(effectTimer); effectTimer = null; }
    if (toastTimer !== null) { window.clearTimeout(toastTimer); toastTimer = null; }
    if (moderationTimer !== null) { window.clearTimeout(moderationTimer); moderationTimer = null; }
    if (pullTimer !== null) { window.clearTimeout(pullTimer); pullTimer = null; ui.scene.classList.remove('is-tumbling'); }
    if (offlineTimer !== null) { window.clearTimeout(offlineTimer); offlineTimer = null; }
    if (simulationTimer !== null) { window.clearInterval(simulationTimer); simulationTimer = null; }
    if (eventTimer !== null) { window.clearInterval(eventTimer); eventTimer = null; }
    persist();
  }

  function initialize() {
    save = loadSave();
    configureAudio();
    runtime.speechText = pick(DIALOGUE.saudacao);
    renderAll();
    persist();
    ui.chatWarning.hidden = ttsSupported();
    if (offlineNotice) {
      offlineTimer = window.setTimeout(function () { say(offlineNotice, 'happy', 4000, true); }, 650);
    }
    simulationTimer = window.setInterval(simulationTick, 10000);
    eventTimer = window.setInterval(randomEventTick, 45000);
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('change', handleChange);
  document.addEventListener('input', handleInput);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('pagehide', cleanupRuntime);
  window.addEventListener('beforeunload', cleanupRuntime);
  document.addEventListener('visibilitychange', function () { if (document.hidden) { stopGame(); stopRecognition(); stopSpeech(); persist(); } else if (save) { renderHeader(); renderHouse(); renderStats(); } });

  initialize();
}());
