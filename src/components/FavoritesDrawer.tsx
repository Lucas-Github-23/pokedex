import React from 'react';
import { X, Trash2, Heart } from 'lucide-react';
import type { PokemonListItem } from '../types/pokemon';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PokemonListItem[];
  onSelectPokemon: (id: number) => void;
  onRemoveFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectPokemon,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Heart size={20} fill="#ef4444" color="#ef4444" />
            <span>Meus Favoritos ({favorites.length})</span>
          </div>
          <button
            className="modal-close-btn"
            style={{ position: 'static' }}
            onClick={onClose}
            title="Fechar"
            aria-label="Fechar gaveta de favoritos"
          >
            <X size={18} />
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state" style={{ margin: 'auto 0' }}>
            <Heart size={48} className="empty-state-icon" color="#64748b" />
            <h3>Nenhum favorito ainda</h3>
            <p>Clique no ícone de coração nos cards dos seus Pokémon preferidos para adicioná-los aqui!</p>
          </div>
        ) : (
          <div className="drawer-items-list">
            {favorites.map((pokemon) => {
              const formattedId = `#${String(pokemon.id).padStart(4, '0')}`;
              return (
                <div
                  key={pokemon.id}
                  className="drawer-item"
                  onClick={() => {
                    onSelectPokemon(pokemon.id);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="drawer-item-info">
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="drawer-item-sprite"
                    />
                    <div>
                      <div className="drawer-item-name">{pokemon.name}</div>
                      <div className="drawer-item-id">{formattedId}</div>
                    </div>
                  </div>
                  <button
                    className="drawer-item-remove"
                    onClick={(e) => onRemoveFavorite(pokemon, e)}
                    title="Remover dos favoritos"
                    aria-label={`Remover ${pokemon.name} dos favoritos`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
