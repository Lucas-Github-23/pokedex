import React from 'react';
import { Heart } from 'lucide-react';
import type { PokemonListItem } from '../types/pokemon';
import { POKEMON_TYPES } from '../constants/pokemonData';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
  onSelect: (id: number) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const formattedId = `#${String(pokemon.id).padStart(4, '0')}`;
  const primaryType = pokemon.types?.[0] || 'normal';
  const typeConfig = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;

  return (
    <div
      className="pokemon-card"
      onClick={() => onSelect(pokemon.id)}
      role="button"
      tabIndex={0}
      style={
        {
          '--card-accent-color': typeConfig.color,
          '--card-glow': typeConfig.glow,
          '--card-bg-gradient': typeConfig.bgGradient,
        } as React.CSSProperties
      }
    >
      <div className="card-header">
        <span className="card-number">{formattedId}</span>
        <button
          className={`card-fav-btn ${isFavorite ? 'is-fav' : ''}`}
          onClick={(e) => onToggleFavorite(pokemon, e)}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
        >
          <Heart
            size={16}
            fill={isFavorite ? '#ef4444' : 'none'}
            color={isFavorite ? '#ef4444' : 'currentColor'}
          />
        </button>
      </div>

      <div className="card-image-wrapper">
        <div className="card-image-aura" />
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="card-sprite"
          loading="lazy"
        />
      </div>

      <h3 className="card-name">{pokemon.name}</h3>

      {pokemon.types && pokemon.types.length > 0 ? (
        <div className="card-types">
          {pokemon.types.map((type) => {
            const cfg = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
            return (
              <span
                key={type}
                className="type-tag"
                style={{ background: cfg.bgGradient }}
              >
                {cfg.label}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="card-types">
          <span className="type-tag" style={{ background: typeConfig.bgGradient }}>
            Ver Detalhes
          </span>
        </div>
      )}
    </div>
  );
};
