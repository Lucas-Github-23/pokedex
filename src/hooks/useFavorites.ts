import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { PokemonListItem } from '../types/pokemon';
import { POKEMON_TYPES_MAP } from '../constants/pokemonTypes';

const STORAGE_KEY = 'pokedex_favorites_v1';

function normalizeFavoriteItem(item: any): PokemonListItem | null {
  if (!item || typeof item.id !== 'number' || isNaN(item.id)) {
    return null;
  }
  const id = item.id;
  const name = typeof item.name === 'string' && item.name.trim() ? item.name.trim() : `pokemon-${id}`;
  const sprite =
    typeof item.sprite === 'string' && item.sprite
      ? item.sprite
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const types =
    Array.isArray(item.types) && item.types.length > 0
      ? item.types
      : POKEMON_TYPES_MAP[id] || ['normal'];

  return {
    id,
    name,
    url: item.url || `https://pokeapi.co/api/v2/pokemon/${id}`,
    sprite,
    types,
    japaneseName: item.japaneseName,
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<PokemonListItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeFavoriteItem).filter((p): p is PokemonListItem => p !== null);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((p) => p.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (pokemon: PokemonListItem, event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      setFavorites((prev) => {
        const exists = prev.some((p) => p.id === pokemon.id);
        if (exists) {
          return prev.filter((p) => p.id !== pokemon.id);
        } else {
          // Trigger confetti celebration!
          try {
            const originX = event ? event.clientX / window.innerWidth : 0.5;
            const originY = event ? event.clientY / window.innerHeight : 0.5;
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { x: originX, y: originY },
              colors: ['#ef4444', '#facc15', '#38bdf8', '#a855f7'],
              ticks: 150,
              gravity: 1.2,
            });
          } catch {
            // Ignore confetti errors
          }

          const normalized = normalizeFavoriteItem(pokemon) || pokemon;
          return [...prev, normalized];
        }
      });
    },
    []
  );

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearAllFavorites,
    count: favorites.length,
  };
}

