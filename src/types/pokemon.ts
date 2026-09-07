export interface PokemonListItem {
  name: string;
  id: number;
  url: string;
  sprite: string;
  types?: string[];
  japaneseName?: string;
}

export interface PokemonStat {
  name: string;
  base_stat: number;
}

export interface PokemonAbility {
  name: string;
  is_hidden: boolean;
}

export interface PokemonDetail {
  id: number;
  name: string;
  japaneseName?: string;
  height: number; // in decimeters from API
  weight: number; // in hectograms from API
  types: string[];
  stats: PokemonStat[];
  baseStatTotal: number;
  abilities: PokemonAbility[];
  spriteDefault: string;
  spriteOfficialArtwork: string;
  spriteShiny: string;
  spriteAnimated?: string;
  cryUrl?: string;
  speciesUrl: string;
  locationEncountersUrl: string;
}

export interface EvolutionStage {
  id: number;
  name: string;
  sprite: string;
  minLevel?: number | null;
  triggerName?: string;
  item?: string | null;
}

export interface LocationAreaDetail {
  areaName: string;
  rawName: string;
  maxChance?: number;
  methods?: string[];
  minLevel?: number | null;
  maxLevel?: number | null;
}

export interface GameLocations {
  game: string;
  gameId: string;
  generation: number;
  genName: string;
  consoleName: string;
  region: string;
  locations: string[];
  areas: LocationAreaDetail[];
  colorClass: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  badgeBg: string;
  group: 'gen1-3' | 'gen4-5' | 'gen6-7' | 'gen8-9';
}

export type FormCategory =
  | 'default'
  | 'mega'
  | 'gmax'
  | 'alola'
  | 'galar'
  | 'hisui'
  | 'paldea'
  | 'primal'
  | 'origin'
  | 'totem'
  | 'special';

export interface PokemonVariety {
  id: number;
  name: string;
  url: string;
  is_default: boolean;
  displayName: string;
  category: FormCategory;
  tag: string;
}

export interface PokemonSpeciesData {
  evolutionChainUrl: string;
  flavorText: string;
  genus: string;
  generation: string;
  japaneseName: string;
  varieties: PokemonVariety[];
}

export type GenerationKey = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type SortKey = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc' | 'stat-desc';

