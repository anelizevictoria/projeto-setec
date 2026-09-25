/** Serviço de voz: SpeechRecognition (STT) + SpeechSynthesis (TTS). Com fallbacks amigáveis. */

export function isSTTSupported(): boolean {
  const w = window as unknown as Record<string, unknown>;
  return !!(w['SpeechRecognition'] || w['webkitSpeechRecognition']);
}

export function isTTSSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function falar(texto: string, vozAtivada: boolean): void {
  if (!vozAtivada || !isTTSSupported()) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto.slice(0, 220));
    u.lang = 'pt-BR';
    u.rate = 1.05;
    u.pitch = 1.3;
    window.speechSynthesis.speak(u);
  } catch {
    // ignora
  }
}

export function pararFala(): void {
  try {
    if (isTTSSupported()) window.speechSynthesis.cancel();
  } catch {
    // ignora
  }
}

export interface Reconhecimento {
  parar: () => void;
}

export function iniciarEscuta(
  onResult: (texto: string) => void,
  onError: (msg: string) => void,
  onEnd?: () => void,
): Reconhecimento | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  const Construtora = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Construtora) {
    onError('Seu navegador não suporta microfone. Use o teclado! 🎤❌');
    return null;
  }
  try {
    const rec = new Construtora();
    rec.lang = 'pt-BR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev: unknown) => {
      try {
        const e = ev as { results: { 0: { 0: { transcript: string } } } };
        const texto = e.results[0][0].transcript ?? '';
        onResult(texto);
      } catch {
        onError('Não entendi. Tente de novo!');
      }
    };
    rec.onerror = () => onError('Não consegui ouvir. Tente de novo!');
    rec.onend = () => onEnd?.();
    rec.start();
    return { parar: () => { try { rec.stop(); } catch { /* ignora */ } } };
  } catch {
    onError('Microfone indisponível no momento.');
    return null;
  }
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: unknown) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
