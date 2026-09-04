import React, { useRef, useEffect } from 'react';
import { Crosshair, X, SlidersHorizontal } from 'lucide-react';
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

  // Focus on pressing '/'
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
    <div className="filter-assembly">
      {/* Scanner Frequency Search Bar */}
      <div className="scanner-search-box">
        <Crosshair size={20} className="scanner-icon" />
        <input
          ref={searchInputRef}
          type="text"
          className="scanner-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rastrear espécime por nome, código (#025), tipo (fogo) ou região (kanto)..."
          aria-label="Buscar Pokémon no Scanner"
        />
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Limpar rastreador"
          >
            <X size={16} />
          </button>
        )}
        <span className="scanner-shortcut">RADAR [/]</span>
      </div>

      {/* Generation Hardware Cartridges */}
      <div className="generation-switchboard">
        <button
          className={`gen-cartridge-btn ${selectedGeneration === 'all' ? 'active' : ''}`}
          onClick={() => onSelectGeneration('all')}
        >
          <span className="gen-code">NATIONAL</span>
          <span className="gen-name">Todas as Regiões</span>
        </button>

        {GENERATIONS.map((gen) => (
          <button
            key={gen.id}
            className={`gen-cartridge-btn ${selectedGeneration === gen.id ? 'active' : ''}`}
            onClick={() => onSelectGeneration(gen.id as GenerationKey)}
          >
            <span className="gen-code">GEN 0{gen.id}</span>
            <span className="gen-name">{gen.region}</span>
          </button>
        ))}
      </div>

      {/* Type Power Cell Matrix */}
      <div className="type-filter-matrix">
        <button
          className={`type-cell-btn ${selectedType === '' ? 'active' : ''}`}
          onClick={() => onSelectType('')}
        >
          TODOS OS TIPOS
        </button>

        {Object.values(POKEMON_TYPES).map((type) => {
          const isSelected = selectedType === type.name;
          return (
            <button
              key={type.name}
              className={`type-cell-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectType(isSelected ? '' : type.name)}
              style={
                isSelected
                  ? ({
                      background: type.bgGradient,
                      '--glow-color': type.glow,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <span
                className="type-cell-dot"
                style={{ backgroundColor: type.color }}
              />
              {type.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* HUD Telemetry Readout & Sort */}
      <div className="hud-controls-bar">
        <div className="hud-counter-text">
          ESPÉCIMES RASTREADOS: <strong>{resultsCount}</strong>
        </div>

        <div className="hud-sort-box">
          <SlidersHorizontal size={14} color="#38bdf8" />
          <span className="hud-sort-label">ORDENAÇÃO:</span>
          <select
            className="hud-sort-select"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label="Ordenação de espécimes"
          >
            <option value="id-asc">CÓDIGO (# CRESCENTE)</option>
            <option value="id-desc">CÓDIGO (# DECRESCENTE)</option>
            <option value="name-asc">NOME (A - Z)</option>
            <option value="name-desc">NOME (Z - A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
