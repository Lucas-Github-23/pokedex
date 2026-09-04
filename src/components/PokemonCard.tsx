import React from 'react';
import { Heart } from 'lucide-react';
import type { PokemonListItem } from '../types/pokemon';
import { POKEMON_TYPES } from '../constants/pokemonData';
import { getJapaneseName } from '../constants/japaneseNames';

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
  const formattedId = `№ ${String(pokemon.id).padStart(4, '0')}`;
  const primaryType = pokemon.types?.[0] || 'normal';
  const typeConfig = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;
  const japaneseText = pokemon.japaneseName || getJapaneseName(pokemon.id);

  return (
    <div
      className="specimen-card"
      onClick={() => onSelect(pokemon.id)}
      role="button"
      tabIndex={0}
      style={
        {
          '--card-accent-color': typeConfig.color,
          '--card-glow': typeConfig.glow,
        } as React.CSSProperties
      }
    >
      {/* HUD Corner Reticles */}
      <span className="card-bracket tl" />
      <span className="card-bracket tr" />
      <span className="card-bracket bl" />
      <span className="card-bracket br" />

      {/* Japanese Katakana Watermark Background */}
      <div className="card-japanese-watermark" aria-hidden="true">
        {japaneseText}
      </div>

      {/* Card Header (Specimen Number + Favorite Button) */}
      <div className="specimen-header">
        <span className="specimen-id">{formattedId}</span>
        <button
          className={`card-fav-hardware-btn ${isFavorite ? 'is-fav' : ''}`}
          onClick={(e) => onToggleFavorite(pokemon, e)}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar espécime'}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar espécime'}
        >
          <Heart
            size={14}
            fill={isFavorite ? '#ef4444' : 'none'}
            color={isFavorite ? '#ef4444' : 'currentColor'}
          />
        </button>
      </div>

      {/* Specimen Radar Chamber */}
      <div className="specimen-sprite-box">
        <div className="specimen-radar-ring" />
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="specimen-sprite-img"
          loading="lazy"
        />
      </div>

      {/* Specimen Identification */}
      <h3 className="specimen-name">{pokemon.name}</h3>

      {/* Type Badges / Power Cells */}
      {pokemon.types && pokemon.types.length > 0 ? (
        <div className="specimen-types">
          {pokemon.types.map((type) => {
            const cfg = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
            return (
              <span
                key={type}
                className="type-metal-badge"
                style={{ background: cfg.bgGradient }}
              >
                {cfg.label}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="specimen-types">
          <span
            className="type-metal-badge"
            style={{ background: typeConfig.bgGradient }}
          >
            ANALISAR
          </span>
        </div>
      )}
    </div>
  );
};
