export type SpriteStyle = 'official' | 'showdown' | 'ds' | 'gba';

export interface SpriteStyleOption {
  id: SpriteStyle;
  label: string;
  tag: string;
  badge: string;
  description: string;
}

export const SPRITE_STYLES: SpriteStyleOption[] = [
  {
    id: 'official',
    label: 'Oficial HD',
    tag: 'HD',
    badge: 'MODERNO',
    description: 'Ilustrações oficiais de alta definição (Pokémon Company)',
  },
  {
    id: 'showdown',
    label: 'Showdown 3D',
    tag: '3D',
    badge: 'ANIMADO',
    description: 'Sprites animados 3D de todas as 9 gerações (Pokémon Showdown)',
  },
  {
    id: 'ds',
    label: 'Nintendo DS',
    tag: 'DS',
    badge: 'GEN 5',
    description: 'Sprites pixel-art animados clássicos de Black/White & Platinum',
  },
  {
    id: 'gba',
    label: 'Game Boy Advance',
    tag: 'GBA',
    badge: 'GEN 3',
    description: 'Sprites clássicos de Pokémon Emerald, FireRed & LeafGreen',
  },
];

/**
 * Resolves the sprite URL for a given Pokemon ID, console style and shiny state.
 * Implements intelligent fallbacks for Pokemon from generations newer than the console.
 */
export function getPokemonSpriteUrl(
  id: number,
  style: SpriteStyle = 'official',
  isShiny: boolean = false
): string {
  // 1. OFICIAL HD (The modern high-definition artwork)
  if (style === 'official') {
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  // 2. SHOWDOWN 3D ANIMATED (Available for almost all 1025 Pokemon)
  if (style === 'showdown') {
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  // 3. NINTENDO DS (Animated Black & White Gen 5 for IDs 1-649, fallback to Showdown)
  if (style === 'ds') {
    if (id <= 649) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    }
    // Fallback for Gen 6+ (Kalos, Alola, Galar, Paldea)
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  // 4. GAME BOY ADVANCE (Emerald / FireRed for IDs 1-386)
  if (style === 'gba') {
    if (id <= 386) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${id}.png`;
    }
    if (id <= 649) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    }
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

