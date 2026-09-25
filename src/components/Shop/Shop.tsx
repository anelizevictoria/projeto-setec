import { useState } from 'react';
import { FOODS, TOYS, ACCESSORIES, DECORATIONS } from '../../data/foods';
import type { InventoryMap, ItemType } from '../../types/items';

interface Props {
  moedas: number;
  nivel: number;
  inventario: InventoryMap;
  onComprar: (id: string) => void;
}

const ABAS: { id: ItemType | 'tudo'; rotulo: string }[] = [
  { id: 'tudo', rotulo: '🌟 Tudo' },
  { id: 'comida', rotulo: '🍎 Comidas' },
  { id: 'brinquedo', rotulo: '🧸 Brinquedos' },
  { id: 'acessorio', rotulo: '🎀 Acessórios' },
  { id: 'decoracao', rotulo: '🏠 Decoração' },
];

/** Brinquedos, acessórios e decorações são únicos: comprou uma vez, é seu para sempre. */
export function isItemUnico(tipo: ItemType): boolean {
  return tipo !== 'comida';
}

export function Shop({ moedas, nivel, inventario, onComprar }: Props) {
  const [aba, setAba] = useState<ItemType | 'tudo'>('tudo');
  const todos = [...FOODS, ...TOYS, ...ACCESSORIES, ...DECORATIONS];
  const lista = aba === 'tudo' ? todos : todos.filter((i) => i.tipo === aba);

  return (
    <section className="painel" aria-label="Loja do jogo">
      <h2>🛍️ Lojinha do Bubi</h2>
      <p className="saldo">Saldo: <strong>{moedas} 🪙</strong></p>
      <p className="dica">Moedas se ganham nos minigames! 🎮 Brinquedos, acessórios e decorações são únicos: depois de comprar, ficam seus! 💛</p>
      <div className="loja-abas" role="tablist" aria-label="Categorias da loja">
        {ABAS.map((a) => (
          <button key={a.id} role="tab" aria-selected={aba === a.id} className={aba === a.id ? 'ativo' : ''} onClick={() => setAba(a.id)}>{a.rotulo}</button>
        ))}
      </div>
      <ul className="loja-lista">
        {lista.map((item) => {
          const bloqueado = !!item.descontoNivel && nivel < item.descontoNivel;
          const comprado = isItemUnico(item.tipo) && (inventario[item.id] ?? 0) > 0;
          const semSaldo = !comprado && moedas < item.preco;
          const desabilitado = bloqueado || comprado || semSaldo;
          return (
            <li key={item.id} className="loja-item">
              <span className="loja-emoji" aria-hidden>{item.emoji}</span>
              <div className="loja-info">
                <strong>{item.nome} {comprado && '✅'}</strong>
                <small>{item.descricao}</small>
                <span className="loja-preco">💰 {item.preco} 🪙 {bloqueado && `(Nv ${item.descontoNivel}+)`}</span>
              </div>
              <button onClick={() => onComprar(item.id)} disabled={desabilitado} aria-label={comprado ? `${item.nome} já comprado` : `Comprar ${item.nome} por ${item.preco} moedas`}>
                {comprado ? 'Comprado!' : bloqueado ? '🔒' : semSaldo ? 'Sem saldo' : 'Comprar'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
