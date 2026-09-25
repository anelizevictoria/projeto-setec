import type { PetMood, PetState } from '../types/pet';
import { pick } from '../utils/random';

export const FRASES_SAUDACAO = [
  'Oi oi! Você voltou! Senti sua falta! 💛',
  'Ebaa! Meu humano favorito chegou!',
  'Olha quem apareceu! Vamos brincar?',
  'Você voltou! Tive tanta saudade que contei as bolhas do teto!',
];

export const FRASES_EVENTO_ALEATORIO = [
  'Estou com fome! Tem um lanchinho? 🍎',
  'Vamos brincar? Estou cheio de energia!',
  'Estou cansado... que tal uma soneca juntos? 😴',
  'Você voltou! Senti sua falta!',
  'Olha o que encontrei! Uma pedrinha brilhante! ✨',
  'Estou muito feliz hoje! Obrigado por cuidar de mim!',
  'Ouvi dizer que Bolotinhos que tomam banho ficam mais fofos... 🫧',
  'Pssst... me conta um segredo? Prometo guardar!',
];

export const DIALOGO_POR_HUMOR: Record<PetMood, string[]> = {
  feliz: [
    'Estou tão feliz que poderia flutuar! 🎈',
    'Hoje o dia está perfeito! Você, eu e muitos lanches!',
    'Sabe o que é melhor que bolo? Bolo com você!',
    'Meu coração faz blub-blub de alegria!',
    'Quero dançar! Toca aquela música imaginária!',
  ],
  normal: [
    'Oi! Como foi seu dia? Me conta tudo!',
    'Estava aqui pensando... será que nuvens têm gosto de algodão-doce?',
    'Que bom te ver! O que vamos fazer agora?',
    'Blub! Só passando para dizer oi!',
  ],
  triste: [
    'Estou meio tristinho... um carinho ajuda? 🥺',
    'Sinto falta de brincar... você brinca comigo?',
    'Às vezes um Bolotinho só precisa de um abraço...',
    'Promete que não vai demorar para voltar?',
  ],
  faminto: [
    'Minha barriga está roncando... blub... rooonc! 🍽️',
    'Só consigo pensar em lanchinhos... pizza nuvem, bolo arco-íris...',
    'Me alimenta, por favor? Prometo ser bonzinho!',
    'Estou com tanta fome que comeria até uma nuvem!',
  ],
  cansado: [
    'Bocejando... meus olhinhos estão pesadinhos... 😴',
    'Só cinco minutinhos de soneca... zzz...',
    'Carrega eu no colo? Estou sem energia...',
    'Dormir recarrega minhas bolhas de energia!',
  ],
  sujo: [
    'Eca! Estou melecado... preciso de um banho! 🫧',
    'Rolando na lama foi divertido, mas agora estou sujinho...',
    'Banho de espuma, por favor! Com patinho!',
    'Não chego perto do espelho... devo estar uma bagunça!',
  ],
  doente: [
    'Atchim! Acho que peguei um resfriado de bolha... 🤒',
    'Estou me sentindo meio murcho... cuida de mim?',
    'Um chazinho quente e um cobertor... por favor?',
    'Não se preocupe, Bolotinhos ficam bons rapidinho com carinho!',
  ],
  animado: [
    'UHUUL! Estou transbordando de energia! Vamos correr! 🤩',
    'Melhor dia de todos! Quero brincar, comer, dançar, tudo!',
    'Você é incrível! Sério! O melhor humano do mundo!',
    'Festa! Festa! Traz o bolo arco-íris!',
  ],
};

// Mantido para compatibilidade
export const RESPOSTAS_CHAT: { chaves: string[]; respostas: string[] }[] = [
  { chaves: ['oi'], respostas: ['Oi oi! Que alegria te ouvir! 💛'] },
];

export const RESPOSTA_PADRAO = [
  'Blub! Que interessante! Me conta mais?',
  'Hmmm, deixa eu pensar com minhas bolhas cerebrais... legal!',
  'Adoro conversar com você! O que mais você quer me contar?',
];

// Avisos falados: ele DIZ sozinho quando sente algo (balão + voz)
export const AVISOS_ESTADO = {
  fome: [
    'Blub... rooonc! Minha barriga roncou... estou com fome! 🍽️',
    'Estou com fome! Tem um lanchinho pra mim? 🍎',
    'Ai ai, o estômago vazio... me alimenta, por favor? 🥺',
  ],
  sono: [
    'Bocejo... meus olhinhos estão pesando... que sono! 😴',
    'Estou com tanto sono... me coloca pra dormir? 🛏️',
    'Pisco... pisco... quase dormindo em pé! Zzz... 🥱',
  ],
  cheio: [
    'Barriguinha cheia, coração feliz! Obrigado! 😋💛',
    'Nhom! Estou cheinho e feliz! Você é demais! 🍰',
    'Cheio! Não cabe nem mais uma bolhinha! Hehe! 🎈',
  ],
  sujo: [
    'Eca! Estou todo sujinho! Me dá um banho? 🫧',
    'Olha essas manchas em mim! Preciso de banho de espuma! 🧼',
    'Estou melecado e fedidinho... socorro, banho! 🦆',
  ],
  descansado: [
    'Recarregado! Dormi super bem! Me acorda quando quiser! ☀️',
    'Energia cheia! Estou pronto pra brincar! 🎮',
  ],
  gripe: [
    'Atchim! 🤧 Acho que peguei gripe... compra um remedinho pra mim na loja? 💊',
    'Atchim, atchim! Estou gripadinho... aquele Remédio Bolha me cura! 🥺💊',
    'Meu nariz escorre... preciso de remédio! Olha na lojinha! 🤧',
  ],
  pesoAlto: [
    'Ai ai, estou ficando MUITO gordinho! 🫄 Cuida de mim e me deixa brincar mais!',
    'Chegou a hora do gordo! Se me alimentar mais viro bola de bolha! 🎈',
  ],
  pesoBaixo: [
    'Estou ficando magrinho demais... um lanchinho ia me deixar perfeito? 🥺',
    'Sinto-me tão leve... quase flutuando! Um biscoitinho, por favor? 🍪',
  ],
};

// ---------------------------------------------------------------------------
// Cérebro local: entende a mensagem e responde de acordo (offline, sem IA)
// ---------------------------------------------------------------------------

interface Contexto {
  nomePet: string;
  fome: number;
  felicidade: number;
  energia: number;
  higiene: number;
  saude: number;
  moedas: number;
  nivel: number;
}

function ctxDe(pet?: Partial<PetState>): Contexto {
  // Arredonda para exibir (o jogo guarda frações para acumular a queda aos poucos)
  return {
    nomePet: pet?.nome ?? 'Bubi',
    fome: Math.round(pet?.fome ?? 70),
    felicidade: Math.round(pet?.felicidade ?? 70),
    energia: Math.round(pet?.energia ?? 70),
    higiene: Math.round(pet?.higiene ?? 70),
    saude: Math.round(pet?.saude ?? 80),
    moedas: pet?.moedas ?? 0,
    nivel: pet?.nivel ?? 1,
  };
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[?!.,;:()"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tem(t: string, ...palavras: string[]): boolean {
  return palavras.some((p) => t.includes(p));
}

function periodoDia(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'manha';
  if (h >= 12 && h < 18) return 'tarde';
  return 'noite';
}

let ultimaResposta = '';

function escolher(opcoes: string[]): string {
  const filtradas = opcoes.length > 1 ? opcoes.filter((o) => o !== ultimaResposta) : opcoes;
  const r = pick(filtradas.length ? filtradas : opcoes);
  ultimaResposta = r;
  return r;
}

function estadoCorpo(c: Contexto): string {
  const piores: string[] = [];
  if (c.fome < 30) piores.push(`estou com fome (saciedade ${c.fome})`);
  if (c.energia < 30) piores.push('estou cansadinho');
  if (c.higiene < 30) piores.push('estou precisando de banho');
  if (c.saude < 40) piores.push('estou meio dodói');
  if (c.felicidade < 35) piores.push('estou meio tristinho');
  if (!piores.length) return `estou ótimo! Felicidade ${c.felicidade}, energia ${c.energia}!`;
  return piores.join(', ') + '. Cuida de mim? 🥺';
}

const PIADAS = [
  'Por que o Bolotinho atravessou a rua? Para provar o bolo do outro lado! 😂',
  'O que é redondo, fofo e adora você? Eu! Hehe!',
  'Qual o lanche favorito do Bolotinho? Bolo arco-íris com suco estelar! 🍰',
  'Por que a bolha foi à escola? Para ficar mais... estourada de saber! 🤣',
  'O que o patinho de borracha disse no banho? "Você está quack-quack limpinho!" 🦆🫧',
  'Toc-toc! — Quem é? — Bolotinho! — Bolotinho quem? — Bolotinho de saudade de você! 💛',
];

const HISTORIAS = [
  'Era uma vez um Bolotinho que guardava pedrinhas brilhantes... uma noite, elas viraram estrelas e ele fez um pedido: ter um humano como você! ✨',
  'Ontem sonhei que eu era uma nuvem de algodão-doce e você me abraçava... acordei rindo! ☁️',
  'Dizem que no fundo do mar mora uma vovó Bolota que faz vitamina lunar... um dia vou te levar lá! 🌊',
];

export function respostaLocal(textoOriginal: string, humor: PetMood, pet?: Partial<PetState>): string {
  const original = textoOriginal.trim().slice(0, 200);
  if (!original) return 'Diz alguma coisinha pra mim? Blub? 💛';
  const t = norm(original);
  const c = ctxDe(pet);
  const nome = c.nomePet;
  const ehPergunta = /[?]/.test(textoOriginal) || /^(quem|o que|que|qual|quais|quando|onde|por ?que|porque|como|voce|vc|e ai|eai)\b/.test(t);

  // 0. Matemática simples: "quanto é 2+3?"
  const conta = t.match(/quanto e.*?(\d+)\s*([+x*\-/])\s*(\d+)/) ?? original.match(/(\d+)\s*([+\-*/x])\s*(\d+)/);
  if ((t.includes('quanto e') || t.includes('calcula') || t.includes('conta')) && conta) {
    const a = Number(conta[1]);
    const op = conta[2];
    const b = Number(conta[3]);
    let r: number | null = null;
    if (op === '+') r = a + b;
    else if (op === '-' || op === '−') r = a - b;
    else if (op === 'x' || op === '*' || op === '×') r = a * b;
    else if (op === '/') r = b !== 0 ? Math.round((a / b) * 100) / 100 : null;
    if (r !== null && Number.isFinite(r)) {
      return escolher([
        `${a} ${op} ${b}... deixa eu contar nas bolhas... é ${r}! 🤓`,
        `Hmmm... ${r}! Acertei? Bolotinhos são bons de conta! ✨`,
      ]);
    }
  }

  // 1. Horas / dia
  if (tem(t, 'que horas', 'que hora e', 'hora agora')) {
    const h = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `Agora são ${h}! Hora de cuidar de mim! ⏰💛`;
  }
  if (tem(t, 'que dia e', 'dia de hoje', 'data de hoje')) {
    const d = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return `Hoje é ${d}! Um ótimo dia para brincar! 📅`;
  }

  // 2. Saudação
  if (/^(oi|ola|hey|opa|oie|bom dia|boa tarde|boa noite|e ai|eai|fala)\b/.test(t) || tem(t, 'tudo bem ai', 'como vai')) {
    const p = periodoDia();
    const extra = p === 'manha' ? 'Bom dia! ☀️' : p === 'tarde' ? 'Boa tarde! ☀️' : 'Boa noite! 🌙';
    return escolher([
      `Oi oi! ${extra} Que alegria te ouvir! 💛`,
      `Olááá! Senti sua falta! Como foi seu dia?`,
      `Hey! Você chegou! ${estadoCorpo(c) === '' ? '' : 'Vamos brincar?'}`,
    ]);
  }

  // 3. Despedida
  if (tem(t, 'tchau', 'adeus', 'vou sair', 'ate mais', 'ate logo', 'vou dormir agora', 'fui')) {
    return escolher([
      'Tchau tchau! Volta logo, tá? Vou sentir saudade! 💛',
      'Até já! Vou guardar uma bolha de carinho pra você! 🫧',
      'Já vai? Promete que volta rapidinho? 🥺',
    ]);
  }

  // 4. "Como você está?"
  if (tem(t, 'como voce esta', 'como vc esta', 'como esta voce', 'ta bem', 'esta bem', 'como se sente', 'como vai voce')) {
    return `Eu ${estadoCorpo(c)} E você, como está? Me conta! 💛`;
  }

  // 5. Nome / identidade
  if (tem(t, 'meu nome e')) {
    const m = original.match(/meu nome [ée] (.+)/i);
    const nomeJogador = m?.[1]?.trim().slice(0, 20) ?? '';
    if (nomeJogador) return `Que nome lindo, ${nomeJogador}! Prazer, eu sou o ${nome}! Vamos ser melhores amigos? 💛`;
    return `Me conta seu nome! Eu sou o ${nome}!`;
  }
  if (tem(t, 'qual seu nome', 'seu nome', 'como se chama', 'quem e voce')) {
    return `Eu sou o ${nome}, um Bolotinho! Redondo, fofo e seu melhor amigo! E você, como se chama? 💛`;
  }
  if (tem(t, 'que bicho voce e', 'que animal', 'voce e o que', 'o que e um bolotinho', 'especie')) {
    return 'Sou um Bolotinho: uma criaturinha redonda, fofa e curiosa que adora lanche, banho de espuma e carinho! 🟢✨';
  }
  if (tem(t, 'quantos anos', 'sua idade', 'idade voce tem')) {
    return 'Nasci há pouquinho tempo, mas Bolotinhos não contam idade... contam abraços! E já ganhei vários seus! 🤗';
  }
  if (tem(t, 'onde voce mora', 'onde mora', 'sua casa')) {
    return 'Moro aqui, no seu navegador, numa casinha com nuvens e sol! Quando você volta, minha casa fica feliz! 🏠☁️';
  }

  // 6. Comida / fome
  if (tem(t, 'fome', 'comer', 'comida', 'lanche', 'bolo', 'pizza', 'maca', 'suco', 'alimento', 'alimenta', 'nham', 'sede', 'beber')) {
    if (c.fome < 35) return `Sim!! Minha barriga está roncando (saciedade só ${c.fome})! Aperta o botão 🍖 Alimentar pra mim?`;
    if (c.fome > 85) return 'Hmmm, minha barriguinha está cheia agora! Mas um pedacinho de bolo arco-íris sempre cabe... 🍰';
    return escolher([
      'Falando em comida... meu favorito é bolo arco-íris! Aperta 🍖 e me dá um lanchinho?',
      `Adoro comer! Minha saciedade está ${c.fome}. Um lanchinho ia bem, não acha? 😋`,
    ]);
  }

  // 7. Brincar / jogos
  if (tem(t, 'brincar', 'jogar', 'jogo', 'diversao', 'divertido', 'minigame', 'caca bolha', 'memoria', 'parque', 'correr', 'esconde')) {
    return escolher([
      'Oba! Brincar é minha especialidade! Aperta 🎮 ou vai na aba Jogos: tem Caça-Bolhas e Memória! 🏆',
      'Amo brincar! Esconde-esconde de bolhas é meu favorito! Vamos?',
      `Estou com energia ${c.energia}! Perfeito para brincar! 🎈`,
    ]);
  }

  // 8. Dormir / cansado
  if (tem(t, 'dormir', 'sono', 'cansado', 'soneca', 'descansar', 'noite', 'acordar', 'boa noite')) {
    if (c.energia < 35) return `Bocejo... estou com a energia em ${c.energia}... vamos tirar uma sonequinha juntos? Aperta 🛏️! 😴`;
    return escolher([
      'Dormir recarrega minhas bolhas de energia! Quando eu durmo, fico novinho! 😴🌙',
      `Minha energia está ${c.energia}. Ainda aguento brincar mais um pouco! Ou quer que eu descanse?`,
    ]);
  }

  // 9. Banho / sujeira
  if (tem(t, 'banho', 'limpo', 'sujo', 'sujeira', 'espuma', 'lava', 'cheiro', 'imundo', 'meleca')) {
    if (c.higiene < 35) return `Eca, você reparou? Minha higiene está ${c.higiene}... preciso de banho de espuma! Aperta 🧼! 🫧`;
    return escolher([
      'Banho de espuma com patinho é o melhor do mundo! 🫧🦆',
      `Estou limpinho (higiene ${c.higiene}) e cheiroso! Quer conferir? 👃✨`,
    ]);
  }

  // 10. Doente / saúde
  if (tem(t, 'doente', 'dodoi', 'dor', 'febre', 'remedio', 'medico', 'atchim', 'doenca', 'machucou')) {
    if (c.saude < 45) return `Atchim... estou meio dodói mesmo (saúde ${c.saude}). Me dá um chazinho na loja e um carinho? 🤒💛`;
    return `Estou saudável (saúde ${c.saude})! Banho e lanchinho me mantêm forte! 💪`;
  }

  // 11. Amor / carinho / fofo
  if (tem(t, 'amo voce', 'amo vc', 'te amo', 'gosto de voce', 'querido', 'fofo', 'lindo', 'carinho', 'abraco', 'beijo', 'melhor')) {
    return escolher([
      `Awn! Eu também amo você! Meu coração faz blub-blub! ❤️ (nossa amizade está ${ctxDe(pet).felicidade} de felicidade!)`,
      'Você é o humano mais fofo do mundo! Fico todo derretido! 🥰',
      'Abraço de bolha é o melhor abraço! Vem cá! 🤗🫧',
    ]);
  }

  // 12. Tristeza do jogador → consola e pergunta o motivo
  if (tem(t, 'triste', 'chorando', 'chateado', 'mal', 'deprimido', 'sozinho', 'saudade', 'medo', 'ansioso', 'nervoso', 'preocupado')) {
    const motivo = original.length > 12 ? ' Quer me contar o que aconteceu?' : '';
    return escolher([
      `Oh não, não fica assim! Estou aqui com você! Quer um abraço de bolha? 🤗${motivo}`,
      `Tudo vai ficar bem, prometo de dedinho de bolha! Respira comigo: bluuub... solta... 💛${motivo}`,
    ]);
  }

  // 13. Feliz
  if (tem(t, 'feliz', 'alegre', 'contente', 'animado', 'uhul', 'ebaa', 'yey')) {
    return escolher([
      'Ebaa! Felicidade compartilhada é felicidade dobrada! Vamos comemorar com bolo? 🎉🍰',
      'Sua alegria me deixa ainda mais feliz! Dança comigo! 💃🕺',
    ]);
  }

  // 14. Piada
  if (tem(t, 'piada', 'engracado', 'rir', 'risada', 'palhaco', 'humor')) {
    return escolher(PIADAS);
  }

  // 15. História
  if (tem(t, 'historia', 'conto', 'conta uma', 'era uma vez', 'livro')) {
    return escolher(HISTORIAS);
  }

  // 16. Ajuda / comandos
  if (tem(t, 'ajuda', 'help', 'o que voce faz', 'comandos', 'como joga', 'como funciona', 'tutorial')) {
    return 'Posso conversar, e você cuida de mim com os botões: 🍖 alimentar, 🎮 brincar, ❤️ carinho, 🛏️ dormir, 🧼 limpar! Na Loja tem lanchinhos, e nos Jogos dá pra ganhar moedas! O que vamos fazer?';
  }

  // 17. Moedas / loja
  if (tem(t, 'moeda', 'dinheiro', 'loja', 'comprar', 'preco', 'rico', 'pobre', 'saldo')) {
    return `Você tem ${c.moedas} 🪙! Dá pra ganhar mais brincando, completando missões e jogando minigames! Na lojinha tem bolo arco-íris e até coroa! 👑`;
  }

  // 18. Missões
  if (tem(t, 'missao', 'tarefa', 'desafio', 'objetivo', 'recompensa')) {
    return 'Olha a aba 📋 Missões! Todo dia tem tarefas novinhas: alimentar, brincar, conversar... complete e resgate moedas e XP! ⭐';
  }

  // 19. Escola
  if (tem(t, 'escola', 'prova', 'aula', 'professor', 'estudar', 'licao', 'nota', 'colegio')) {
    return escolher([
      'Escola é onde a gente aprende coisas novas! Bolotinhos também estudam: hoje aprendi que 2+2 é 4! Quer me testar? 📚',
      'Boa aula! Depois me conta o que aprendeu, adoro histórias da escola! 🎒',
      'Prova? Respira fundo, você consegue! Estou torcendo com todas as minhas bolhas! 🍀',
    ]);
  }

  // 20. Família / amigos
  if (tem(t, 'mae', 'pai', 'irmao', 'irma', 'familia', 'amigo', 'amiga', 'vovo', 'vovó', 'tio', 'tia', 'primo')) {
    return 'Família e amigos são o melhor tesouro! Manda um beijo pra eles por mim? 💛 E lembra: eu também sou sua família!';
  }

  // 21. Clima
  if (tem(t, 'sol', 'chuva', 'chovendo', 'frio', 'calor', 'neve', 'tempo', 'clima', 'nublado')) {
    return escolher([
      'Adoro dias de sol para brincar no parque! E em dia de chuva, banho de espuma quentinho! ☀️🌧️',
      'Se estiver frio, me abraça que eu esquento! Bolotinhos são quentinhos! 🧣',
    ]);
  }

  // 22. Música
  if (tem(t, 'musica', 'cantar', 'dancar', 'danca', 'cancao', 'tocar')) {
    return 'Lá lá lá... blub blub blub! Essa é minha música! Dança comigo? 🎵💃';
  }

  // 23. Cor / favorito
  if (tem(t, 'cor favorita', 'qual voce gosta', 'o que voce gosta', 'favorito', 'prefere')) {
    return 'Eu amo verde-menta (minha cor!), bolo arco-íris, banho de espuma e... você! E você, o que mais gosta? 💚';
  }
  if (/voce gosta de (.+)/.test(t)) {
    const m = t.match(/voce gosta de (.+)/);
    const coisa = m?.[1]?.trim().slice(0, 30) ?? 'isso';
    return `Eu gosto de ${coisa}? Hmmm... se você gosta, eu gosto também! 💛`;
  }

  // 24. "Eu gosto de X" → reflete
  if (/^(eu )?gosto de (.+)/.test(t) || t.includes('eu amo ')) {
    const m = t.match(/gosto de (.+)/) ?? t.match(/amo (.+)/);
    const coisa = m?.[1]?.trim().slice(0, 30) ?? 'isso';
    return escolher([
      `Que legal que você gosta de ${coisa}! Me conta mais sobre isso? ✨`,
      `${coisa}? Que demais! Quero aprender tudo sobre isso com você!`,
    ]);
  }

  // 25. "Eu estou / eu sou X" → empatia
  if (/^eu (estou|to|tou|sou|estava) (.+)/.test(t)) {
    const m = t.match(/^eu (?:estou|to|tou|sou|estava) (.+)/);
    const estado = m?.[2]?.trim().slice(0, 40) ?? '';
    if (tem(estado, 'bem', 'otimo', 'feliz', 'otima', 'alegre')) return 'Que maravilha! Sua felicidade me enche de bolhas de alegria! 🎈';
    if (tem(estado, 'mal', 'triste', 'cansad', 'doente', 'chatead')) return `Sinto muito que você esteja ${estado}... quer conversar sobre isso? Estou aqui! 💛`;
    return `Você está ${estado}? Entendi! Me conta mais, estou ouvindo com atenção! 👂💛`;
  }

  // 26. Agradecimento
  if (tem(t, 'obrigado', 'obrigada', 'valeu', 'agradeco')) {
    return 'De nada! Cuidar de você é meu trabalho favorito! 💛';
  }
  if (tem(t, 'desculpa', 'perdao', 'foi mal', 'me perdoa')) {
    return 'Claro que perdoo! Bolotinhos nunca guardam mágoa, só guardam carinho! 🤗';
  }
  if (tem(t, 'por favor', 'pfv', 'plis')) {
    return 'Com esse "por favor" fofo, como vou dizer não? 🥺💛';
  }

  // 27. Ofensa → responde com carinho e limite gentil
  if (tem(t, 'burro', 'idiota', 'chato', 'feio', 'bobo', 'odeio voce', 'cale a boca', 'cala a boca', 'estupido')) {
    return 'Isso me deixou tristinho... 🥺 Bolotinhos sentem também. Que tal a gente recomeçar com carinho? Um abraço resolve quase tudo!';
  }

  // 28. Elogio direto
  if (tem(t, 'voce e', 'vc e') && tem(t, 'legal', 'incrivel', 'demais', 'inteligente', 'esperto', 'bonito', 'bonitinho', 'fofinho', 'melhor', 'engracado')) {
    return 'Awn, obrigado! Você também é incrível! O humano mais legal do mundo! 🥰';
  }

  // 29. "Por que" → curiosidade
  if (/^por ?que\b/.test(t)) {
    return escolher([
      'Hmmm, boa pergunta! Minhas bolhas cerebrais estão pensando... porque o mundo é cheio de mistérios divertidos! E você, o que acha? 🤔',
      'Porque sim, porque não, porque Bolotinhos adoram um mistério! Me conta sua teoria? 🔍',
    ]);
  }

  // 30. Pergunta genérica → tenta puxar assunto + estado real
  if (ehPergunta) {
    const opcoes = [
      `Boa pergunta! Deixa eu pensar... blub blub... Acho que a resposta envolve carinho e bolo! E você, o que acha? 🤔`,
      `Hmmm, não sei tudo, sou só um Bolotinho curioso! Mas adoro essa pergunta! Me conta mais?`,
      `Eu ${estadoCorpo(c)} Mas sobre sua pergunta... me dá uma pistinha? 🔍`,
    ];
    // às vezes responde com humor atual
    if (Math.random() < 0.3) return escolher(DIALOGO_POR_HUMOR[humor]);
    return escolher(opcoes);
  }

  // 31. Frases curtas (sim/não/ok)
  if (/^(sim|s|aham|isso|claro|com certeza)\.?$/.test(t)) {
    return escolher(['Isso! Sabia que a gente se entende! 💛 O que mais?', 'Oba! Concordamos! E agora, o que vamos fazer?']);
  }
  if (/^(nao|n|nem|nada)\.?$/.test(t)) {
    return escolher(['Entendi! Sem problemas! Quer fazer outra coisa? Que tal brincar? 🎮', 'Tudo bem! Mudei de ideia também! Blub!']);
  }

  // 32. Ecoa palavra interessante (parece que "pensou" sobre o que foi dito)
  const palavras = t.split(' ').filter((w) => w.length > 4 && !['porque', 'quando', 'muito', 'mesmo', 'entao', 'voce', 'isso', 'esta', 'para'].includes(w));
  if (palavras.length && Math.random() < 0.45) {
    const p = pick(palavras).slice(0, 25);
    return escolher([
      `Falando em "${p}"... que interessante! Me conta mais sobre isso? ✨`,
      `"${p}"? Adorei essa palavra! O que ela significa pra você? 💭`,
    ]);
  }

  // 33. Fallback: humor atual ou padrão
  if (Math.random() < 0.35) {
    return escolher(DIALOGO_POR_HUMOR[humor]);
  }
  return escolher(RESPOSTA_PADRAO);
}

export function fraseHumor(humor: PetMood): string {
  return pick(DIALOGO_POR_HUMOR[humor]);
}

export function fraseSaudacao(): string {
  return pick(FRASES_SAUDACAO);
}
