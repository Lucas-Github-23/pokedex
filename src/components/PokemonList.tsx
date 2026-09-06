import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { PokemonListItem } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { SearchX, Loader2, CheckCircle2, Radio, Heart } from 'lucide-react';

import type { SpriteStyle } from '../constants/spriteStyles';

interface PokemonListProps {
  pokemonList: PokemonListItem[];
  loading: boolean;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
  onSelectPokemon: (id: number) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  totalFilteredCount: number;
  spriteStyle?: SpriteStyle;
  onlyFavorites?: boolean;
}

export const PokemonList: React.FC<PokemonListProps> = ({
  pokemonList,
  loading,
  isFavorite,
  onToggleFavorite,
  onSelectPokemon,
  hasMore,
  onLoadMore,
  totalFilteredCount,
  spriteStyle = 'official',
  onlyFavorites = false,
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  // Trigger gradual automatic load when sentinel is approached
  const triggerAutoLoad = useCallback(() => {
    if (!hasMore || isAutoLoading || loading) return;
    setIsAutoLoading(true);
    onLoadMore();
    // Brief throttle to smoothly stream in items and avoid scroll thrashing
    setTimeout(() => {
      setIsAutoLoading(false);
    }, 220);
  }, [hasMore, isAutoLoading, loading, onLoadMore]);

  // Automatic infinite scroll using IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          triggerAutoLoad();
        }
      },
      {
        root: null, // observe relative to window/viewport
        rootMargin: '450px', // preload before user hits bottom for seamless flow
        threshold: 0.05,
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, triggerAutoLoad]);

  if (loading && pokemonList.length === 0) {
    return (
      <div className="pokemon-grid">
        {Array.from({ length: 18 }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-shimmer" />
            <div className="skeleton-circle" />
            <div className="skeleton-line" />
            <div className="skeleton-line" style={{ width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && pokemonList.length === 0) {
    if (onlyFavorites) {
      return (
        <div className="empty-state">
          <div className="drawer-empty-icon-box" style={{ margin: '0 auto 16px' }}>
            <Heart size={44} color="#ef4444" />
          </div>
          <h3>Nenhum Pokémon Favoritado</h3>
          <p>
            Você ainda não favoritou nenhum Pokémon ou os filtros atuais não correspondem aos seus favoritos.
            Clique no ícone de coração nos cards para adicionar!
          </p>
        </div>
      );
    }

    return (
      <div className="empty-state">
        <SearchX size={48} className="empty-state-icon" color="#94a3b8" />
        <h3>Nenhum Pokémon encontrado</h3>
        <p>Tente ajustar os termos de busca, limpar os filtros de tipo ou trocar a geração selecionada.</p>
      </div>
    );
  }

  const progressPercent = totalFilteredCount > 0
    ? Math.min(100, Math.round((pokemonList.length / totalFilteredCount) * 100))
    : 100;

  return (
    <>
      {/* Pokemon Specimen Grid */}
      <div className="pokemon-specimen-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={isFavorite(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelectPokemon}
            spriteStyle={spriteStyle}
          />
        ))}
      </div>

      {/* Gradual Automatic Loading Telemetry Indicator & Sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="auto-scroll-sentinel">
          <div className="telemetry-radar-loader">
            <div className="telemetry-loader-top">
              <Radio size={16} className="radar-ping-icon" />
              <span className="radar-pulse-dot" />
              <span className="telemetry-loader-label">
                RADAR BIOMÉTRICO ATIVO // CARREGAMENTO GRADUAL AUTOMÁTICO
              </span>
              <Loader2 size={16} className="telemetry-spinner" />
            </div>

            <div className="telemetry-progress-wrapper">
              <div className="telemetry-progress-info">
                <span>SINCRONIZANDO ESPÉCIMES</span>
                <span>
                  {pokemonList.length} de {totalFilteredCount} ({progressPercent}%)
                </span>
              </div>
              <div className="telemetry-progress-track">
                <div
                  className="telemetry-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Indicator when all filtered specimens have been loaded */}
      {!hasMore && pokemonList.length > 0 && (
        <div className="auto-scroll-completed">
          <div className="completed-divider" />
          <div className="completed-badge">
            <CheckCircle2 size={16} color="var(--lens-cyan)" />
            <span>TODOS OS {totalFilteredCount} ESPÉCIMES INDEXADOS NO TERMINAL</span>
          </div>
          <div className="completed-divider" />
        </div>
      )}
    </>
  );
};
