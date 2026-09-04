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
import { EvolutionChain } from './EvolutionChain';
import { GameLocations } from './GameLocations';

interface PokemonModalProps {
  pokemonId: number | null;
  onClose: () => void;
  onSelectPokemon: (id: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: PokemonListItem, event?: React.MouseEvent) => void;
  totalPokemonCount?: number;
}

type TabType = 'stats' | 'evolution' | 'locations';

export const PokemonModal: React.FC<PokemonModalProps> = ({
  pokemonId,
  onClose,
  onSelectPokemon,
  isFavorite,
  onToggleFavorite,
  totalPokemonCount = 1025,
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

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const currentImage = isShiny
    ? detail?.spriteShiny || detail?.spriteOfficialArtwork
    : detail?.spriteOfficialArtwork || detail?.spriteDefault;

  return (
    <div className="diagnostic-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="diagnostic-terminal"
        onClick={(e) => e.stopPropagation()}
        style={
          {
            '--modal-glow-color': typeConfig.glow,
          } as React.CSSProperties
        }
      >
        {/* Terminal Hardware Top Header */}
        <div className="terminal-top-header">
          <div className="terminal-title-bar">
            <div className="terminal-lens-mini" />
            <span className="terminal-heading-text">
              TERMINAL DE ANÁLISE BIOMÉTRICA // {formattedId}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              className="terminal-close-btn"
              onClick={onClose}
              title="Encerrar Terminal"
              aria-label="Encerrar Terminal"
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
              CALIBRANDO SENSORES ÓPTICOS...
            </h3>
            <p style={{ color: 'var(--text-dim)' }}>
              Acessando banco de dados regional da Silph Co.
            </p>
          </div>
        ) : (
          detail && (
            <div className="terminal-screens-layout">
              {/* LEFT SCREEN: BIOMETRIC HOLOGRAPHIC CHAMBER */}
              <div className="holo-chamber">
                {/* Target Reticle & Crosshairs */}
                <div className="holo-target-reticle">
                  <div className="holo-target-cross-h" />
                  <div className="holo-target-cross-v" />
                </div>

                {/* Laser Scanning Line */}
                <div className="holo-laser-scanline" />

                {/* Holographic Sprite Stage */}
                <div className="holo-sprite-stage">
                  <img
                    src={currentImage}
                    alt={detail.name}
                    className="holo-sprite-img"
                  />
                </div>

                {/* Physical Scale Comparison Bar */}
                <div className="height-scale-meter">
                  <span>
                    <Ruler size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                    ALTURA: <strong>{heightM} m</strong>
                  </span>
                  <span>
                    <Weight size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                    PESO: <strong>{weightKg} kg</strong>
                  </span>
                </div>

                {/* Chamber Hardware Controls */}
                <div className="chamber-controls-group">
                  <button
                    className={`chamber-ctrl-btn ${isPlayingCry ? 'active' : ''}`}
                    onClick={handlePlayCry}
                    title="Reproduzir sintetizador de áudio do espécime"
                  >
                    <Volume2 size={16} />
                    <span>RUGIDO</span>
                    {isPlayingCry && (
                      <span className="audio-spectrum-bars">
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </button>

                  <button
                    className={`chamber-ctrl-btn ${isShiny ? 'active' : ''}`}
                    onClick={() => setIsShiny((prev) => !prev)}
                    title="Alternar filtro de coloração Shiny"
                  >
                    <Sparkles size={16} />
                    <span>{isShiny ? 'SHINY ✨' : 'NORMAL'}</span>
                  </button>

                  <button
                    className={`chamber-ctrl-btn ${isFavorite ? 'active' : ''}`}
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
                    title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <Heart
                      size={16}
                      fill={isFavorite ? '#ef4444' : 'none'}
                      color={isFavorite ? '#ef4444' : 'currentColor'}
                    />
                  </button>
                </div>
              </div>

              {/* RIGHT SCREEN: DIAGNOSTIC READOUT & TELEMETRY */}
              <div className="diagnostic-readout-panel">
                {/* Header Banner */}
                <div className="specimen-id-banner">
                  <div>
                    <h2 className="specimen-full-name">{detail.name}</h2>
                    <div className="specimen-genus-text">{genus}</div>
                  </div>
                  {japaneseName && (
                    <div className="specimen-japanese-badge" title="Nome Oficial Japonês">
                      {japaneseName}
                    </div>
                  )}
                </div>

                {/* Type Badges */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {detail.types.map((type) => {
                    const cfg = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
                    return (
                      <span
                        key={type}
                        className="type-metal-badge"
                        style={{ background: cfg.bgGradient, padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        {cfg.label}
                      </span>
                    );
                  })}
                </div>

                {/* Terminal Entry Readout Box */}
                {flavorText && (
                  <div className="terminal-entry-box">
                    &gt; {flavorText}
                  </div>
                )}

                {/* Quick Metrics */}
                <div className="quick-metrics-row">
                  <div className="quick-metric-card">
                    <span className="label">HABILIDADES</span>
                    <span className="val" style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>
                      {detail.abilities.map((a) => a.name.replace(/-/g, ' ')).join(', ')}
                    </span>
                  </div>
                  <div className="quick-metric-card">
                    <span className="label">BASE STAT TOTAL</span>
                    <span className="val" style={{ color: 'var(--holo-amber)' }}>
                      {detail.baseStatTotal}
                    </span>
                  </div>
                  <div className="quick-metric-card">
                    <span className="label">REGISTRO</span>
                    <span className="val" style={{ color: 'var(--lens-cyan)' }}>
                      {formattedId}
                    </span>
                  </div>
                </div>

                {/* Terminal Tabs Row */}
                <div className="terminal-tabs-row">
                  <button
                    className={`terminal-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                  >
                    <Activity size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                    TELEMETRIA & STATS
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
                    CARTUCHOS & LOCAIS ({locations.length})
                  </button>
                </div>

                {/* Tab Content Panels */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {activeTab === 'stats' && (
                    <div className="console-stat-list">
                      {detail.stats.map((st) => {
                        const meta = STAT_NAMES[st.name] || {
                          label: st.name.toUpperCase(),
                          color: '#38bdf8',
                        };
                        const pct = Math.min(Math.round((st.base_stat / 255) * 100), 100);

                        // Console color grading
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
