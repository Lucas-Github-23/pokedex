import React from 'react';
import { Heart } from 'lucide-react';
import type { PokemonListItem } from '../types/pokemon';
import { POKEMON_TYPES } from '../constants/pokemonData';
import { POKEMON_TYPES_MAP } from '../constants/pokemonTypes';
import { getJapaneseName } from '../constants/japaneseNames';
import { KNOWN_ALTERNATIVE_FORMS } from '../constants/pokemonForms';
import { TypeIcon } from './TypeIcon';
import type { SpriteStyle } from '../constants/spriteStyles';
import {
  getPokemonSpriteUrl,
  getSpriteFallbackChain,
  handleSpriteErrorWithChain,
} from '../constants/spriteStyles';
import { useXbrImage } from '../hooks/useXbrImage';

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
  const resolvedTypes =
    pokemon.types && pokemon.types.length > 0
      ? pokemon.types
      : POKEMON_TYPES_MAP[pokemon.id] || ['normal'];
  const primaryType = resolvedTypes[0] || 'normal';
  const typeConfig = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;
  const japaneseText = pokemon.japaneseName || getJapaneseName(pokemon.id);
  const spriteUrl = getPokemonSpriteUrl(pokemon.id, spriteStyle, false, pokemon.name);

  // Apply xBR 2x specifically to Showdown 3D models; retro consoles stay clean pixelated
  const isShowdown = spriteStyle === 'showdown';
  const isPixelArt = spriteStyle === 'gba' || spriteStyle === 'ds';
  const { imageSrc: renderedSprite } = useXbrImage(spriteUrl, isShowdown ? 'xbr-2x' : 'none');

  const fallbackChain = React.useMemo(
    () => getSpriteFallbackChain(pokemon.id, spriteStyle, false, pokemon.name),
    [pokemon.id, spriteStyle, pokemon.name]
  );
  const knownForms = KNOWN_ALTERNATIVE_FORMS[pokemon.id];

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
      {/* Card Header (Specimen Number + Japanese Badge + Favorite Button) */}
      <div className="specimen-header">
        <span className="specimen-id-badge">{formattedId}</span>
        {japaneseText && (
          <span className="specimen-japanese-badge" title={`Nome em japonês: ${japaneseText}`}>
            {japaneseText}
          </span>
        )}
        <button
          type="button"
          className={`card-fav-hardware-btn ${isFavorite ? 'is-fav' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleFavorite(
              {
                ...pokemon,
                types: resolvedTypes,
              },
              e
            );
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
        {japaneseText && (
          <div className="specimen-box-watermark" aria-hidden="true">
            {japaneseText}
          </div>
        )}
        {knownForms && knownForms.length > 0 && (
          <div className="card-form-indicators">
            {knownForms.slice(0, 2).map((kf, i) => (
              <span key={i} className={`card-form-badge badge-${kf.category}`}>
                {kf.tag}
              </span>
            ))}
          </div>
        )}
        <img
          key={`${pokemon.id}-${spriteStyle}`}
          src={renderedSprite}
          alt={pokemon.name}
          className={`specimen-sprite-img sprite-style-${spriteStyle} ${
            isPixelArt ? 'pixelated-sprite' : ''
          } ${isShowdown ? 'showdown-3d-xbr' : ''}`}
          loading="lazy"
          draggable={false}
          data-fallback-index="0"
          onError={(e) => handleSpriteErrorWithChain(e, fallbackChain)}
        />
      </div>

      {/* Specimen Identification Plate */}
      <div className="specimen-info-plate">
        <h3 className="specimen-name">{pokemon.name}</h3>

        {/* Type Badges / Hardware Chips */}
        <div className="specimen-types">
          {resolvedTypes.map((type) => {
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
      </div>
    </div>
  );
};
