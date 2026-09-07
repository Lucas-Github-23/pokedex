import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sparkles,
  Heart,
  Activity,
  Compass,
  GitFork,
  Loader2,
  Ruler,
  Weight,
  Sparkle,
  Gamepad2,
  Layers,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import type {
  PokemonDetail,
  EvolutionStage,
  GameLocations as IGameLocations,
  PokemonListItem,
  PokemonVariety,
} from '../types/pokemon';
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonLocations,
} from '../services/pokeapi';
import { POKEMON_TYPES, STAT_NAMES } from '../constants/pokemonData';
import { POKEMON_TYPES_MAP } from '../constants/pokemonTypes';
import { getJapaneseName } from '../constants/japaneseNames';
import { FORM_CATEGORY_CONFIG } from '../constants/pokemonForms';
import { TypeIcon } from './TypeIcon';
import { EvolutionChain } from './EvolutionChain';
import { GameLocations } from './GameLocations';
import type { SpriteStyle } from '../constants/spriteStyles';
import {
  SPRITE_STYLES,
  getPokemonSpriteUrl,
  getSpriteFallbackChain,
} from '../constants/spriteStyles';

interface PokemonModalProps {
  pokemonId: number | null;
  initialPokemon?: PokemonListItem;
  onClose: () => void;
  onSelectPokemon: (id: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
  totalPokemonCount?: number;
  initialSpriteStyle?: SpriteStyle;
}

type TabType = 'stats' | 'evolution' | 'locations';

export const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemonId,
  initialPokemon,
  onClose,
  onSelectPokemon,
  isFavorite,
  onToggleFavorite,
  totalPokemonCount = 1025,
  initialSpriteStyle = 'official',
}) => {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [flavorText, setFlavorText] = useState<string>('');
  const [genus, setGenus] = useState<string>('');
  const [japaneseName, setJapaneseName] = useState<string>('');
  const [evolutionStages, setEvolutionStages] = useState<EvolutionStage[]>([]);
  const [locations, setLocations] = useState<IGameLocations[]>([]);
  const [varieties, setVarieties] = useState<PokemonVariety[]>([]);
  const [selectedVariety, setSelectedVariety] = useState<PokemonVariety | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [isShiny, setIsShiny] = useState<boolean>(false);
  const [isPlayingCry, setIsPlayingCry] = useState<boolean>(false);
  const [modalSpriteStyle, setModalSpriteStyle] = useState<SpriteStyle>(initialSpriteStyle);
  const [spriteFallbackIdx, setSpriteFallbackIdx] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setModalSpriteStyle(initialSpriteStyle);
  }, [initialSpriteStyle, pokemonId]);

  const loadData = useCallback(async (id: number) => {
    let isMounted = true;
    setLoading(true);
    setLoadError(null);
    setIsShiny(false);
    setSelectedVariety(null);

    try {
      const pDetail = await fetchPokemonDetail(id);
      if (!isMounted) return;
      setDetail(pDetail);

      // Fetch Species & Evolution & Locations
      const [speciesData, locData] = await Promise.all([
        fetchPokemonSpecies(pDetail.speciesUrl),
        fetchPokemonLocations(pDetail.locationEncountersUrl),
      ]);

      if (!isMounted) return;
      setFlavorText(speciesData.flavorText);
      setGenus(speciesData.genus);
      setJapaneseName(speciesData.japaneseName || getJapaneseName(id));
      setLocations(locData);
      setVarieties(speciesData.varieties || []);

      // Find default variety
      const defaultVar = speciesData.varieties?.find((v) => v.is_default) || speciesData.varieties?.[0] || null;
      setSelectedVariety(defaultVar);

      if (speciesData.evolutionChainUrl) {
        const evoStages = await fetchEvolutionChain(speciesData.evolutionChainUrl);
        if (isMounted) {
          setEvolutionStages(evoStages);
        }
      } else {
        setEvolutionStages([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do espécime:', error);
      if (isMounted) {
        setLoadError('Não foi possível carregar a telemetria completa deste espécime.');
      }
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!pokemonId) return;
    loadData(pokemonId);
  }, [pokemonId, loadData]);

  const handleSelectVariety = async (variety: PokemonVariety) => {
    if (selectedVariety?.id === variety.id) return;
    setSelectedVariety(variety);
    try {
      setLoadingForm(true);
      const formDetail = await fetchPokemonDetail(variety.id);
      setDetail(formDetail);
    } catch (err) {
      console.error('Erro ao alternar forma alternativa:', err);
    } finally {
      setLoadingForm(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && pokemonId && pokemonId > 1) {
        onSelectPokemon(pokemonId - 1);
      } else if (e.key === 'ArrowRight' && pokemonId && pokemonId < totalPokemonCount) {
        onSelectPokemon(pokemonId + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pokemonId, onClose, onSelectPokemon, totalPokemonCount]);

  if (!pokemonId) return null;

  const handlePlayCry = () => {
    const crySource = detail?.cryUrl || `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(crySource);
    audio.volume = 0.5;
    audioRef.current = audio;
    setIsPlayingCry(true);

    audio.play().catch(() => {
      setIsPlayingCry(false);
    });

    audio.onended = () => {
      setIsPlayingCry(false);
    };
  };

  const activePokemonId = selectedVariety?.id || detail?.id || pokemonId || 1;
  const activePokemonName = selectedVariety?.name || detail?.name || initialPokemon?.name || '';
  const resolvedTypes =
    detail?.types && detail.types.length > 0
      ? detail.types
      : initialPokemon?.types && initialPokemon.types.length > 0
      ? initialPokemon.types
      : POKEMON_TYPES_MAP[activePokemonId] || ['normal'];

  const primaryType = resolvedTypes[0] || 'normal';
  const typeConfig = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;
  const formattedId = `№ ${String(pokemonId).padStart(4, '0')}`;
  const heightM = detail ? (detail.height / 10).toFixed(1) : '---';
  const weightKg = detail ? (detail.weight / 10).toFixed(1) : '---';

  const fallbackChain = useMemo(
    () =>
      getSpriteFallbackChain(
        activePokemonId,
        modalSpriteStyle,
        isShiny,
        activePokemonName
      ),
    [activePokemonId, modalSpriteStyle, isShiny, activePokemonName]
  );

  // Reset fallback index when pokemon or style changes
  useEffect(() => {
    setSpriteFallbackIdx(0);
  }, [activePokemonId, modalSpriteStyle, isShiny]);

  const currentImage =
    fallbackChain[spriteFallbackIdx] ||
    fallbackChain[0] ||
    getPokemonSpriteUrl(activePokemonId, modalSpriteStyle, isShiny, activePokemonName);

  const displayTitle =
    selectedVariety && !selectedVariety.is_default
      ? selectedVariety.displayName
      : detail?.name || initialPokemon?.name || `Pokémon #${pokemonId}`;

  const currentJapanese = japaneseName || initialPokemon?.japaneseName || getJapaneseName(pokemonId);

  // Lock background scroll while modal is active
  useEffect(() => {
    if (pokemonId) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [pokemonId]);

  if (!pokemonId) return null;

  return createPortal(
    <div className="diagnostic-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <ErrorBoundary fallbackTitle="TELEMETRIA DO ESPÉCIME INTERROMPIDA" onReset={() => loadData(pokemonId)}>
        <div
          className="diagnostic-terminal"
          onClick={(e) => e.stopPropagation()}
          style={
            {
              '--modal-glow-color': typeConfig.glow,
              '--modal-type-color': typeConfig.color,
            } as React.CSSProperties
          }
        >
        {/* Top Hardware Header Bar: Identity + Top Controls */}
        <div className="terminal-top-header">
          <div className="terminal-title-bar">
            <div className="terminal-lens-mini" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="terminal-id-tag">{formattedId}</span>
                <span className="terminal-pokemon-title">{displayTitle}</span>
                {currentJapanese && (
                  <span className="terminal-japanese-tag">{currentJapanese}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Right at the Top Header */}
          <div className="terminal-top-actions">
            {/* Audio Cry Button */}
            <button
              className={`terminal-action-btn ${isPlayingCry ? 'active' : ''}`}
              onClick={handlePlayCry}
              title="Tocar som oficial (Cry)"
            >
              <Volume2 size={15} />
              <span>SOM</span>
              {isPlayingCry && (
                <span className="audio-spectrum-bars">
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </button>

            {/* Shiny Toggle Button */}
            <button
              className={`terminal-action-btn ${isShiny ? 'active-shiny' : ''}`}
              onClick={() => setIsShiny((prev) => !prev)}
              title="Alternar modo Shiny"
            >
              <Sparkles size={15} color={isShiny ? '#facc15' : 'currentColor'} />
              <span>{isShiny ? 'SHINY' : 'NORMAL'}</span>
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              className={`terminal-action-btn ${isFavorite ? 'active-fav' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleFavorite(
                  {
                    id: activePokemonId,
                    name: detail?.name || initialPokemon?.name || `pokemon-${activePokemonId}`,
                    url: `https://pokeapi.co/api/v2/pokemon/${activePokemonId}`,
                    sprite: detail?.spriteOfficialArtwork || currentImage,
                    types: resolvedTypes,
                    japaneseName: currentJapanese,
                  },
                  e
                );
              }}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart
                size={15}
                fill={isFavorite ? '#ffffff' : 'none'}
                color={isFavorite ? '#ffffff' : 'currentColor'}
              />
              <span>{isFavorite ? 'FAVORITADO' : 'FAVORITAR'}</span>
            </button>

            {/* Navigation & Close Buttons */}
            <div className="terminal-nav-divider" />

            {pokemonId && pokemonId > 1 && (
              <button
                className="terminal-close-btn"
                onClick={() => onSelectPokemon(pokemonId - 1)}
                title="Espécime Anterior"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            {pokemonId && pokemonId < totalPokemonCount && (
              <button
                className="terminal-close-btn"
                onClick={() => onSelectPokemon(pokemonId + 1)}
                title="Próximo Espécime"
              >
                <ChevronRight size={16} />
              </button>
            )}
            <button
              className="terminal-close-btn close-x"
              onClick={onClose}
              title="Fechar Terminal"
              aria-label="Fechar Terminal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dual Screens Layout */}
        <div className="terminal-screens-layout">
          {/* LEFT COLUMN: POKÉMON VISUALIZER & BIOMETRICS */}
          <div className="holo-chamber">
            {/* Holographic Projection Stage */}
            <div className="holo-projector-stage">
              {/* Subtle Ethereal Ambient Glow */}
              <div className="holo-ambient-aura" />

              {/* Clean Specimen Floor Contact Shadow */}
              <div className="holo-floor-shadow" />

              {/* The Pokemon Sprite */}
              <img
                key={`${activePokemonId}-${modalSpriteStyle}-${isShiny}-${spriteFallbackIdx}`}
                src={currentImage}
                alt={displayTitle}
                className={`holo-sprite-img ${modalSpriteStyle !== 'official' ? 'pixelated-sprite' : ''}`}
                draggable={false}
                onError={() => {
                  setSpriteFallbackIdx((prev) =>
                    prev + 1 < fallbackChain.length ? prev + 1 : prev
                  );
                }}
              />

              {/* Vertical Scanner Line */}
              <div className="holo-laser-scanline" />
            </div>

            {/* Alternative Form Variations Switcher */}
            {varieties.length > 1 && (
              <div className="modal-forms-switch-bar">
                <div className="modal-forms-bar-header">
                  <Layers size={13} color="var(--poke-cyan)" />
                  <span>FORMAS ALTERNATIVAS ({varieties.length})</span>
                  {loadingForm && <Loader2 size={12} className="spin-inline" color="var(--poke-cyan)" />}
                </div>
                <div className="modal-forms-chips">
                  {varieties.map((v) => {
                    const isSelected = selectedVariety ? selectedVariety.id === v.id : v.is_default;
                    const catConfig = FORM_CATEGORY_CONFIG[v.category] || FORM_CATEGORY_CONFIG.default;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        className={`modal-form-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectVariety(v)}
                        title={v.displayName}
                        style={
                          isSelected
                            ? ({
                                '--form-color': catConfig.color,
                                '--form-border': catConfig.border,
                                '--form-bg': catConfig.bg,
                              } as React.CSSProperties)
                            : undefined
                        }
                      >
                        <span
                          className="form-chip-tag"
                          style={{
                            color: catConfig.color,
                            borderColor: `${catConfig.color}66`,
                            background: `${catConfig.color}22`,
                          }}
                        >
                          {v.tag}
                        </span>
                        <span className="form-chip-name">{v.displayName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Console Style Toolbar inside Modal */}
            <div className="modal-console-switch-bar">
              <div className="modal-console-bar-header">
                <Gamepad2 size={13} color="var(--poke-cyan)" />
                <span>ESTILO DE CONSOLE</span>
              </div>
              <div className="modal-console-chips">
                {SPRITE_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`modal-console-chip ${modalSpriteStyle === st.id ? 'active' : ''}`}
                    onClick={() => setModalSpriteStyle(st.id)}
                    title={st.description}
                  >
                    <span className="chip-code">{st.tag}</span>
                    <span className="chip-name">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Elemental Badges */}
            <div className="modal-elemental-badges">
              {resolvedTypes.map((type) => {
                const cfg = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
                return (
                  <span
                    key={type}
                    className="type-metal-badge"
                    style={{
                      background: cfg.bgGradient,
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <TypeIcon type={type} size={14} color="#ffffff" />
                    <span>{cfg.label}</span>
                  </span>
                );
              })}
            </div>

            {/* Compact Biometrics Grid (Height, Weight, Abilities) */}
            <div className="biometrics-card">
              <div className="biometric-item">
                <div className="biometric-header">
                  <Ruler size={13} color="var(--lens-cyan)" />
                  <span>ALTURA</span>
                </div>
                <span className="biometric-val">{heightM} {detail ? 'm' : ''}</span>
              </div>

              <div className="biometric-item">
                <div className="biometric-header">
                  <Weight size={13} color="var(--lens-cyan)" />
                  <span>PESO</span>
                </div>
                <span className="biometric-val">{weightKg} {detail ? 'kg' : ''}</span>
              </div>

              <div className="biometric-item full-width">
                <div className="biometric-header">
                  <Sparkle size={13} color="var(--lens-cyan)" />
                  <span>HABILIDADES</span>
                </div>
                <span className="biometric-val-abilities">
                  {detail && detail.abilities.length > 0
                    ? detail.abilities.map((a) => a.name.replace(/-/g, ' ')).join(', ')
                    : loading
                    ? 'Indexando dados biométricos...'
                    : 'Padrão da espécie'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DATA READOUT & INTERACTIVE TABS */}
          <div className="diagnostic-readout-panel">
            {/* Genus Subtitle */}
            {genus && <div className="specimen-genus-text">{genus}</div>}

            {/* Terminal Pokédex Entry Text */}
            {flavorText ? (
              <div className="terminal-entry-box">
                &gt; {flavorText}
              </div>
            ) : loading ? (
              <div className="terminal-entry-box" style={{ color: 'var(--text-dim)' }}>
                &gt; Sincronizando registros da Pokédex Nacional...
              </div>
            ) : null}

            {/* Interactive Terminal Navigation Tabs */}
            <div className="terminal-tabs-row">
              <button
                className={`terminal-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                <Activity size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                ATRIBUTOS & BST
              </button>
              <button
                className={`terminal-tab-btn ${activeTab === 'evolution' ? 'active' : ''}`}
                onClick={() => setActiveTab('evolution')}
              >
                <GitFork size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                LINHA EVOLUTIVA
              </button>
              <button
                className={`terminal-tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
                onClick={() => setActiveTab('locations')}
              >
                <Compass size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                JOGOS & LOCAIS ({locations.length})
              </button>
            </div>

            {/* Tab Content Panel */}
            <div className="terminal-tab-viewport">
              {loading && !detail ? (
                <div
                  className="empty-state"
                  style={{
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Loader2
                    size={40}
                    color="#00f0ff"
                    className="spin-inline"
                    style={{ marginBottom: 14 }}
                  />
                  <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                    SINTETIZANDO TELEMETRIA DO ESPÉCIME...
                  </h3>
                  <p>Consultando base de dados biológica e cartuchos oficiais.</p>
                </div>
              ) : loadError && !detail ? (
                <div
                  className="empty-state"
                  style={{
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={36} color="#f59e0b" style={{ marginBottom: 12 }} />
                  <h3>FALHA DE COMUNICAÇÃO</h3>
                  <p>{loadError}</p>
                  <button
                    type="button"
                    className="terminal-tab-btn active"
                    style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    onClick={() => loadData(pokemonId)}
                  >
                    <RotateCcw size={14} />
                    <span>TENTAR NOVAMENTE</span>
                  </button>
                </div>
              ) : (
                <>
                  {activeTab === 'stats' && detail && (
                    <div className="console-stat-list">
                      {detail.stats.map((st) => {
                        const meta = STAT_NAMES[st.name] || {
                          label: st.name.toUpperCase(),
                          color: '#38bdf8',
                        };
                        const pct = Math.min(Math.round((st.base_stat / 255) * 100), 100);

                        const barColor =
                          st.base_stat >= 100
                            ? '#00ff66'
                            : st.base_stat >= 65
                            ? '#38bdf8'
                            : st.base_stat >= 45
                            ? '#f59e0b'
                            : '#ef4444';

                        return (
                          <div key={st.name} className="console-stat-row">
                            <span className="console-stat-label">{meta.label}</span>
                            <span className="console-stat-number">{st.base_stat}</span>
                            <div className="console-stat-track">
                              <div
                                className="console-stat-fill"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: barColor,
                                  color: barColor,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <div className="console-bst-row">
                        <span className="console-bst-label">BASE STAT TOTAL (BST)</span>
                        <span className="console-bst-value">{detail.baseStatTotal}</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'evolution' && (
                    <EvolutionChain
                      stages={evolutionStages}
                      currentId={activePokemonId}
                      onSelectPokemon={onSelectPokemon}
                    />
                  )}

                  {activeTab === 'locations' && (
                    <GameLocations locations={locations} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      </ErrorBoundary>
    </div>,
    document.body
  );
};
