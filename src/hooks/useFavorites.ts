import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { PokemonListItem } from '../types/pokemon';

const STORAGE_KEY = 'pokedex_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<PokemonListItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
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
          return [...prev, pokemon];
        }
      });
    },
    []
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    count: favorites.length,
  };
}
