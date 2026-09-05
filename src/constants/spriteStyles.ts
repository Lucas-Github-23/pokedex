export type SpriteStyle = 'official' | 'showdown' | 'ds' | 'gba' | 'gbc' | 'gb';

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
    tag: 'ANIMADO',
    badge: 'GEN 1-9',
    description: 'Sprites animados 3D de todas as 9 gerações (Pokémon Showdown)',
  },
  {
    id: 'ds',
    label: 'Nintendo DS',
    tag: 'DS',
    badge: 'ANIMADO',
    description: 'Sprites pixel-art animados clássicos de Black/White & Platinum',
  },
  {
    id: 'gba',
    label: 'Game Boy Advance',
    tag: 'GBA',
    badge: 'GEN 3',
    description: 'Sprites clássicos de Pokémon Emerald, FireRed & LeafGreen',
  },
  {
    id: 'gbc',
    label: 'Game Boy Color',
    tag: 'GBC',
    badge: 'GEN 2',
    description: 'Sprites nostálgicos de Pokémon Crystal, Gold & Silver (1999)',
  },
  {
    id: 'gb',
    label: 'Game Boy Clássico',
    tag: 'GB',
    badge: '1996',
    description: 'Sprites monocromáticos originais de Pokémon Red & Blue (1996)',
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

  // 5. GAME BOY COLOR (Crystal / Gold / Silver for IDs 1-251)
  if (style === 'gbc') {
    if (id <= 251) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/shiny/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/${id}.png`;
    }
    if (id <= 386) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${id}.png`;
    }
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  // 6. GAME BOY CLÁSSICO (Red / Blue monochrome for IDs 1-151)
  if (style === 'gb') {
    if (id <= 151) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${id}.png`;
    }
    if (id <= 251) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/${id}.png`;
    }
    if (id <= 386) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${id}.png`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Checks if the Pokemon is displaying an authentic Game Boy Classic or Game Boy Color sprite
 * with an opaque white bounding box that requires clean rounded borders.
 * Returns false if the Pokemon is from a later generation and falls back to a transparent sprite.
 */
export function isRetroGBSprite(id: number, style: SpriteStyle): boolean {
  if (style === 'gb') return id <= 151;
  if (style === 'gbc') return id <= 251;
  return false;
}

