import React from 'react';
import { Heart } from 'lucide-react';
import type { PokemonListItem } from '../types/pokemon';
import { POKEMON_TYPES } from '../constants/pokemonData';
import { getJapaneseName } from '../constants/japaneseNames';
import { TypeIcon } from './TypeIcon';
import type { SpriteStyle } from '../constants/spriteStyles';
import { getPokemonSpriteUrl, isRetroGBSprite } from '../constants/spriteStyles';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
  onSelect: (id: number) => void;
  spriteStyle?: SpriteStyle;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onSelect,
  spriteStyle = 'official',
}) => {
  const formattedId = `№ ${String(pokemon.id).padStart(4, '0')}`;
  const primaryType = pokemon.types?.[0] || 'normal';
  const typeConfig = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;
  const japaneseText = pokemon.japaneseName || getJapaneseName(pokemon.id);
  const spriteUrl = getPokemonSpriteUrl(pokemon.id, spriteStyle, false);
  const isRetroGB = isRetroGBSprite(pokemon.id, spriteStyle);

  return (
    <div
      className="specimen-card"
      onClick={() => onSelect(pokemon.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(pokemon.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Visualizar dados de ${pokemon.name}`}
      style={
        {
          '--card-accent-color': typeConfig.color,
        } as React.CSSProperties
      }
    >
      {/* Subtle Japanese Specimen Stamp */}
      <div className="card-japanese-watermark" aria-hidden="true">
        {japaneseText}
      </div>

      {/* Card Header (Specimen Number + Favorite Button) */}
      <div className="specimen-header">
        <span className="specimen-id-badge">{formattedId}</span>
        <button
          className={`card-fav-hardware-btn ${isFavorite ? 'is-fav' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pokemon, e);
          }}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar espécime'}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar espécime'}
        >
          <Heart
            size={13}
            fill={isFavorite ? '#ef4444' : 'none'}
            color={isFavorite ? '#ef4444' : 'currentColor'}
          />
        </button>
      </div>

      {/* Recessed Sub-Screen / Specimen Viewport */}
      <div className="specimen-sprite-box">
        <div className="specimen-subscreen-bevel" />
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className={`specimen-sprite-img ${spriteStyle !== 'official' ? 'pixelated-sprite' : ''} ${isRetroGB ? 'retro-gb-sprite' : ''}`}
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Specimen Identification Plate */}
      <div className="specimen-info-plate">
        <h3 className="specimen-name">{pokemon.name}</h3>

        {/* Type Badges / Hardware Chips */}
        {pokemon.types && pokemon.types.length > 0 ? (
          <div className="specimen-types">
            {pokemon.types.map((type) => {
              const cfg = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
              return (
                <span
                  key={type}
                  className="type-hardware-chip"
                  style={{ backgroundColor: cfg.color }}
                >
                  <TypeIcon type={type} size={11} color="#ffffff" />
                  <span>{cfg.label}</span>
                </span>
              );
            })}
          </div>
        ) : (
          <div className="specimen-types">
            <span
              className="type-hardware-chip"
              style={{ backgroundColor: typeConfig.color }}
            >
              ANALISAR
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
