export interface TypeConfig {
  name: string;
  label: string;
  color: string;
  bgGradient: string;
  textColor: string;
  glow: string;
}

export const POKEMON_TYPES: Record<string, TypeConfig> = {
  normal: {
    name: 'normal',
    label: 'Normal',
    color: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    textColor: '#ffffff',
    glow: 'rgba(148, 163, 184, 0.4)',
  },
  fire: {
    name: 'fire',
    label: 'Fogo',
    color: '#f97316',
    bgGradient: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
    textColor: '#ffffff',
    glow: 'rgba(249, 115, 22, 0.5)',
  },
  water: {
    name: 'water',
    label: 'Água',
    color: '#38bdf8',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    textColor: '#ffffff',
    glow: 'rgba(56, 189, 248, 0.5)',
  },
  grass: {
    name: 'grass',
    label: 'Planta',
    color: '#22c55e',
    bgGradient: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
    textColor: '#ffffff',
    glow: 'rgba(34, 197, 94, 0.5)',
  },
  electric: {
    name: 'electric',
    label: 'Elétrico',
    color: '#eab308',
    bgGradient: 'linear-gradient(135deg, #ca8a04 0%, #facc15 100%)',
    textColor: '#1e293b',
    glow: 'rgba(234, 179, 8, 0.5)',
  },
  ice: {
    name: 'ice',
    label: 'Gelo',
    color: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #0891b2 0%, #67e8f9 100%)',
    textColor: '#ffffff',
    glow: 'rgba(6, 182, 212, 0.5)',
  },
  fighting: {
    name: 'fighting',
    label: 'Lutador',
    color: '#dc2626',
    bgGradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
    textColor: '#ffffff',
    glow: 'rgba(220, 38, 38, 0.5)',
  },
  poison: {
    name: 'poison',
    label: 'Venenoso',
    color: '#a855f7',
    bgGradient: 'linear-gradient(135deg, #7e22ce 0%, #c084fc 100%)',
    textColor: '#ffffff',
    glow: 'rgba(168, 85, 247, 0.5)',
  },
  ground: {
    name: 'ground',
    label: 'Terra',
    color: '#d97706',
    bgGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    textColor: '#ffffff',
    glow: 'rgba(217, 119, 6, 0.5)',
  },
  flying: {
    name: 'flying',
    label: 'Voador',
    color: '#818cf8',
    bgGradient: 'linear-gradient(135deg, #4f46e5 0%, #a5b4fc 100%)',
    textColor: '#ffffff',
    glow: 'rgba(129, 140, 248, 0.5)',
  },
  psychic: {
    name: 'psychic',
    label: 'Psíquico',
    color: '#ec4899',
    bgGradient: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
    textColor: '#ffffff',
    glow: 'rgba(236, 72, 153, 0.5)',
  },
  bug: {
    name: 'bug',
    label: 'Inseto',
    color: '#84cc16',
    bgGradient: 'linear-gradient(135deg, #65a30d 0%, #a3e635 100%)',
    textColor: '#ffffff',
    glow: 'rgba(132, 204, 22, 0.5)',
  },
  rock: {
    name: 'rock',
    label: 'Pedra',
    color: '#78716c',
    bgGradient: 'linear-gradient(135deg, #57534e 0%, #a8a29e 100%)',
    textColor: '#ffffff',
    glow: 'rgba(120, 113, 108, 0.5)',
  },
  ghost: {
    name: 'ghost',
    label: 'Fantasma',
    color: '#6366f1',
    bgGradient: 'linear-gradient(135deg, #4338ca 0%, #818cf8 100%)',
    textColor: '#ffffff',
    glow: 'rgba(99, 102, 241, 0.5)',
  },
  dragon: {
    name: 'dragon',
    label: 'Dragão',
    color: '#6d28d9',
    bgGradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
    textColor: '#ffffff',
    glow: 'rgba(109, 40, 217, 0.5)',
  },
  steel: {
    name: 'steel',
    label: 'Aço',
    color: '#64748b',
    bgGradient: 'linear-gradient(135deg, #475569 0%, #94a3b8 100%)',
    textColor: '#ffffff',
    glow: 'rgba(100, 116, 139, 0.5)',
  },
  fairy: {
    name: 'fairy',
    label: 'Fada',
    color: '#f43f5e',
    bgGradient: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)',
    textColor: '#ffffff',
    glow: 'rgba(244, 63, 94, 0.5)',
  },
  dark: {
    name: 'dark',
    label: 'Sombrio',
    color: '#334155',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
    textColor: '#ffffff',
    glow: 'rgba(51, 65, 85, 0.5)',
  },
};

export interface GenerationConfig {
  id: string;
  name: string;
  region: string;
  range: [number, number];
}

export const GENERATIONS: GenerationConfig[] = [
  { id: '1', name: 'Geração I', region: 'Kanto', range: [1, 151] },
  { id: '2', name: 'Geração II', region: 'Johto', range: [152, 251] },
  { id: '3', name: 'Geração III', region: 'Hoenn', range: [252, 386] },
  { id: '4', name: 'Geração IV', region: 'Sinnoh', range: [387, 493] },
  { id: '5', name: 'Geração V', region: 'Unova', range: [494, 649] },
  { id: '6', name: 'Geração VI', region: 'Kalos', range: [650, 721] },
  { id: '7', name: 'Geração VII', region: 'Alola', range: [722, 809] },
  { id: '8', name: 'Geração VIII', region: 'Galar', range: [810, 905] },
  { id: '9', name: 'Geração IX', region: 'Paldea', range: [906, 1025] },
];

export const GAME_VERSION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  red: { bg: '#e57373', text: '#ffffff', border: '#c62828' },
  blue: { bg: '#64b5f6', text: '#ffffff', border: '#1565c0' },
  yellow: { bg: '#fdd835', text: '#1e293b', border: '#f57f17' },
  gold: { bg: '#ffd700', text: '#1e293b', border: '#ff8f00' },
  silver: { bg: '#cfd8dc', text: '#263238', border: '#90a4ae' },
  crystal: { bg: '#80deea', text: '#006064', border: '#00bcd4' },
  ruby: { bg: '#e53935', text: '#ffffff', border: '#b71c1c' },
  sapphire: { bg: '#1e88e5', text: '#ffffff', border: '#0d47a1' },
  emerald: { bg: '#43a047', text: '#ffffff', border: '#1b5e20' },
  'firered': { bg: '#ff7043', text: '#ffffff', border: '#d84315' },
  'leafgreen': { bg: '#66bb6a', text: '#ffffff', border: '#2e7d32' },
  diamond: { bg: '#64b5f6', text: '#ffffff', border: '#1976d2' },
  pearl: { bg: '#f48fb1', text: '#880e4f', border: '#e91e63' },
  platinum: { bg: '#b0bec5', text: '#263238', border: '#78909c' },
  heartgold: { bg: '#ffd54f', text: '#1e293b', border: '#fbc02d' },
  soulsilver: { bg: '#cfd8dc', text: '#263238', border: '#90a4ae' },
  black: { bg: '#212121', text: '#ffffff', border: '#000000' },
  white: { bg: '#eceff1', text: '#263238', border: '#cfd8dc' },
  'black-2': { bg: '#212121', text: '#ffffff', border: '#000000' },
  'white-2': { bg: '#eceff1', text: '#263238', border: '#cfd8dc' },
  x: { bg: '#1e88e5', text: '#ffffff', border: '#0d47a1' },
  y: { bg: '#e53935', text: '#ffffff', border: '#b71c1c' },
  'omega-ruby': { bg: '#c62828', text: '#ffffff', border: '#b71c1c' },
  'alpha-sapphire': { bg: '#1565c0', text: '#ffffff', border: '#0d47a1' },
  sun: { bg: '#fbc02d', text: '#1e293b', border: '#f57f17' },
  moon: { bg: '#7b1fa2', text: '#ffffff', border: '#4a148c' },
  'ultra-sun': { bg: '#ff5722', text: '#ffffff', border: '#bf360c' },
  'ultra-moon': { bg: '#9c27b0', text: '#ffffff', border: '#4a148c' },
  'lets-go-pikachu': { bg: '#fdd835', text: '#1e293b', border: '#f57f17' },
  'lets-go-eevee': { bg: '#8d6e63', text: '#ffffff', border: '#4e342e' },
  sword: { bg: '#1976d2', text: '#ffffff', border: '#0d47a1' },
  shield: { bg: '#c62828', text: '#ffffff', border: '#b71c1c' },
  'brilliant-diamond': { bg: '#64b5f6', text: '#ffffff', border: '#1976d2' },
  'shining-pearl': { bg: '#f48fb1', text: '#880e4f', border: '#e91e63' },
  'legends-arceus': { bg: '#37474f', text: '#ffffff', border: '#263238' },
  scarlet: { bg: '#d32f2f', text: '#ffffff', border: '#b71c1c' },
  violet: { bg: '#512da8', text: '#ffffff', border: '#311b92' },
};

export const STAT_NAMES: Record<string, { label: string; short: string; color: string }> = {
  hp: { label: 'HP', short: 'HP', color: '#22c55e' },
  attack: { label: 'Ataque', short: 'ATK', color: '#ef4444' },
  defense: { label: 'Defesa', short: 'DEF', color: '#f97316' },
  'special-attack': { label: 'Ataque Especial', short: 'SP. ATK', color: '#38bdf8' },
  'special-defense': { label: 'Defesa Especial', short: 'SP. DEF', color: '#818cf8' },
  speed: { label: 'Velocidade', short: 'SPD', color: '#ec4899' },
};
