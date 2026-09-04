import React, { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { POKEMON_TYPES, GENERATIONS } from '../constants/pokemonData';
import type { GenerationKey, SortKey } from '../types/pokemon';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGeneration: GenerationKey;
  onSelectGeneration: (gen: GenerationKey) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  sortKey: SortKey;
  onSortChange: (sort: SortKey) => void;
  resultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedGeneration,
  onSelectGeneration,
  selectedType,
  onSelectType,
  sortKey,
  onSortChange,
  resultsCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Focus search input on pressing '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="filter-section">
      {/* Search Bar */}
      <div className="search-wrapper">
        <div className="search-input-container">
          <Search size={20} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, número (#025), tipo (fogo) ou região (kanto)..."
            aria-label="Buscar Pokémon"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Limpar pesquisa"
            >
              <X size={16} />
            </button>
          )}
          <span className="search-shortcut-badge" title="Pressione / para buscar">
            /
          </span>
        </div>
      </div>

      {/* Generation Tabs */}
      <div className="generation-tabs-container">
        <button
          className={`gen-tab-btn ${selectedGeneration === 'all' ? 'active' : ''}`}
          onClick={() => onSelectGeneration('all')}
        >
          <span className="gen-title">Todas as</span>
          <span className="gen-region">Gerações</span>
        </button>

        {GENERATIONS.map((gen) => (
          <button
            key={gen.id}
            className={`gen-tab-btn ${selectedGeneration === gen.id ? 'active' : ''}`}
            onClick={() => onSelectGeneration(gen.id as GenerationKey)}
          >
            <span className="gen-title">{gen.name}</span>
            <span className="gen-region">{gen.region}</span>
          </button>
        ))}
      </div>

      {/* Type Filter Pills */}
      <div className="type-pills-container">
        <button
          className={`type-pill ${selectedType === '' ? 'active' : ''}`}
          onClick={() => onSelectType('')}
          style={
            selectedType === ''
              ? {
                  background: 'linear-gradient(135deg, #ef4444 0%, #38bdf8 100%)',
                }
              : undefined
          }
        >
          Todos os Tipos
        </button>

        {Object.values(POKEMON_TYPES).map((type) => {
          const isSelected = selectedType === type.name;
          return (
            <button
              key={type.name}
              className={`type-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectType(isSelected ? '' : type.name)}
              style={
                isSelected
                  ? {
                      background: type.bgGradient,
                      '--glow-color': type.glow,
                    } as React.CSSProperties
                  : undefined
              }
            >
              <span
                className="type-pill-dot"
                style={{ backgroundColor: type.color }}
              />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Results Controls Bar */}
      <div className="controls-bar">
        <div className="results-count">
          Mostrando <strong>{resultsCount}</strong> Pokémon encontrados
        </div>

        <div className="sort-select-wrapper">
          <SlidersHorizontal size={16} className="sort-label" />
          <span className="sort-label">Ordenar:</span>
          <select
            className="sort-select"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label="Opções de ordenação"
          >
            <option value="id-asc">Número (# Crescente)</option>
            <option value="id-desc">Número (# Decrescente)</option>
            <option value="name-asc">Nome (A - Z)</option>
            <option value="name-desc">Nome (Z - A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
