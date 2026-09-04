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
import { POKEMON_TYPES } from '../constants/pokemonData';
import { StatBar } from './StatBar';
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

        // Fetch Species & Evolution & Locations in parallel
        const [speciesData, locData] = await Promise.all([
          fetchPokemonSpecies(pDetail.speciesUrl),
          fetchPokemonLocations(pDetail.locationEncountersUrl),
        ]);

        if (!isMounted) return;
        setFlavorText(speciesData.flavorText);
        setGenus(speciesData.genus);
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
        console.error('Erro ao carregar modal:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [pokemonId]);

  // Keyboard navigation (Esc to close, Arrow keys to navigate)
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
  const formattedId = `#${String(pokemonId).padStart(4, '0')}`;

  const currentImage = isShiny
    ? detail?.spriteShiny || detail?.spriteOfficialArtwork
    : detail?.spriteOfficialArtwork || detail?.spriteDefault;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={
          {
            '--modal-glow-color': typeConfig.glow,
            '--modal-border-color': typeConfig.color,
            '--modal-header-gradient': `linear-gradient(180deg, ${typeConfig.glow} 0%, rgba(15, 23, 42, 0.95) 100%)`,
          } as React.CSSProperties
        }
      >
        {/* Navigation Arrows */}
        {pokemonId > 1 && (
          <button
            className="modal-nav-arrow prev"
            onClick={() => onSelectPokemon(pokemonId - 1)}
            title="Pokémon Anterior"
            aria-label="Pokémon Anterior"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {pokemonId < totalPokemonCount && (
          <button
            className="modal-nav-arrow next"
            onClick={() => onSelectPokemon(pokemonId + 1)}
            title="Próximo Pokémon"
            aria-label="Próximo Pokémon"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          title="Fechar"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="empty-state" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={44} className="empty-state-icon" style={{ animation: 'spin 1s linear infinite' }} />
            <h3>Carregando dados da PokéAPI...</h3>
          </div>
        ) : (
          detail && (
            <>
              {/* Modal Hero Header */}
              <div className="modal-hero">
                <span className="modal-id">{formattedId}</span>
                <h2 className="modal-title">{detail.name}</h2>
                {genus && <span className="modal-genus">{genus}</span>}

                {/* Types */}
                <div className="modal-types">
                  {detail.types.map((type) => {
                    const cfg = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
                    return (
                      <span
                        key={type}
                        className="type-tag"
                        style={{ background: cfg.bgGradient }}
                      >
                        {cfg.label}
                      </span>
                    );
                  })}
                </div>

                {/* Artwork with ambient aura */}
                <div className="modal-image-container">
                  <div className="modal-image-glow" />
                  <img
                    src={currentImage}
                    alt={detail.name}
                    className="modal-image"
                  />
                </div>

                {/* Interactive Controls (Cry Audio, Shiny toggle, Favorite) */}
                <div className="modal-interactive-controls">
                  <button
                    className={`control-pill-btn ${isPlayingCry ? 'active' : ''}`}
                    onClick={handlePlayCry}
                    title="Tocar som oficial do Pokémon"
                  >
                    <Volume2 size={16} />
                    <span>Som Oficial</span>
                    {isPlayingCry && (
                      <span className="cry-wave-bar">
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </button>

                  <button
                    className={`control-pill-btn ${isShiny ? 'active' : ''}`}
                    onClick={() => setIsShiny((prev) => !prev)}
                    title="Alternar versão Brilhante (Shiny)"
                  >
                    <Sparkles size={16} />
                    <span>{isShiny ? 'Normal' : 'Shiny ✨'}</span>
                  </button>

                  <button
                    className={`control-pill-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) =>
                      onToggleFavorite(
                        {
                          id: detail.id,
                          name: detail.name,
                          url: `https://pokeapi.co/api/v2/pokemon/${detail.id}`,
                          sprite: detail.spriteOfficialArtwork,
                          types: detail.types,
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
                    <span>{isFavorite ? 'Favorito' : 'Favoritar'}</span>
                  </button>
                </div>
              </div>

              {/* Tabs Nav */}
              <div className="modal-tabs-nav">
                <button
                  className={`modal-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stats')}
                >
                  <Activity size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                  Visão Geral & Atributos
                </button>
                <button
                  className={`modal-tab-btn ${activeTab === 'evolution' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evolution')}
                >
                  <GitFork size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                  Linha Evolutiva
                </button>
                <button
                  className={`modal-tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('locations')}
                >
                  <Compass size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                  Jogos e Locais ({locations.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="modal-tab-content">
                {activeTab === 'stats' && (
                  <div>
                    {flavorText && (
                      <div className="flavor-text-box">
                        "{flavorText}"
                      </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="info-metrics-grid">
                      <div className="info-metric-card">
                        <span className="info-metric-label">Altura</span>
                        <span className="info-metric-value">
                          {(detail.height / 10).toFixed(1)} m
                        </span>
                      </div>
                      <div className="info-metric-card">
                        <span className="info-metric-label">Peso</span>
                        <span className="info-metric-value">
                          {(detail.weight / 10).toFixed(1)} kg
                        </span>
                      </div>
                      <div className="info-metric-card">
                        <span className="info-metric-label">Habilidades</span>
                        <span className="info-metric-value" style={{ fontSize: '1rem', textTransform: 'capitalize' }}>
                          {detail.abilities.map((a) => a.name.replace(/-/g, ' ')).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Base Stats with Animated Progress Bars */}
                    <h3 style={{ marginBottom: 16, fontSize: '1.15rem' }}>Estatísticas Básicas</h3>
                    <div className="stats-container">
                      {detail.stats.map((st) => (
                        <StatBar key={st.name} name={st.name} value={st.base_stat} />
                      ))}

                      <div className="bst-row">
                        <span className="bst-label">Total de Atributos (BST)</span>
                        <span className="bst-value">{detail.baseStatTotal}</span>
                      </div>
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
            </>
          )
        )}
      </div>
    </div>
  );
};
