import React from 'react';
import { X, Trash2, Heart, Grid, Sparkles } from 'lucide-react';
import type { PokemonListItem } from '../types/pokemon';
import { POKEMON_TYPES } from '../constants/pokemonData';
import { POKEMON_TYPES_MAP } from '../constants/pokemonTypes';
import { getJapaneseName } from '../constants/japaneseNames';
import { TypeIcon } from './TypeIcon';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PokemonListItem[];
  onSelectPokemon: (id: number) => void;
  onRemoveFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
  onClearAll?: () => void;
  onViewInMainGrid?: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectPokemon,
  onRemoveFavorite,
  onClearAll,
  onViewInMainGrid,
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="favorites-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <Heart size={20} fill="#ef4444" color="#ef4444" />
            <span>BANCO DE FAVORITOS ({favorites.length})</span>
          </div>
          <button
            className="terminal-close-btn close-x"
            onClick={onClose}
            title="Fechar Painel"
            aria-label="Fechar painel de favoritos"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Toolbar for Favorites */}
        {favorites.length > 0 && (
          <div className="drawer-actions-bar">
            {onViewInMainGrid && (
              <button
                className="drawer-action-btn primary"
                onClick={() => {
                  onViewInMainGrid();
                  onClose();
                }}
                title="Filtrar e visualizar favoritos na grade principal"
              >
                <Grid size={14} />
                <span>VER NA GRADE PRINCIPAL</span>
              </button>
            )}
            {onClearAll && (
              <button
                className="drawer-action-btn danger"
                onClick={() => {
                  if (window.confirm('Deseja realmente remover todos os Pokémon dos favoritos?')) {
                    onClearAll();
                  }
                }}
                title="Limpar todos os favoritos"
              >
                <Trash2 size={13} />
                <span>LIMPAR TODOS</span>
              </button>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="drawer-content">
          {favorites.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="drawer-empty-icon-box">
                <Heart size={44} color="#64748b" />
              </div>
              <h3>NENHUM ESPÉCIME FAVORITADO</h3>
              <p>
                Clique no ícone de coração nos cards ou na visualização holográfica de qualquer Pokémon para salvá-lo em seus favoritos!
              </p>
              <button className="drawer-empty-btn" onClick={onClose}>
                <Sparkles size={15} />
                <span>EXPLORAR POKÉDEX</span>
              </button>
            </div>
          ) : (
            <div className="favorites-list">
              {favorites.map((pokemon) => {
                const formattedId = `№ ${String(pokemon.id).padStart(4, '0')}`;
                const resolvedTypes =
                  pokemon.types && pokemon.types.length > 0
                    ? pokemon.types
                    : POKEMON_TYPES_MAP[pokemon.id] || ['normal'];
                const primaryType = resolvedTypes[0] || 'normal';
                const typeConfig = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;
                const japanese = pokemon.japaneseName || getJapaneseName(pokemon.id);

                return (
                  <div
                    key={pokemon.id}
                    className="fav-item-row"
                    onClick={() => {
                      onSelectPokemon(pokemon.id);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ '--item-accent': typeConfig.color } as React.CSSProperties}
                  >
                    <div className="fav-item-info">
                      <div className="fav-item-thumb-box">
                        <img
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="fav-item-thumb"
                          loading="lazy"
                        />
                      </div>
                      <div className="fav-item-details">
                        <div className="fav-item-meta">
                          <span className="fav-item-id">{formattedId}</span>
                          {japanese && <span className="fav-item-jp">{japanese}</span>}
                        </div>
                        <div className="fav-item-name">{pokemon.name}</div>
                        <div className="fav-item-types">
                          {resolvedTypes.map((type) => {
                            const cfg = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
                            return (
                              <span
                                key={type}
                                className="fav-type-chip"
                                style={{ backgroundColor: cfg.color }}
                              >
                                <TypeIcon type={type} size={9} color="#fff" />
                                <span>{cfg.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <button
                      className="fav-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemoveFavorite(pokemon, e);
                      }}
                      title={`Remover ${pokemon.name} dos favoritos`}
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
    </div>
  );
};

