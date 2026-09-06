import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import type {
  PokemonDetail,
  EvolutionStage,
  GameLocations as IGameLocations,
  PokemonListItem,
} from '../types/pokemon';
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonLocations,
} from '../services/pokeapi';
import { POKEMON_TYPES, STAT_NAMES } from '../constants/pokemonData';
import { getJapaneseName } from '../constants/japaneseNames';
import { TypeIcon } from './TypeIcon';
import { EvolutionChain } from './EvolutionChain';
import { GameLocations } from './GameLocations';
import type { SpriteStyle } from '../constants/spriteStyles';
import { SPRITE_STYLES, getPokemonSpriteUrl } from '../constants/spriteStyles';

interface PokemonModalProps {
  pokemonId: number | null;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [isShiny, setIsShiny] = useState<boolean>(false);
  const [isPlayingCry, setIsPlayingCry] = useState<boolean>(false);
  const [modalSpriteStyle, setModalSpriteStyle] = useState<SpriteStyle>(initialSpriteStyle);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setModalSpriteStyle(initialSpriteStyle);
  }, [initialSpriteStyle, pokemonId]);

  useEffect(() => {
    if (!pokemonId) return;

    let isMounted = true;
    setLoading(true);
    setIsShiny(false);

    async function loadData() {
      try {
        const pDetail = await fetchPokemonDetail(pokemonId!);
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
        setJapaneseName(speciesData.japaneseName || getJapaneseName(pokemonId!));
        setLocations(locData);

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
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [pokemonId]);

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
    if (!detail?.cryUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(detail.cryUrl);
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

  const primaryType = detail?.types[0] || 'normal';
  const typeConfig = POKEMON_TYPES[primaryType] || POKEMON_TYPES.normal;
  const formattedId = `№ ${String(pokemonId).padStart(4, '0')}`;
  const heightM = detail ? (detail.height / 10).toFixed(1) : '0.0';
  const weightKg = detail ? (detail.weight / 10).toFixed(1) : '0.0';

  const currentImage = getPokemonSpriteUrl(pokemonId, modalSpriteStyle, isShiny);

  return (
    <div className="diagnostic-overlay" onClick={onClose} role="dialog" aria-modal="true">
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
                <span className="terminal-pokemon-title">{detail?.name}</span>
                {japaneseName && (
                  <span className="terminal-japanese-tag">{japaneseName}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Right at the Top Header */}
          <div className="terminal-top-actions">
            {detail && (
              <>
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
                  className={`terminal-action-btn ${isFavorite ? 'active-fav' : ''}`}
                  onClick={(e) =>
                    onToggleFavorite(
                      {
                        id: detail.id,
                        name: detail.name,
                        url: `https://pokeapi.co/api/v2/pokemon/${detail.id}`,
                        sprite: detail.spriteOfficialArtwork,
                        types: detail.types,
                        japaneseName: japaneseName || getJapaneseName(detail.id),
                      },
                      e
                    )
                  }
                  title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                >
                  <Heart
                    size={15}
                    fill={isFavorite ? '#ef4444' : 'none'}
                    color={isFavorite ? '#ef4444' : 'currentColor'}
                  />
                  <span>FAVORITO</span>
                </button>
              </>
            )}

            {/* Navigation & Close Buttons */}
            <div className="terminal-nav-divider" />

            {pokemonId > 1 && (
              <button
                className="terminal-close-btn"
                onClick={() => onSelectPokemon(pokemonId - 1)}
                title="Espécime Anterior"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            {pokemonId < totalPokemonCount && (
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

        {loading ? (
          <div
            className="empty-state"
            style={{
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader2
              size={48}
              color="#00f0ff"
              style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }}
            />
            <h3 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              CARREGANDO TELEMETRIA DO ESPÉCIME...
            </h3>
          </div>
        ) : (
          detail && (
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
                    src={currentImage}
                    alt={detail.name}
                    className={`holo-sprite-img ${modalSpriteStyle !== 'official' ? 'pixelated-sprite' : ''}`}
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getPokemonSpriteUrl(pokemonId, 'official', isShiny);
                    }}
                  />

                  {/* Vertical Scanner Line */}
                  <div className="holo-laser-scanline" />
                </div>

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
                  {detail.types.map((type) => {
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
                    <span className="biometric-val">{heightM} m</span>
                  </div>

                  <div className="biometric-item">
                    <div className="biometric-header">
                      <Weight size={13} color="var(--lens-cyan)" />
                      <span>PESO</span>
                    </div>
                    <span className="biometric-val">{weightKg} kg</span>
                  </div>

                  <div className="biometric-item full-width">
                    <div className="biometric-header">
                      <Sparkle size={13} color="var(--lens-cyan)" />
                      <span>HABILIDADES</span>
                    </div>
                    <span className="biometric-val-abilities">
                      {detail.abilities.map((a) => a.name.replace(/-/g, ' ')).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: DATA READOUT & INTERACTIVE TABS */}
              <div className="diagnostic-readout-panel">
                {/* Genus Subtitle */}
                {genus && <div className="specimen-genus-text">{genus}</div>}

                {/* Terminal Pokédex Entry Text */}
                {flavorText && (
                  <div className="terminal-entry-box">
                    &gt; {flavorText}
                  </div>
                )}

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
                  {activeTab === 'stats' && (
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
                      currentId={detail.id}
                      onSelectPokemon={onSelectPokemon}
                    />
                  )}

                  {activeTab === 'locations' && (
                    <GameLocations locations={locations} />
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
