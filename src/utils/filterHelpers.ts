import type { AdvancedFilters, CategoryFilter, EvolutionStageFilter } from '../types/pokemon';
import { POKEMON_TYPES } from '../constants/pokemonData';
import { STAT_NAMES } from '../constants/pokemonData';

export interface ActiveFilterChip {
  id: string;
  label: string;
  type: string;
  onRemove: () => void;
}

export const CATEGORY_LABELS: Record<CategoryFilter, { label: string; tag: string; color: string }> = {
  starter: { label: 'Iniciais (Starters)', tag: 'INICIAL', color: '#22c55e' },
  legendary: { label: 'Lendários', tag: 'LENDÁRIO', color: '#f59e0b' },
  mythical: { label: 'Míticos', tag: 'MÍTICO', color: '#ec4899' },
  paradox: { label: 'Paradox (Passado/Futuro)', tag: 'PARADOX', color: '#06b6d4' },
  ultrabeast: { label: 'Ultra Beasts', tag: 'ULTRA BEAST', color: '#a855f7' },
  baby: { label: 'Bebês (Baby Pokémon)', tag: 'BEBÊ', color: '#fb7185' },
  fossil: { label: 'Fósseis Pré-Históricos', tag: 'FÓSSIL', color: '#d97706' },
  pseudolegendary: { label: 'Pseudo-Lendários (BST 600)', tag: 'PSEUDO', color: '#8b5cf6' },
  forms: { label: 'Possui Formas Alternativas', tag: 'VARIANTES', color: '#38bdf8' },
};

export const STAGE_LABELS: Record<EvolutionStageFilter, { label: string; desc: string }> = {
  base: { label: 'Estágio Básico', desc: 'Primeiro estágio que pode evoluir' },
  middle: { label: 'Estágio Intermediário', desc: 'Segunda evolução (ex: Charmeleon)' },
  final: { label: 'Estágio Final', desc: 'Evolução máxima atingida' },
  single: { label: 'Sem Evolução (Único)', desc: 'Não evolui de nem para outro' },
};

export const HEIGHT_CLASSES = {
  small: { label: 'Pequeno (< 0.5 m)', min: 0, max: 0.5 },
  medium: { label: 'Médio (0.5 – 1.5 m)', min: 0.5, max: 1.5 },
  large: { label: 'Grande (1.5 – 3.0 m)', min: 1.5, max: 3.0 },
  colossal: { label: 'Colossal (> 3.0 m)', min: 3.0, max: 999 },
};

export const WEIGHT_CLASSES = {
  feather: { label: 'Pena (< 10 kg)', min: 0, max: 10 },
  light: { label: 'Leve (10 – 50 kg)', min: 10, max: 50 },
  medium: { label: 'Médio (50 – 150 kg)', min: 50, max: 150 },
  heavy: { label: 'Pesado (150 – 300 kg)', min: 150, max: 300 },
  colossal: { label: 'Super Pesado (> 300 kg)', min: 300, max: 9999 },
};

/**
 * Counts total active filter criteria
 */
export function countActiveFilters(filters: AdvancedFilters): number {
  let count = 0;
  if (filters.primaryType) count++;
  if (filters.secondaryType) count++;
  if (filters.typeMode !== 'any') count++;
  count += filters.generations.length;
  count += filters.categories.length;
  count += filters.evolutionStages.length;
  if (filters.minBst > 180 || filters.maxBst < 780) count++;
  if (filters.dominantStat) count++;
  Object.values(filters.minStat).forEach((v) => {
    if (v > 0) count++;
  });
  if (filters.heightClass !== 'any') count++;
  if (filters.weightClass !== 'any') count++;
  return count;
}

/**
 * Builds a list of active chips for the HUD
 */
export function getActiveFilterChips(
  filters: AdvancedFilters,
  onUpdate: (updater: (prev: AdvancedFilters) => AdvancedFilters) => void
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.primaryType) {
    const label = POKEMON_TYPES[filters.primaryType]?.label || filters.primaryType;
    chips.push({
      id: 'primaryType',
      label: `Tipo 1: ${label}`,
      type: 'type',
      onRemove: () => onUpdate((f) => ({ ...f, primaryType: '' })),
    });
  }

  if (filters.secondaryType) {
    const label = POKEMON_TYPES[filters.secondaryType]?.label || filters.secondaryType;
    chips.push({
      id: 'secondaryType',
      label: `Tipo 2: ${label}`,
      type: 'type',
      onRemove: () => onUpdate((f) => ({ ...f, secondaryType: '' })),
    });
  }

  if (filters.typeMode === 'mono') {
    chips.push({
      id: 'typeMode',
      label: 'Somente Mono-tipo',
      type: 'typeMode',
      onRemove: () => onUpdate((f) => ({ ...f, typeMode: 'any' })),
    });
  } else if (filters.typeMode === 'dual') {
    chips.push({
      id: 'typeMode',
      label: 'Somente Dual-tipo (2 tipos)',
      type: 'typeMode',
      onRemove: () => onUpdate((f) => ({ ...f, typeMode: 'any' })),
    });
  }

  filters.generations.forEach((gen) => {
    chips.push({
      id: `gen-${gen}`,
      label: `Geração ${gen}`,
      type: 'generation',
      onRemove: () =>
        onUpdate((f) => ({ ...f, generations: f.generations.filter((g) => g !== gen) })),
    });
  });

  filters.categories.forEach((cat) => {
    const meta = CATEGORY_LABELS[cat] || { label: cat };
    chips.push({
      id: `cat-${cat}`,
      label: meta.label,
      type: 'category',
      onRemove: () =>
        onUpdate((f) => ({ ...f, categories: f.categories.filter((c) => c !== cat) })),
    });
  });

  filters.evolutionStages.forEach((stage) => {
    const meta = STAGE_LABELS[stage] || { label: stage };
    chips.push({
      id: `stage-${stage}`,
      label: meta.label,
      type: 'stage',
      onRemove: () =>
        onUpdate((f) => ({
          ...f,
          evolutionStages: f.evolutionStages.filter((s) => s !== stage),
        })),
    });
  });

  if (filters.minBst > 180 || filters.maxBst < 780) {
    chips.push({
      id: 'bstRange',
      label: `BST: ${filters.minBst} – ${filters.maxBst}`,
      type: 'stat',
      onRemove: () => onUpdate((f) => ({ ...f, minBst: 180, maxBst: 780 })),
    });
  }

  if (filters.dominantStat) {
    const statName = STAT_NAMES[filters.dominantStat]?.label || filters.dominantStat.toUpperCase();
    chips.push({
      id: 'dominantStat',
      label: `Maior Atributo: ${statName}`,
      type: 'stat',
      onRemove: () => onUpdate((f) => ({ ...f, dominantStat: '' })),
    });
  }

  (Object.keys(filters.minStat) as Array<keyof typeof filters.minStat>).forEach((stat) => {
    const val = filters.minStat[stat];
    if (val > 0) {
      const meta = STAT_NAMES[stat] || { short: stat.toUpperCase() };
      chips.push({
        id: `minStat-${stat}`,
        label: `${meta.short} ≥ ${val}`,
        type: 'stat',
        onRemove: () =>
          onUpdate((f) => ({
            ...f,
            minStat: { ...f.minStat, [stat]: 0 },
          })),
      });
    }
  });

  if (filters.heightClass !== 'any') {
    const meta = HEIGHT_CLASSES[filters.heightClass];
    chips.push({
      id: 'heightClass',
      label: `Porte: ${meta?.label || filters.heightClass}`,
      type: 'bio',
      onRemove: () => onUpdate((f) => ({ ...f, heightClass: 'any' })),
    });
  }

  if (filters.weightClass !== 'any') {
    const meta = WEIGHT_CLASSES[filters.weightClass];
    chips.push({
      id: 'weightClass',
      label: `Peso: ${meta?.label || filters.weightClass}`,
      type: 'bio',
      onRemove: () => onUpdate((f) => ({ ...f, weightClass: 'any' })),
    });
  }

  return chips;
}
