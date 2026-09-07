import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Zap,
  Dna,
  Layers,
  RotateCcw,
  Check,
  Flame,
  Shield,
  Gauge,
  Activity,
  Ruler,
  Weight,
} from 'lucide-react';
import type {
  AdvancedFilters,
  CategoryFilter,
  EvolutionStageFilter,
  HeightClassFilter,
  WeightClassFilter,
  TypeFilterMode,
} from '../types/pokemon';
import { DEFAULT_ADVANCED_FILTERS } from '../types/pokemon';
import { POKEMON_TYPES, GENERATIONS, STAT_NAMES } from '../constants/pokemonData';
import {
  CATEGORY_LABELS,
  STAGE_LABELS,
  HEIGHT_CLASSES,
  WEIGHT_CLASSES,
  countActiveFilters,
} from '../utils/filterHelpers';
import { TypeIcon } from './TypeIcon';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedFilters;
  onApplyFilters: (filters: AdvancedFilters) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

type ModalTab = 'types-gen' | 'categories' | 'stats' | 'evolution-bio';

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  totalFilteredCount,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('types-gen');
  // Local draft state for instant live changes before confirm or close
  const [draft, setDraft] = useState<AdvancedFilters>(filters);

  // Synchronize draft when modal opens
  useEffect(() => {
    if (isOpen) {
      setDraft(filters);
    }
  }, [isOpen, filters]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Active filters count in draft
  const activeCount = useMemo(() => countActiveFilters(draft), [draft]);

  // Toggle category
  const toggleCategory = (cat: CategoryFilter) => {
    setDraft((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  // Toggle evolution stage
  const toggleStage = (stage: EvolutionStageFilter) => {
    setDraft((prev) => {
      const exists = prev.evolutionStages.includes(stage);
      return {
        ...prev,
        evolutionStages: exists
          ? prev.evolutionStages.filter((s) => s !== stage)
          : [...prev.evolutionStages, stage],
      };
    });
  };

  // Toggle generation
  const toggleGeneration = (genId: string) => {
    setDraft((prev) => {
      const exists = prev.generations.includes(genId);
      return {
        ...prev,
        generations: exists
          ? prev.generations.filter((g) => g !== genId)
          : [...prev.generations, genId],
      };
    });
  };

  const handleApply = () => {
    onApplyFilters(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft(DEFAULT_ADVANCED_FILTERS);
    onResetFilters();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="adv-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="adv-filter-terminal" onClick={(e) => e.stopPropagation()}>
        {/* Terminal Header */}
        <div className="adv-modal-header">
          <div className="adv-modal-title-cluster">
            <div className="adv-modal-lens-led" />
            <div>
              <h3 className="adv-modal-title">CENTRAL DE FILTRAGEM AVANÇADA</h3>
              <span className="adv-modal-subtitle">
                TELEMETRIA DE RASTREIO MULTIPARAMÉTRICA • {activeCount} FILTROS ATIVOS
              </span>
            </div>
          </div>

          <div className="adv-modal-header-actions">
            {activeCount > 0 && (
              <button
                type="button"
                className="adv-header-reset-btn"
                onClick={handleReset}
                title="Limpar todos os parâmetros"
              >
                <RotateCcw size={13} />
                <span>REDEFINIR</span>
              </button>
            )}
            <button
              type="button"
              className="adv-modal-close-btn"
              onClick={onClose}
              title="Fechar Central de Filtros"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="adv-modal-tabs-bar">
          <button
            type="button"
            className={`adv-tab-nav-btn ${activeTab === 'types-gen' ? 'active' : ''}`}
            onClick={() => setActiveTab('types-gen')}
          >
            <Layers size={14} />
            <span>TIPOS & GERAÇÕES</span>
            {(draft.primaryType || draft.secondaryType || draft.typeMode !== 'any' || draft.generations.length > 0) && (
              <span className="adv-tab-badge-pip" />
            )}
          </button>

          <button
            type="button"
            className={`adv-tab-nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Sparkles size={14} />
            <span>CATEGORIAS & RARIDADE</span>
            {draft.categories.length > 0 && (
              <span className="adv-tab-badge-count">{draft.categories.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`adv-tab-nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <Zap size={14} />
            <span>ATRIBUTOS & BST</span>
            {(draft.minBst > 180 || draft.maxBst < 780 || draft.dominantStat || Object.values(draft.minStat).some((v) => v > 0)) && (
              <span className="adv-tab-badge-pip" />
            )}
          </button>

          <button
            type="button"
            className={`adv-tab-nav-btn ${activeTab === 'evolution-bio' ? 'active' : ''}`}
            onClick={() => setActiveTab('evolution-bio')}
          >
            <Dna size={14} />
            <span>EVOLUÇÃO & BIOMETRIA</span>
            {(draft.evolutionStages.length > 0 || draft.heightClass !== 'any' || draft.weightClass !== 'any') && (
              <span className="adv-tab-badge-pip" />
            )}
          </button>
        </div>

        {/* Tab Contents Viewport */}
        <div className="adv-modal-content-body">
          {/* TAB 1: TYPES & GENERATIONS */}
          {activeTab === 'types-gen' && (
            <div className="adv-tab-section">
              {/* Type Mode Selector */}
              <div className="adv-form-group">
                <label className="adv-group-label">
                  <Layers size={14} color="var(--poke-cyan)" />
                  <span>MODO DE TIPAGEM:</span>
                </label>
                <div className="adv-segmented-control">
                  {(
                    [
                      { id: 'any', label: 'Qualquer Tipo' },
                      { id: 'mono', label: 'Apenas Mono-Tipo (1 Tipo)' },
                      { id: 'dual', label: 'Apenas Dual-Tipo (2 Tipos)' },
                      { id: 'exact', label: 'Combinação Exata' },
                    ] as { id: TypeFilterMode; label: string }[]
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={`adv-segment-btn ${draft.typeMode === mode.id ? 'active' : ''}`}
                      onClick={() => setDraft((p) => ({ ...p, typeMode: mode.id }))}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Type Selection */}
              <div className="adv-form-group">
                <div className="adv-label-with-action">
                  <label className="adv-group-label">
                    <Flame size={14} color="#f97316" />
                    <span>TIPO PRIMÁRIO / PRINCIPAL:</span>
                  </label>
                  {draft.primaryType && (
                    <button
                      type="button"
                      className="adv-inline-clear-btn"
                      onClick={() => setDraft((p) => ({ ...p, primaryType: '' }))}
                    >
                      Limpar Tipo 1
                    </button>
                  )}
                </div>

                <div className="adv-types-grid">
                  {Object.values(POKEMON_TYPES).map((type) => {
                    const isSelected = draft.primaryType === type.name;
                    return (
                      <button
                        key={`prim-${type.name}`}
                        type="button"
                        className={`adv-type-chip ${isSelected ? 'active' : ''}`}
                        onClick={() =>
                          setDraft((p) => ({
                            ...p,
                            primaryType: isSelected ? '' : type.name,
                          }))
                        }
                        style={
                          isSelected
                            ? ({
                                background: type.bgGradient,
                                borderColor: type.color,
                                boxShadow: `0 0 12px ${type.glow}`,
                              } as React.CSSProperties)
                            : undefined
                        }
                      >
                        <TypeIcon type={type.name} size={14} color={isSelected ? '#fff' : type.color} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Type Selection */}
              <div className="adv-form-group">
                <div className="adv-label-with-action">
                  <label className="adv-group-label">
                    <Shield size={14} color="#38bdf8" />
                    <span>TIPO SECUNDÁRIO (OPCIONAL):</span>
                  </label>
                  {draft.secondaryType && (
                    <button
                      type="button"
                      className="adv-inline-clear-btn"
                      onClick={() => setDraft((p) => ({ ...p, secondaryType: '' }))}
                    >
                      Limpar Tipo 2
                    </button>
                  )}
                </div>

                <div className="adv-types-grid">
                  {Object.values(POKEMON_TYPES).map((type) => {
                    const isSelected = draft.secondaryType === type.name;
                    const isSameAsPrimary = draft.primaryType === type.name;
                    return (
                      <button
                        key={`sec-${type.name}`}
                        type="button"
                        disabled={isSameAsPrimary}
                        className={`adv-type-chip ${isSelected ? 'active' : ''} ${isSameAsPrimary ? 'disabled' : ''}`}
                        onClick={() =>
                          setDraft((p) => ({
                            ...p,
                            secondaryType: isSelected ? '' : type.name,
                          }))
                        }
                        style={
                          isSelected
                            ? ({
                                background: type.bgGradient,
                                borderColor: type.color,
                                boxShadow: `0 0 12px ${type.glow}`,
                              } as React.CSSProperties)
                            : undefined
                        }
                      >
                        <TypeIcon type={type.name} size={14} color={isSelected ? '#fff' : type.color} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multi-Generation Selection */}
              <div className="adv-form-group">
                <div className="adv-label-with-action">
                  <label className="adv-group-label">
                    <Layers size={14} color="var(--poke-gold)" />
                    <span>GERAÇÕES & REGIÕES (SELEÇÃO MÚLTIPLA):</span>
                  </label>
                  {draft.generations.length > 0 && (
                    <button
                      type="button"
                      className="adv-inline-clear-btn"
                      onClick={() => setDraft((p) => ({ ...p, generations: [] }))}
                    >
                      Todas as Regiões
                    </button>
                  )}
                </div>

                <div className="adv-generations-grid">
                  {GENERATIONS.map((gen) => {
                    const isSelected = draft.generations.includes(gen.id);
                    return (
                      <button
                        key={gen.id}
                        type="button"
                        className={`adv-gen-card ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleGeneration(gen.id)}
                      >
                        <div className="adv-gen-header">
                          <span className="adv-gen-number">GEN 0{gen.id}</span>
                          {isSelected && <Check size={14} color="var(--poke-cyan)" />}
                        </div>
                        <span className="adv-gen-region">{gen.region}</span>
                        <span className="adv-gen-range">
                          #{String(gen.range[0]).padStart(4, '0')} – #{String(gen.range[1]).padStart(4, '0')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES & RARITY */}
          {activeTab === 'categories' && (
            <div className="adv-tab-section">
              <p className="adv-section-hint">
                Selecione uma ou mais categorias para filtrar espécimes com características especiais ou tiers competitivos.
              </p>

              <div className="adv-categories-grid">
                {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((cat) => {
                  const meta = CATEGORY_LABELS[cat];
                  const isSelected = draft.categories.includes(cat);

                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`adv-category-card ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleCategory(cat)}
                      style={
                        isSelected
                          ? ({
                              borderColor: meta.color,
                              '--cat-glow': `${meta.color}44`,
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <div className="adv-category-top">
                        <span
                          className="adv-category-tag"
                          style={{
                            color: meta.color,
                            borderColor: `${meta.color}66`,
                            background: `${meta.color}18`,
                          }}
                        >
                          {meta.tag}
                        </span>
                        {isSelected && <Check size={16} color={meta.color} />}
                      </div>
                      <h4 className="adv-category-name">{meta.label}</h4>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BASE STATS & BST */}
          {activeTab === 'stats' && (
            <div className="adv-tab-section">
              {/* BST Range Slider */}
              <div className="adv-form-group">
                <div className="adv-label-with-action">
                  <label className="adv-group-label">
                    <Gauge size={14} color="var(--poke-cyan)" />
                    <span>FAIXA DE BST TOTAL (BASE STAT TOTAL):</span>
                  </label>
                  <span className="adv-range-readout">
                    {draft.minBst} – {draft.maxBst} BST
                  </span>
                </div>

                <div className="adv-slider-container">
                  <div className="adv-slider-inputs">
                    <label>
                      <span>Mínimo:</span>
                      <input
                        type="range"
                        min="180"
                        max="780"
                        step="10"
                        value={draft.minBst}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            minBst: Math.min(Number(e.target.value), p.maxBst - 10),
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Máximo:</span>
                      <input
                        type="range"
                        min="180"
                        max="780"
                        step="10"
                        value={draft.maxBst}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            maxBst: Math.max(Number(e.target.value), p.minBst + 10),
                          }))
                        }
                      />
                    </label>
                  </div>

                  {/* BST Quick Presets */}
                  <div className="adv-presets-row">
                    <span>Atalhos BST:</span>
                    {[
                      { label: 'Todos (180–780)', min: 180, max: 780 },
                      { label: 'Iniciais (≥ 500)', min: 500, max: 780 },
                      { label: 'Competitivo (≥ 540)', min: 540, max: 780 },
                      { label: 'Poder Máximo (≥ 600)', min: 600, max: 780 },
                      { label: 'Lendários (≥ 670)', min: 670, max: 780 },
                    ].map((pre) => (
                      <button
                        key={pre.label}
                        type="button"
                        className="adv-preset-btn"
                        onClick={() => setDraft((p) => ({ ...p, minBst: pre.min, maxBst: pre.max }))}
                      >
                        {pre.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dominant Stat Specialty */}
              <div className="adv-form-group">
                <div className="adv-label-with-action">
                  <label className="adv-group-label">
                    <Activity size={14} color="#ec4899" />
                    <span>ATRIBUTO PREDOMINANTE (MAIOR STAT DO ESPÉCIME):</span>
                  </label>
                  {draft.dominantStat && (
                    <button
                      type="button"
                      className="adv-inline-clear-btn"
                      onClick={() => setDraft((p) => ({ ...p, dominantStat: '' }))}
                    >
                      Qualquer Atributo
                    </button>
                  )}
                </div>

                <div className="adv-stats-pills-grid">
                  {(Object.keys(STAT_NAMES) as Array<keyof typeof STAT_NAMES>).map((statKey) => {
                    const meta = STAT_NAMES[statKey];
                    const isSelected = draft.dominantStat === statKey;
                    return (
                      <button
                        key={statKey}
                        type="button"
                        className={`adv-stat-specialty-btn ${isSelected ? 'active' : ''}`}
                        onClick={() =>
                          setDraft((p) => ({
                            ...p,
                            dominantStat: isSelected ? '' : statKey,
                          }))
                        }
                        style={
                          isSelected
                            ? ({
                                borderColor: meta.color,
                                color: meta.color,
                                background: `${meta.color}22`,
                              } as React.CSSProperties)
                            : undefined
                        }
                      >
                        <span className="stat-specialty-name">{meta.label}</span>
                        <span className="stat-specialty-short">{meta.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Minimum Stat Thresholds */}
              <div className="adv-form-group">
                <label className="adv-group-label">
                  <Zap size={14} color="#facc15" />
                  <span>VALORES MÍNIMOS POR ATRIBUTO:</span>
                </label>

                <div className="adv-min-stats-grid">
                  {(
                    [
                      { key: 'hp', label: 'HP', color: '#22c55e' },
                      { key: 'atk', label: 'Ataque', color: '#ef4444' },
                      { key: 'def', label: 'Defesa', color: '#f97316' },
                      { key: 'spa', label: 'Atq. Especial', color: '#38bdf8' },
                      { key: 'spd', label: 'Def. Especial', color: '#818cf8' },
                      { key: 'spe', label: 'Velocidade', color: '#ec4899' },
                    ] as const
                  ).map((s) => {
                    const val = draft.minStat[s.key];
                    return (
                      <div key={s.key} className="adv-min-stat-box">
                        <div className="min-stat-header">
                          <span style={{ color: s.color }}>{s.label}</span>
                          <strong>≥ {val}</strong>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="160"
                          step="10"
                          value={val}
                          onChange={(e) => {
                            const num = Number(e.target.value);
                            setDraft((p) => ({
                              ...p,
                              minStat: { ...p.minStat, [s.key]: num },
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVOLUTION & BIOMETRICS */}
          {activeTab === 'evolution-bio' && (
            <div className="adv-tab-section">
              {/* Evolution Stage Filter */}
              <div className="adv-form-group">
                <div className="adv-label-with-action">
                  <label className="adv-group-label">
                    <Dna size={14} color="#a855f7" />
                    <span>ESTÁGIO EVOLUTIVO:</span>
                  </label>
                  {draft.evolutionStages.length > 0 && (
                    <button
                      type="button"
                      className="adv-inline-clear-btn"
                      onClick={() => setDraft((p) => ({ ...p, evolutionStages: [] }))}
                    >
                      Todos os Estágios
                    </button>
                  )}
                </div>

                <div className="adv-stages-grid">
                  {(Object.keys(STAGE_LABELS) as EvolutionStageFilter[]).map((stage) => {
                    const meta = STAGE_LABELS[stage];
                    const isSelected = draft.evolutionStages.includes(stage);

                    return (
                      <button
                        key={stage}
                        type="button"
                        className={`adv-stage-card ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleStage(stage)}
                      >
                        <div className="adv-stage-top">
                          <h4 className="adv-stage-title">{meta.label}</h4>
                          {isSelected && <Check size={16} color="var(--poke-cyan)" />}
                        </div>
                        <p className="adv-stage-desc">{meta.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Height Class Selector */}
              <div className="adv-form-group">
                <label className="adv-group-label">
                  <Ruler size={14} color="#06b6d4" />
                  <span>PORTE / ALTURA DO ESPÉCIME:</span>
                </label>
                <div className="adv-segmented-control">
                  <button
                    type="button"
                    className={`adv-segment-btn ${draft.heightClass === 'any' ? 'active' : ''}`}
                    onClick={() => setDraft((p) => ({ ...p, heightClass: 'any' }))}
                  >
                    Qualquer Altura
                  </button>
                  {(Object.keys(HEIGHT_CLASSES) as Array<keyof typeof HEIGHT_CLASSES>).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`adv-segment-btn ${draft.heightClass === key ? 'active' : ''}`}
                      onClick={() => setDraft((p) => ({ ...p, heightClass: key as HeightClassFilter }))}
                    >
                      {HEIGHT_CLASSES[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Class Selector */}
              <div className="adv-form-group">
                <label className="adv-group-label">
                  <Weight size={14} color="#eab308" />
                  <span>CATEGORIA DE PESO:</span>
                </label>
                <div className="adv-segmented-control">
                  <button
                    type="button"
                    className={`adv-segment-btn ${draft.weightClass === 'any' ? 'active' : ''}`}
                    onClick={() => setDraft((p) => ({ ...p, weightClass: 'any' }))}
                  >
                    Qualquer Peso
                  </button>
                  {(Object.keys(WEIGHT_CLASSES) as Array<keyof typeof WEIGHT_CLASSES>).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`adv-segment-btn ${draft.weightClass === key ? 'active' : ''}`}
                      onClick={() => setDraft((p) => ({ ...p, weightClass: key as WeightClassFilter }))}
                    >
                      {WEIGHT_CLASSES[key].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="adv-modal-footer">
          <div className="adv-footer-stats">
            <span className="adv-results-preview">
              ESPÉCIMES IDENTIFICADOS: <strong>{totalFilteredCount}</strong>
            </span>
          </div>

          <div className="adv-footer-actions">
            <button type="button" className="adv-cancel-btn" onClick={onClose}>
              CANCELAR
            </button>
            <button type="button" className="adv-apply-btn" onClick={handleApply}>
              <Check size={16} />
              <span>APLICAR FILTROS ({activeCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
