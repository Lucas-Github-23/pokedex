import React from 'react';
import type { PokemonListItem } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { SearchX, ArrowDownCircle } from 'lucide-react';

interface PokemonListProps {
  pokemonList: PokemonListItem[];
  loading: boolean;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
  onSelectPokemon: (id: number) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  totalFilteredCount: number;
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
}) => {
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
    return (
      <div className="empty-state">
        <SearchX size={48} className="empty-state-icon" color="#94a3b8" />
        <h3>Nenhum Pokémon encontrado</h3>
        <p>Tente ajustar os termos de busca, limpar os filtros de tipo ou trocar a geração selecionada.</p>
      </div>
    );
  }

  return (
    <>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={isFavorite(pokemon.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelectPokemon}
          />
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 36, marginBottom: 20 }}>
          <button
            className="control-pill-btn"
            onClick={onLoadMore}
            style={{
              margin: '0 auto',
              padding: '12px 28px',
              fontSize: '1rem',
              borderColor: 'var(--poke-cyan)',
              color: 'var(--text-primary)',
              background: 'rgba(15, 23, 42, 0.8)',
            }}
          >
            <ArrowDownCircle size={20} color="#38bdf8" />
            <span>
              Carregar Mais ({pokemonList.length} de {totalFilteredCount})
            </span>
          </button>
        </div>
      )}
    </>
  );
};
