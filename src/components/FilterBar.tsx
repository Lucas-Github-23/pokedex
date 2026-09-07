import React, { useRef, useEffect } from 'react';
import { Crosshair, X, SlidersHorizontal, Gamepad2, Heart, PenTool } from 'lucide-react';
import { POKEMON_TYPES, GENERATIONS } from '../constants/pokemonData';
import { TypeIcon } from './TypeIcon';
import type { GenerationKey, SortKey } from '../types/pokemon';
import type { SpriteStyle, EmulatorShader } from '../constants/spriteStyles';
import { SPRITE_STYLES, EMULATOR_SHADERS } from '../constants/spriteStyles';

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
  selectedSpriteStyle: SpriteStyle;
  onSelectSpriteStyle: (style: SpriteStyle) => void;
  selectedShader?: EmulatorShader;
  onSelectShader?: (shader: EmulatorShader) => void;
  onlyFavorites?: boolean;
  onToggleOnlyFavorites?: (val: boolean) => void;
  favoritesCount?: number;
  onOpenAdvancedFilters?: () => void;
  activeAdvancedCount?: number;
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
  selectedSpriteStyle,
  onSelectSpriteStyle,
  selectedShader = 'none',
  onSelectShader,
  onlyFavorites = false,
  onToggleOnlyFavorites,
  favoritesCount = 0,
  onOpenAdvancedFilters,
  activeAdvancedCount = 0,
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
      <div className="scanner-search-row">
        <div className="scanner-search-box">
          <Crosshair size={20} className="scanner-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="scanner-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rastrear espécime por nome, código (#025), tipo (fogo), região ou 'favoritos'..."
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

        {/* Dedicated Advanced Filters Trigger Button */}
        {onOpenAdvancedFilters && (
          <button
            type="button"
            className={`adv-filter-trigger-btn ${activeAdvancedCount > 0 ? 'active' : ''}`}
            onClick={onOpenAdvancedFilters}
            title="Abrir Central de Filtragem Avançada"
          >
            <SlidersHorizontal size={15} color={activeAdvancedCount > 0 ? '#fff' : 'var(--poke-cyan)'} />
            <span>FILTROS AVANÇADOS</span>
            {activeAdvancedCount > 0 && (
              <span className="adv-trigger-count-badge">{activeAdvancedCount}</span>
            )}
          </button>
        )}
      </div>

      {/* Generation Hardware Cartridges */}
      <div className="generation-switchboard">
        <button
          className={`gen-cartridge-btn ${!onlyFavorites && selectedGeneration === 'all' ? 'active' : ''}`}
          onClick={() => {
            if (onlyFavorites && onToggleOnlyFavorites) {
              onToggleOnlyFavorites(false);
            }
            onSelectGeneration('all');
          }}
        >
          <span className="gen-code">NATIONAL</span>
          <span className="gen-name">Todas as Regiões</span>
        </button>

        {onToggleOnlyFavorites && (
          <button
            className={`gen-cartridge-btn fav-filter-btn ${onlyFavorites ? 'active-fav-filter' : ''}`}
            onClick={() => onToggleOnlyFavorites(!onlyFavorites)}
            title="Filtrar somente espécimes favoritados"
          >
            <span className="gen-code">
              <Heart
                size={11}
                fill={onlyFavorites ? '#fff' : '#ef4444'}
                color={onlyFavorites ? '#fff' : '#ef4444'}
              />
              FAVORITOS
            </span>
            <span className="gen-name">Salvos ({favoritesCount})</span>
          </button>
        )}

        {GENERATIONS.map((gen) => (
          <button
            key={gen.id}
            className={`gen-cartridge-btn ${!onlyFavorites && selectedGeneration === gen.id ? 'active' : ''}`}
            onClick={() => {
              if (onlyFavorites && onToggleOnlyFavorites) {
                onToggleOnlyFavorites(false);
              }
              onSelectGeneration(gen.id as GenerationKey);
            }}
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
              <TypeIcon
                type={type.name}
                size={14}
                color={isSelected ? '#ffffff' : type.color}
              />
              {type.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Console Style Selector Bar */}
      <div className="console-selector-bar">
        <div className="console-selector-label">
          <Gamepad2 size={16} color="var(--poke-cyan)" />
          <span>ESTILO DE CONSOLE:</span>
        </div>
        <div className="console-selector-chips">
          {SPRITE_STYLES.map((st) => (
            <button
              key={st.id}
              type="button"
              className={`console-hardware-btn ${selectedSpriteStyle === st.id ? 'active' : ''}`}
              onClick={() => onSelectSpriteStyle(st.id)}
              title={st.description}
            >
              <span className="console-chip-badge">{st.tag}</span>
              <span className="console-chip-title">{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hand-Drawn Lineart Shader Selector Bar */}
      {onSelectShader && (
        <div className="shader-selector-bar">
          <div className="shader-selector-label">
            <PenTool size={16} color="var(--poke-cyan)" />
            <span>TRAÇADO DE LINHAS (DESENHO):</span>
          </div>
          <div className="shader-selector-chips">
            {EMULATOR_SHADERS.map((sh) => (
              <button
                key={sh.id}
                type="button"
                className={`shader-hardware-btn ${selectedShader === sh.id ? 'active' : ''}`}
                onClick={() => onSelectShader(sh.id)}
                title={sh.description}
              >
                <span className="shader-chip-badge">{sh.tag}</span>
                <span className="shader-chip-title">{sh.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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
            <optgroup label="Básica">
              <option value="id-asc">CÓDIGO (# CRESCENTE)</option>
              <option value="id-desc">CÓDIGO (# DECRESCENTE)</option>
              <option value="name-asc">NOME (A - Z)</option>
              <option value="name-desc">NOME (Z - A)</option>
            </optgroup>
            <optgroup label="Atributos & BST">
              <option value="bst-desc">MAIOR BST TOTAL (PODER)</option>
              <option value="bst-asc">MENOR BST TOTAL</option>
              <option value="hp-desc">MAIOR HP (VIDA)</option>
              <option value="atk-desc">MAIOR ATAQUE FÍSICO</option>
              <option value="def-desc">MAIOR DEFESA FÍSICA</option>
              <option value="spa-desc">MAIOR ATAQUE ESPECIAL</option>
              <option value="spd-desc">MAIOR DEFESA ESPECIAL</option>
              <option value="spe-desc">MAIOR VELOCIDADE</option>
            </optgroup>
            <optgroup label="Biometria">
              <option value="weight-desc">MAIS PESADO</option>
              <option value="weight-asc">MAIS LEVE</option>
              <option value="height-desc">MAIS ALTO / LONGO</option>
              <option value="height-asc">MAIS BAIXO / COMPACTO</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
};
