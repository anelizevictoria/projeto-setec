import type { InventoryMap } from '../../types/items';
import { getItemById } from '../../data/foods';

interface Props {
  inventario: InventoryMap;
  equipado?: string;
  onUsar: (id: string) => void;
}

export function Inventory({ inventario, equipado, onUsar }: Props) {
  const ids = Object.keys(inventario).filter((id) => (inventario[id] ?? 0) > 0);
  if (ids.length === 0) {
    return (
      <section className="painel" aria-label="Inventário">
        <h2>🎒 Mochila</h2>
        <p>Sua mochila está vazia! Visite a lojinha para comprar lanchinhos e brinquedos. 🛍️</p>
      </section>
    );
  }
  return (
    <section className="painel" aria-label="Inventário">
      <h2>🎒 Mochila</h2>
      <ul className="loja-lista">
        {ids.map((id) => {
          const item = getItemById(id);
          if (!item) return null;
          const qtd = inventario[id] ?? 0;
          const isEquipado = equipado === id;
          return (
            <li key={id} className="loja-item">
              <span className="loja-emoji" aria-hidden>{item.emoji}</span>
              <div className="loja-info">
                <strong>{item.nome} {isEquipado && '✅'}</strong>
                <small>{item.descricao}</small>
                <span className="loja-preco">Qtd: {qtd} · {item.tipo}</span>
              </div>
              <button onClick={() => onUsar(id)} aria-label={item.tipo === 'comida' ? `Dar ${item.nome} para comer` : item.tipo === 'acessorio' ? (isEquipado ? `Remover ${item.nome}` : `Equipar ${item.nome}`) : `Usar ${item.nome}`}>
                {item.tipo === 'comida' ? 'Dar' : item.tipo === 'acessorio' ? (isEquipado ? 'Tirar' : 'Vestir') : 'Usar'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
