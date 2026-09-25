import { useEffect } from 'react';

/** Hook simples de game loop (tick periódico). */
export function useGameLoop(fn: () => void, ms: number, ativo = true): void {
  useEffect(() => {
    if (!ativo) return;
    const id = window.setInterval(fn, ms);
    return () => window.clearInterval(id);
  }, [fn, ms, ativo]);
}
