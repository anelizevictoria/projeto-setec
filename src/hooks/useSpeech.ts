import { useCallback, useRef, useState } from 'react';
import { iniciarEscuta, isSTTSupported, type Reconhecimento } from '../services/speechService';

export function useSpeech() {
  const [ouvindo, setOuvindo] = useState(false);
  const [transcricao, setTranscricao] = useState('');
  const [erro, setErro] = useState('');
  const recRef = useRef<Reconhecimento | null>(null);

  const suportado = isSTTSupported();

  const comecar = useCallback((onFinal: (texto: string) => void) => {
    setErro('');
    setTranscricao('');
    const r = iniciarEscuta(
      (texto) => {
        setTranscricao(texto);
        setOuvindo(false);
        onFinal(texto);
      },
      (msg) => {
        setErro(msg);
        setOuvindo(false);
      },
      () => setOuvindo(false),
    );
    if (r) {
      recRef.current = r;
      setOuvindo(true);
    }
  }, []);

  const cancelar = useCallback(() => {
    try { recRef.current?.parar(); } catch { /* ignora */ }
    setOuvindo(false);
  }, []);

  return { ouvindo, transcricao, erro, suportado, comecar, cancelar };
}
