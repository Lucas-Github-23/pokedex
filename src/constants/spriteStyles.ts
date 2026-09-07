export type SpriteStyle = 'official' | 'showdown' | 'ds' | 'gba';
export type EmulatorShader = 'none' | 'ink' | 'comic' | 'sketch' | 'toon' | 'crosshatch';

export interface SpriteStyleOption {
  id: SpriteStyle;
  label: string;
  tag: string;
  badge: string;
  description: string;
}

export interface ShaderOption {
  id: EmulatorShader;
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
    description: 'Sprites pixel-art animados e fan-arts Gen 5 clássicos de Black/White',
  },
  {
    id: 'gba',
    label: 'Game Boy Advance',
    tag: 'GBA',
    badge: 'GEN 3',
    description: 'Sprites retrô pixel-art 16-bit de Pokémon Emerald, FireRed e Smogon',
  },
];

export const EMULATOR_SHADERS: ShaderOption[] = [
  {
    id: 'none',
    label: 'Original (Sem Traçado)',
    tag: 'OFF',
    badge: 'PADRÃO',
    description: 'Renderização padrão limpa sem efeitos de traçado',
  },
  {
    id: 'ink',
    label: 'Traçado Anime / Nanquim',
    tag: 'ANIME',
    badge: 'NANQUIM',
    description: 'Transforma os pixels em traços de caneta nanquim e linhas de contorno de desenho japonês',
  },
  {
    id: 'comic',
    label: 'Traçado HQ / Quadrinhos',
    tag: 'HQ',
    badge: 'COMIC',
    description: 'Traços pretos de contorno marcados com coloração cel estilo história em quadrinhos',
  },
  {
    id: 'sketch',
    label: 'Esboço Mangá / Grafite',
    tag: 'ESBOÇO',
    badge: 'MANGÁ',
    description: 'Converte as formas e pixels em linhas de grafite e traçados finos de mangá',
  },
  {
    id: 'toon',
    label: 'Contorno Vetorial / Toon',
    tag: 'TOON',
    badge: 'VETOR',
    description: 'Contornos pretos nítidos ao redor de todas as formas transformando o sprite em desenho animado',
  },
  {
    id: 'crosshatch',
    label: 'Traçado Hachurado (Gravura)',
    tag: 'HACHURA',
    badge: 'GRAVURA',
    description: 'Linhas finas de hachura e traçados cruzados de desenho clássico',
  },
];

/**
 * Converts a Pokémon name or variety slug into a normalized Pokémon Showdown slug.
 * Examples:
 * - 'iron-thorns' -> 'ironthorns'
 * - 'roaring-moon' -> 'roaringmoon'
 * - 'charizard-mega-x' -> 'charizard-megax'
 * - 'gengar-gmax' -> 'gengar-gmax'
 * - 'wooper-paldea' -> 'wooper-paldea'
 */
export function toShowdownSlug(name?: string): string {
  if (!name) return '';
  let s = name.toLowerCase().trim();

  // Known irregular naming mappings
  const specialMap: Record<string, string> = {
    'nidoran-f': 'nidoranf',
    'nidoran-m': 'nidoranm',
    'mr-mime': 'mrmime',
    'mr-rime': 'mrrime',
    'mime-jr': 'mimejr',
    'type-null': 'typenull',
    'tapu-koko': 'tapukoko',
    'tapu-lele': 'tapulele',
    'tapu-bulu': 'tapubulu',
    'tapu-fini': 'tapufini',
    'iron-thorns': 'ironthorns',
    'iron-valiant': 'ironvaliant',
    'iron-treads': 'irontreads',
    'iron-bundle': 'ironbundle',
    'iron-hands': 'ironhands',
    'iron-jugulis': 'ironjugulis',
    'iron-moth': 'ironmoth',
    'iron-boulder': 'ironboulder',
    'iron-crown': 'ironcrown',
    'iron-leaves': 'ironleaves',
    'roaring-moon': 'roaringmoon',
    'great-tusk': 'greattusk',
    'scream-tail': 'screamtail',
    'brute-bonnet': 'brutebonnet',
    'flutter-mane': 'fluttermane',
    'slither-wing': 'slitherwing',
    'sandy-shocks': 'sandyshocks',
    'gouging-fire': 'gougingfire',
    'raging-bolt': 'ragingbolt',
    'walking-wake': 'walkingwake',
    'ting-lu': 'tinglu',
    'chien-pao': 'chienpao',
    'wo-chien': 'wochien',
    'chi-yu': 'chiyu',
    'ho-oh': 'hooh',
    'porygon-z': 'porygonz',
    'jangmo-o': 'jangmoo',
    'hakamo-o': 'hakamoo',
    'kommo-o': 'kommoo',
    'flabebe': 'flabebe',
    'sirfetchd': 'sirfetchd',
    'farfetchd': 'farfetchd',
    'darmanitan-standard': 'darmanitan',
    'darmanitan-galar-standard': 'darmanitan-galar',
    'zygarde-50': 'zygarde',
    'minior-red-meteor': 'minior',
    'mimikyu-disguised': 'mimikyu',
    'toxtricity-amped': 'toxtricity',
    'eiscue-ice': 'eiscue',
    'morpeko-full-belly': 'morpeko',
    'urshifu-single-strike': 'urshifu',
    'basculegion-male': 'basculegion',
    'enamorus-incarnate': 'enamorus',
    'ogerpon-teal-mask': 'ogerpon',
    'terapagos-normal': 'terapagos',
    'miraidon-ultimate-mode': 'miraidon',
    'koraidon-apex-build': 'koraidon',
  };

  if (specialMap[s]) return specialMap[s];

  // Forms like mega, gmax, alola, galar, hisui, paldea
  s = s
    .replace(/-mega-x$/, '-megax')
    .replace(/-mega-y$/, '-megay')
    .replace(/-rapid-strike$/, '-rapidstrike')
    .replace(/-single-strike$/, '-singlestrike')
    .replace(/-galar-zen$/, '-galarzen')
    .replace(/-dusk-mane$/, '-dusk')
    .replace(/-dawn-wings$/, '-dawn')
    .replace(/-ultra$/, '-ultra')
    .replace(/-school$/, '-school')
    .replace(/-complete$/, '-complete')
    .replace(/-10$/, '-10')
    .replace(/-hero$/, '-hero')
    .replace(/-crowned$/, '-crowned')
    .replace(/-blade$/, '-blade')
    .replace(/-shield$/, '-shield')
    .replace(/-ice$/, '-ice')
    .replace(/-shadow$/, '-shadow')
    .replace(/-origin$/, '-origin')
    .replace(/-therian$/, '-therian')
    .replace(/-primal$/, '-primal')
    .replace(/-alola$/, '-alola')
    .replace(/-galar$/, '-galar')
    .replace(/-hisui$/, '-hisui')
    .replace(/-paldea$/, '-paldea')
    .replace(/-gmax$/, '-gmax')
    .replace(/-mega$/, '-mega');

  // If there's still a hyphen and it's a standard Pokémon with hyphens, remove them
  if (s.startsWith('iron-') || s.startsWith('tapu-')) {
    s = s.replace(/-/g, '');
  }

  return s;
}

/**
 * Resolves the primary sprite URL for a given Pokemon ID, console style and shiny state.
 * Leverages Pokémon Showdown and Smogon Sprite Project CDNs with PokéAPI fallback.
 */
export function getPokemonSpriteUrl(
  id: number,
  style: SpriteStyle = 'official',
  isShiny: boolean = false,
  name?: string
): string {
  const slug = toShowdownSlug(name);

  // 1. OFICIAL HD (High definition official artwork)
  if (style === 'official') {
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  // 2. SHOWDOWN 3D ANIMATED
  if (style === 'showdown') {
    if (slug) {
      return isShiny
        ? `https://play.pokemonshowdown.com/sprites/ani-shiny/${slug}.gif`
        : `https://play.pokemonshowdown.com/sprites/ani/${slug}.gif`;
    }
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  // 3. NINTENDO DS (Gen 5 Animated for Gen 1-5; Smogon Gen 5 Pixel Art for Gen 6-9)
  if (style === 'ds') {
    if (id <= 649 && !slug.includes('-')) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    }
    // For Gen 6-9 and regional forms, use Smogon Gen 5 Sprite Project
    if (slug) {
      return isShiny
        ? `https://play.pokemonshowdown.com/sprites/gen5-shiny/${slug}.png`
        : `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`;
    }
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  // 4. GAME BOY ADVANCE (Emerald for Gen 1-3; Smogon/Gen 5 pixel art for Gen 4-9)
  if (style === 'gba') {
    if (id <= 386 && !slug.includes('-')) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${id}.png`;
    }
    if (id <= 649 && !slug.includes('-')) {
      return isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    }
    // Smogon Gen 5 pixel art works beautifully as retro GBA-style sprites
    if (slug) {
      return isShiny
        ? `https://play.pokemonshowdown.com/sprites/gen5-shiny/${slug}.png`
        : `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`;
    }
    return isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Returns a robust cascading fallback chain of URLs for a Pokémon sprite.
 * If the first CDN source returns a 404 (e.g. 3D model for an unreleased Gen 9 paradox),
 * the chain smoothly falls back to Smogon pixel art, Dex static render, or Official Artwork HD.
 */
export function getSpriteFallbackChain(
  id: number,
  style: SpriteStyle = 'official',
  isShiny: boolean = false,
  name?: string
): string[] {
  const slug = toShowdownSlug(name);
  const chain: string[] = [];

  const officialArtwork = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  const pokeApiShowdown = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${id}.gif`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;

  const showdownAni = slug
    ? isShiny
      ? `https://play.pokemonshowdown.com/sprites/ani-shiny/${slug}.gif`
      : `https://play.pokemonshowdown.com/sprites/ani/${slug}.gif`
    : pokeApiShowdown;

  const smogonGen5 = slug
    ? isShiny
      ? `https://play.pokemonshowdown.com/sprites/gen5-shiny/${slug}.png`
      : `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`
    : isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

  const showdownDex = slug
    ? `https://play.pokemonshowdown.com/sprites/dex/${slug}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${id}.png`;

  const pokeApiDefault = isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  if (style === 'official') {
    chain.push(officialArtwork, showdownDex, pokeApiDefault);
  } else if (style === 'showdown') {
    chain.push(showdownAni, pokeApiShowdown, smogonGen5, showdownDex, officialArtwork, pokeApiDefault);
  } else if (style === 'ds') {
    if (id <= 649 && !slug.includes('-')) {
      chain.push(
        isShiny
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`
          : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`,
        smogonGen5,
        showdownAni,
        officialArtwork,
        pokeApiDefault
      );
    } else {
      chain.push(smogonGen5, showdownAni, showdownDex, officialArtwork, pokeApiDefault);
    }
  } else if (style === 'gba') {
    if (id <= 386 && !slug.includes('-')) {
      chain.push(
        isShiny
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/${id}.png`
          : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${id}.png`,
        smogonGen5,
        showdownAni,
        officialArtwork,
        pokeApiDefault
      );
    } else {
      chain.push(smogonGen5, showdownAni, showdownDex, officialArtwork, pokeApiDefault);
    }
  }

  // Remove duplicates while keeping order
  return Array.from(new Set(chain.filter(Boolean)));
}

/**
 * SyntheticEvent image error handler that steps through the fallback chain.
 */
export function handleSpriteErrorWithChain(
  e: React.SyntheticEvent<HTMLImageElement>,
  chain: string[]
) {
  const img = e.currentTarget;
  const currentIndex = parseInt(img.dataset.fallbackIndex || '0', 10);
  const nextIndex = currentIndex + 1;

  if (nextIndex < chain.length) {
    img.dataset.fallbackIndex = String(nextIndex);
    img.src = chain[nextIndex];
  }
}


