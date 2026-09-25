import { respostaLocal } from '../data/dialogue';
import { buildPetContext } from '../game/petPersonality';
import type { PetMood, PetState } from '../types/pet';

/**
 * Serviço de IA com fallback local.
 * NUNCA coloque API key no frontend. Use variável de ambiente + proxy backend.
 *
 * Configuração (opcional):
 *  - VITE_AI_ENDPOINT: URL do seu proxy/backend (POST { prompt, contexto })
 *  - VITE_AI_API_KEY: apenas se o endpoint for público/teste (evite em produção!)
 * Se não configurado, usa diálogo local automaticamente.
 */

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT as string | undefined;
const API_KEY = import.meta.env.VITE_AI_API_KEY as string | undefined;

export function isAIConfigured(): boolean {
  return !!ENDPOINT;
}

export async function gerarRespostaPet(
  mensagemJogador: string,
  pet: PetState,
  humor: PetMood,
  historico: { de: string; texto: string }[] = [],
): Promise<string> {
  const texto = mensagemJogador.trim().slice(0, 200);
  if (!texto) return 'Diz alguma coisinha pra mim? Blub? 💛';

  if (!ENDPOINT) {
    // Fallback local — funciona offline. Delay proporcional = parece que "pensou".
    const espera = 500 + Math.min(900, texto.length * 12) + Math.random() * 300;
    await new Promise((r) => setTimeout(r, espera));
    return respostaLocal(texto, humor, pet);
  }

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);
    const contexto = buildPetContext(pet, humor, pet.lastAction, historico);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({ mensagem: texto, contexto, pet: { nome: pet.nome, humor, nivel: pet.nivel, amizade: pet.amizade } }),
    });
    clearTimeout(t);
    if (!res.ok) throw new Error('AI indisponível');
    const data = (await res.json()) as { resposta?: string; texto?: string };
    const out = (data.resposta ?? data.texto ?? '').toString().slice(0, 300);
    if (!out) throw new Error('resposta vazia');
    return out;
  } catch {
    // Nunca quebra: fallback local
    return respostaLocal(texto, humor, pet);
  }
}
