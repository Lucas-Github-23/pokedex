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

export type SortKey =
  | 'id-asc'
  | 'id-desc'
  | 'name-asc'
  | 'name-desc'
  | 'bst-desc'
  | 'bst-asc'
  | 'hp-desc'
  | 'atk-desc'
  | 'def-desc'
  | 'spa-desc'
  | 'spd-desc'
  | 'spe-desc'
  | 'weight-desc'
  | 'weight-asc'
  | 'height-desc'
  | 'height-asc';

export type EvolutionStageFilter = 'base' | 'middle' | 'final' | 'single';

export type CategoryFilter =
  | 'starter'
  | 'legendary'
  | 'mythical'
  | 'paradox'
  | 'ultrabeast'
  | 'baby'
  | 'fossil'
  | 'pseudolegendary'
  | 'forms';

export type HeightClassFilter = 'any' | 'small' | 'medium' | 'large' | 'colossal';
export type WeightClassFilter = 'any' | 'feather' | 'light' | 'medium' | 'heavy' | 'colossal';
export type TypeFilterMode = 'any' | 'mono' | 'dual' | 'exact';

export interface AdvancedFilters {
  primaryType: string;
  secondaryType: string;
  typeMode: TypeFilterMode;
  generations: string[];
  categories: CategoryFilter[];
  evolutionStages: EvolutionStageFilter[];
  minBst: number;
  maxBst: number;
  dominantStat: string;
  minStat: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  heightClass: HeightClassFilter;
  weightClass: WeightClassFilter;
}

export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  primaryType: '',
  secondaryType: '',
  typeMode: 'any',
  generations: [],
  categories: [],
  evolutionStages: [],
  minBst: 180,
  maxBst: 780,
  dominantStat: '',
  minStat: {
    hp: 0,
    atk: 0,
    def: 0,
    spa: 0,
    spd: 0,
    spe: 0,
  },
  heightClass: 'any',
  weightClass: 'any',
};

