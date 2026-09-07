import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { ActiveFilterChip } from '../utils/filterHelpers';

interface ActiveFilterChipsProps {
  chips: ActiveFilterChip[];
  onClearAll: () => void;
  resultsCount: number;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  chips,
  onClearAll,
  resultsCount,
}) => {
  if (chips.length === 0) return null;

  return (
    <div className="active-filters-hud-bar">
      <div className="active-filters-header-tag">
        <SlidersHorizontal size={13} color="var(--poke-cyan)" />
        <span>FILTROS ATIVOS ({chips.length}):</span>
      </div>

      <div className="active-chips-scroll-wrap">
        {chips.map((chip) => (
          <span key={chip.id} className={`filter-active-chip type-${chip.type}`}>
            <span className="chip-label-text">{chip.label}</span>
            <button
              type="button"
              className="chip-remove-btn"
              onClick={chip.onRemove}
              title={`Remover filtro: ${chip.label}`}
              aria-label={`Remover filtro ${chip.label}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      <div className="active-filters-action-group">
        <span className="chips-results-counter">
          <strong>{resultsCount}</strong> {resultsCount === 1 ? 'resultado' : 'resultados'}
        </span>
        <button
          type="button"
          className="clear-all-chips-btn"
          onClick={onClearAll}
          title="Limpar todos os filtros avançados"
        >
          <RotateCcw size={11} />
          <span>Limpar Tudo</span>
        </button>
      </div>
    </div>
  );
};
