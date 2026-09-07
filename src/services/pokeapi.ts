import type {
  PokemonListItem,
  PokemonDetail,
  EvolutionStage,
  GameLocations,
  PokemonSpeciesData,
  PokemonVariety,
} from '../types/pokemon';
import { GAME_VERSION_COLORS } from '../constants/pokemonData';
import { POKEMON_TYPES_MAP } from '../constants/pokemonTypes';
import { formatVarietyInfo, isMeaningfulVariety } from '../constants/pokemonForms';

const BASE_URL = 'https://pokeapi.co/api/v2';

// In-memory cache
const pokemonListCache: PokemonListItem[] = [];
const detailCache = new Map<string | number, PokemonDetail>();
const speciesCache = new Map<string, any>();
const evolutionCache = new Map<string, EvolutionStage[]>();
const locationsCache = new Map<string, GameLocations[]>();

export function getPokemonIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export function getOfficialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getShinySpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
}

export function getOfficialShinyArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
}

export async function fetchAllPokemonList(): Promise<PokemonListItem[]> {
  if (pokemonListCache.length > 0) {
    return pokemonListCache;
  }

  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=1025`);
    if (!response.ok) throw new Error('Falha ao buscar lista de Pokémon');
    const data = await response.json();

    const items: PokemonListItem[] = data.results.map((entry: { name: string; url: string }) => {
      const id = getPokemonIdFromUrl(entry.url);
      return {
        name: entry.name,
        id,
        url: entry.url,
        sprite: getOfficialArtworkUrl(id),
        types: POKEMON_TYPES_MAP[id] || [],
      };
    });

    pokemonListCache.push(...items);
    return items;
  } catch (error) {
    console.error('Erro ao buscar lista de Pokémon:', error);
    throw error;
  }
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const cacheKey = String(idOrName).toLowerCase();
  if (detailCache.has(cacheKey)) {
    return detailCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`${BASE_URL}/pokemon/${cacheKey}`);
    if (!response.ok) throw new Error(`Pokémon não encontrado: ${idOrName}`);
    const data = await response.json();

    const stats = data.stats.map((s: any) => ({
      name: s.stat.name,
      base_stat: s.base_stat,
    }));

    const baseStatTotal = stats.reduce((acc: number, cur: { base_stat: number }) => acc + cur.base_stat, 0);

    const types = data.types.map((t: any) => t.type.name);

    const abilities = data.abilities.map((a: any) => ({
      name: a.ability.name,
      is_hidden: a.is_hidden,
    }));

    const detail: PokemonDetail = {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types,
      stats,
      baseStatTotal,
      abilities,
      spriteDefault: data.sprites?.front_default || getSpriteUrl(data.id),
      spriteOfficialArtwork:
        data.sprites?.other?.['official-artwork']?.front_default ||
        getOfficialArtworkUrl(data.id),
      spriteShiny:
        data.sprites?.other?.['official-artwork']?.front_shiny ||
        getOfficialShinyArtworkUrl(data.id) ||
        data.sprites?.front_shiny,
      spriteAnimated:
        data.sprites?.other?.showdown?.front_default ||
        data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default,
      cryUrl: data.cries?.latest || `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`,
      speciesUrl: data.species.url,
      locationEncountersUrl: data.location_area_encounters,
    };

    detailCache.set(cacheKey, detail);
    detailCache.set(data.id, detail);
    return detail;
  } catch (error) {
    console.error('Erro ao buscar detalhes do Pokémon:', error);
    throw error;
  }
}

export async function fetchPokemonSpecies(speciesUrl: string): Promise<PokemonSpeciesData> {
  if (speciesCache.has(speciesUrl)) {
    return speciesCache.get(speciesUrl);
  }

  try {
    const response = await fetch(speciesUrl);
    const data = await response.json();

    // Extract Japanese Katakana name
    const jaEntry = data.names?.find(
      (n: any) => n.language.name === 'ja-hrkt' || n.language.name === 'ja'
    );
    const japaneseName = jaEntry?.name || '';

    // Find flavor text in pt-BR or en
    const ptEntry = data.flavor_text_entries?.find(
      (entry: any) => entry.language.name === 'pt' || entry.language.name === 'pt-br'
    );
    const enEntry = data.flavor_text_entries?.find(
      (entry: any) => entry.language.name === 'en'
    );
    const rawText = (ptEntry || enEntry)?.flavor_text || '';
    const flavorText = rawText.replace(/[\n\f\r]/g, ' ');

    const genusEntry = data.genera?.find(
      (g: any) => g.language.name === 'pt' || g.language.name === 'en'
    );
    const genus = genusEntry?.genus || 'Pokémon';

    // Parse varieties, filtering out non-visual/phantom internal ride forms
    const varieties: PokemonVariety[] = (data.varieties || [])
      .filter((v: any) => isMeaningfulVariety(v.pokemon.name, v.is_default))
      .map((v: any) => {
        const varietyId = getPokemonIdFromUrl(v.pokemon.url);
        const info = formatVarietyInfo(v.pokemon.name, data.name || '', v.is_default);
        return {
          id: varietyId,
          name: v.pokemon.name,
          url: v.pokemon.url,
          is_default: v.is_default,
          displayName: info.displayName,
          category: info.category,
          tag: info.tag,
        };
      });

    const result: PokemonSpeciesData = {
      evolutionChainUrl: data.evolution_chain?.url || '',
      flavorText,
      genus,
      generation: data.generation?.name || '',
      japaneseName,
      varieties,
    };

    speciesCache.set(speciesUrl, result);
    return result;
  } catch (error) {
    console.error('Erro ao buscar espécie do Pokémon:', error);
    return {
      evolutionChainUrl: '',
      flavorText: '',
      genus: 'Pokémon',
      generation: '',
      japaneseName: '',
      varieties: [],
    };
  }
}

export async function fetchEvolutionChain(chainUrl: string): Promise<EvolutionStage[]> {
  if (!chainUrl) return [];
  if (evolutionCache.has(chainUrl)) {
    return evolutionCache.get(chainUrl)!;
  }

  try {
    const response = await fetch(chainUrl);
    const data = await response.json();

    const stages: EvolutionStage[] = [];

    function traverse(node: any) {
      if (!node) return;
      const id = getPokemonIdFromUrl(node.species.url);
      const details = node.evolution_details?.[0];

      stages.push({
        id,
        name: node.species.name,
        sprite: getOfficialArtworkUrl(id),
        minLevel: details?.min_level || null,
        triggerName: details?.trigger?.name,
        item: details?.item?.name || null,
      });

      if (node.evolves_to && node.evolves_to.length > 0) {
        // Can have branching evolutions e.g. Eevee, Tyrogue, Wurmple
        node.evolves_to.forEach((subNode: any) => traverse(subNode));
      }
    }

    traverse(data.chain);
    evolutionCache.set(chainUrl, stages);
    return stages;
  } catch (error) {
    console.error('Erro ao buscar cadeia de evolução:', error);
    return [];
  }
}

export async function fetchPokemonLocations(locationsUrl: string): Promise<GameLocations[]> {
  if (!locationsUrl) return [];
  if (locationsCache.has(locationsUrl)) {
    return locationsCache.get(locationsUrl)!;
  }

  try {
    const response = await fetch(locationsUrl);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Group locations by game version (like original details.js)
    const grouped: Record<string, string[]> = {};

    data.forEach((location: any) => {
      const areaName = location.location_area.name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l: string) => l.toUpperCase());

      location.version_details.forEach((detail: any) => {
        const gameName = detail.version.name;
        if (!grouped[gameName]) {
          grouped[gameName] = [];
        }
        if (!grouped[gameName].includes(areaName)) {
          grouped[gameName].push(areaName);
        }
      });
    });

    const result: GameLocations[] = Object.keys(grouped).map((game) => {
      const normalizedGame = game.toLowerCase();
      const hasColor = GAME_VERSION_COLORS[normalizedGame];
      return {
        game: game.replace(/-/g, ' ').toUpperCase(),
        locations: grouped[game],
        colorClass: hasColor ? normalizedGame : 'default',
      };
    });

    locationsCache.set(locationsUrl, result);
    return result;
  } catch (error) {
    console.error('Erro ao buscar locais do Pokémon:', error);
    return [];
  }
}

export async function fetchPokemonByType(type: string): Promise<PokemonListItem[]> {
  try {
    const response = await fetch(`${BASE_URL}/type/${type.toLowerCase()}`);
    if (!response.ok) throw new Error(`Tipo não encontrado: ${type}`);
    const data = await response.json();

    return data.pokemon.map((entry: any) => {
      const id = getPokemonIdFromUrl(entry.pokemon.url);
      return {
        name: entry.pokemon.name,
        id,
        url: entry.pokemon.url,
        sprite: getOfficialArtworkUrl(id),
        types: POKEMON_TYPES_MAP[id] || [type.toLowerCase()],
      };
    });
  } catch (error) {
    console.error('Erro ao buscar Pokémon por tipo:', error);
    return [];
  }
}
