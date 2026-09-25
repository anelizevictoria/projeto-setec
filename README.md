# Bubi · o Bolotinho — Bichinho Virtual 2D 💚

Bichinho virtual 2D **totalmente original** para navegador (celular, tablet e computador).
Cuide do **Bubi**, um Bolotinho redondo e fofo feito em **SVG puro** — sem imagens externas, sem cópia de franquias.

## ✨ Funcionalidades

- **Personagem original** (SVG + CSS): corpo, olhos, pupilas, boca, braços, pernas, bochechas, sombra + 14 estados (`idle`, `happy`, `sad`, `hungry`, `tired`, `sleeping`, `eating`, `playing`, `talking`, `surprised`, `angry`, `sick`, `cleaning`, `celebrating`) e animações (piscar via pupilas, respirar, olhar, pular, comer, brincar, dormir, acordar, carinho, falar, comemorar, level-up + idle aleatório via braços/nuvens).
- **Necessidades 0–100**: fome (saciedade), felicidade, energia, higiene, saúde, amizade, XP, nível, moedas. Decaimento equilibrado + progresso offline (máx. 8h, sem punição exagerada, nunca morre). A felicidade cai devagar, mas cai **mais rápido sem brincar, sem missão cumprida e sem carinho**! Com sono (energia baixa) os olhos semicerram; dormir recarrega tudo em cerca de 3 min.
- **Gripe 🤧**: de vez em quando ele pega gripe (mais fácil se estiver sujo!) — a saúde cai e ele avisa. Só cura comprando **Remédio Bolha 💊** ou **Chá Curativo 🍵** na loja e dando pra ele!
- **Humor**: feliz, normal, triste, faminto, cansado, sujo, doente, animado — muda expressão, animação e diálogo.
- **Ações grandes**: 🍖 Alimentar · 🎮 Brincar · ❤️ Carinho · 🛏️ Dormir/Acordar · 🧼 Limpar · 💬 Conversar.
- **Diálogo local offline**: dezenas de frases por humor + respostas por palavra-chave, sem repetição excessiva.
- **IA opcional** (`src/services/aiService.ts`): usa `VITE_AI_ENDPOINT` (proxy backend). Sem endpoint → fallback local automático. Nunca quebra sem IA. Nunca exponha keys no frontend.
- **Voz** (`src/services/speechService.ts`): STT via `SpeechRecognition` + TTS via `speechSynthesis`, botão 🎤, “Ouvindo...”, transcrição, cancelar, fallback amigável sem microfone, boca animada ao falar.
- **Áudio** (`src/services/audioService.ts`): Web Audio API (clique, comer, carinho, recompensa, erro, nível, pop...), liga/desliga + volume.
- **Moedas**: nunca negativas. Ganha SOMENTE nos minigames. Cuidar, conversar, missões e níveis dão XP/amizade.
- **Loja**: 6 comidas · 5 brinquedos · 5 acessórios · 5 decorações (todos originais, com id, nome, preço, descrição, tipo, efeito). Comidas são consumíveis; brinquedos, acessórios e decorações são únicos — depois de comprar, o botão vira "Comprado! ✅". Bloqueio por nível, sem comprar sem saldo.
- **Inventário**: ver qtd, usar/dar comida, equipar/desequipar acessório, aplicar decoração no cenário. Salvo.
- **XP/Níveis**: `xpParaProximoNivel = 80 + nivel*40`, animação ao subir (missões e cuidados dão XP; moedas só nos minigames).
- **Missões diárias**: 4/dia determinísticas pela data (alimentar, brincar, carinho, limpar, conversar, minigame, cuidar), com progresso, recompensa em XP, resgate e renovação diária.
- **Minigames (4)**: ① Caça-Bolhas (reação) ② Memória (pares) ③ Pega o Bubi (toque no Bubi nas tocas!) ④ Lanchinho Certo (dê ao Bubi o lanche que ele pede!). Dão XP + moedas (única fonte de moedas!), contam p/ missões, 100% offline.
- **Eventos aleatórios** com cooldown (“Estou com fome!”, “Você voltou!”...).
- **Persistência** (`storageService.ts`): `localStorage`, `version: 1`, validação, recuperação se corrompido, reset com confirmação.
- **Config**: som, volume, voz, modo economia, renomear pet, reset.
- **Acessibilidade**: `aria-label`, botões semânticos, foco visível, `role=status/progressbar/dialog`, contraste, teclado (Enter no chat, skip-link).
- **Responsivo mobile-first**: 360/390/430px, tablets, desktop. Touch-first, sem dependência de hover.

## 🛠️ Tecnologias

- React 19 + TypeScript + Vite 8
- CSS puro (mobile-first) + SVG/Canvas (personagem 100% vetorial)
- `localStorage` (save versionado)
- Web APIs nativas: Audio, SpeechRecognition, SpeechSynthesis

## 🚀 Instalação

```bash
npm install
```

## ▶️ Execução

```bash
npm run dev
# abra http://localhost:5173
```

## 📦 Build

```bash
npm run build
npm run preview
```

## 🔍 Checagens

```bash
npx tsc -b
npm run lint
npm run build
```

## 🔑 Variáveis de ambiente

Copie `.env.example` para `.env`:

| Var | Uso |
|-----|-----|
| `VITE_AI_ENDPOINT` | URL do proxy/backend de IA (POST `{ mensagem, contexto }` → `{ resposta }`). Vazio = diálogo local. |
| `VITE_AI_API_KEY` | Opcional, só p/ teste. **Evite em produção — use proxy.** |

### Configuração da IA

1. Crie um backend simples que recebe `{ mensagem, contexto, pet }` e chama sua IA favorita com o `contexto` (personalidade, humor, stats, nível, amizade, última ação, histórico).
2. Retorne `{ "resposta": "..." }` (1–2 frases, pt-BR, como o Bubi).
3. Defina `VITE_AI_ENDPOINT=https://seu-proxy/responder`.
4. Sem endpoint, o jogo usa `src/data/dialogue.ts` automaticamente.

> Segurança: nunca coloque secret no frontend, nunca execute código da IA, mensagens limitadas a 200 chars e sanitizadas.

### Configuração da voz

- Nada a instalar. Chrome/Edge: STT + TTS pt-BR funcionam.
- Firefox/Safari: pode não ter STT — o jogo mostra aviso e mantém teclado.
- Controle em ⚙️ Ajustes → “Voz do bichinho”.

## 📁 Estrutura do projeto

```
src/
  components/
    Pet/        PetSprite.tsx (SVG original) · PetScene.tsx (cenário dia/noite)
    Stats/      StatsBar.tsx
    Controls/   ActionButtons.tsx
    Dialog/     ChatBox.tsx
    Shop/       Shop.tsx
    Inventory/  Inventory.tsx
    Missions/   Missions.tsx
    MiniGames/  ReactionGame.tsx · MemoryGame.tsx · MiniGames.tsx
    Settings/   Settings.tsx
  game/
    petSimulation.ts  petActions.ts  petMood.ts
    petPersonality.ts  petState.ts  progression.ts  missions.ts
  services/
    aiService.ts  speechService.ts  audioService.ts  storageService.ts
  data/
    foods.ts (comidas+brinquedos+acessórios+decorações) · toys.ts
    accessories.ts · decorations.ts · missions.ts · dialogue.ts
  hooks/
    usePet.ts  useGameLoop.ts  useSpeech.ts
  types/
    pet.ts  items.ts  game.ts
  utils/
    time.ts  random.ts  validation.ts
  App.tsx  main.tsx  index.css
```

## 🧪 Como testar rapidinho

1. `npm run dev` → personagem aparece e respira/pisca.
2. Clique no Bubi (= carinho) e nos 6 botões de ação.
3. Recarregue (F5) → stats/moedas persistem.
4. Compre na 🛍️ Loja, use na 🎒 Mochila, equipe 🎀.
5. Complete 📋 Missões e resgate.
6. Jogue 🎮 os 4 minigames (moedas vêm só deles!).
7. Abra 💬 Conversar, digite e (se tiver) use 🎤.
8. ⚙️ → desligue som, mude volume, resete com confirmação.
9. Redimensione para 360px → tudo cabe, sem corte.

Personagem, nome, textos, artes e sons são originais deste projeto. 💛
