import React, { useState, useMemo } from 'react';
import type { GameLocations as IGameLocations } from '../types/pokemon';
import { ENCOUNTER_METHODS_META } from '../constants/gameLocationsData';
import {
  Compass,
  Gamepad2,
  MapPin,
  Search,
  Layers,
  Sparkles,
  Footprints,
  Waves,
  Fish,
  Flame,
  TreePine,
  Mountain,
  Gift,
  Radio,
  SlidersHorizontal,
  X,
  Gauge,
  CheckCircle2,
} from 'lucide-react';

interface GameLocationsProps {
  locations: IGameLocations[];
  pokemonName?: string;
  isLegendaryOrStarter?: boolean;
}

type GenFilterType = 'all' | 'gen1-3' | 'gen4-5' | 'gen6-7' | 'gen8-9';

export const GameLocations: React.FC<GameLocationsProps> = ({
  locations,
  pokemonName = 'Este espécime',
}) => {
  const [selectedGen, setSelectedGen] = useState<GenFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate telemetry stats
  const totalGamesCount = locations.length;
  const totalAreasCount = useMemo(() => {
    return locations.reduce((acc, curr) => acc + (curr.areas?.length || curr.locations.length), 0);
  }, [locations]);

  // Filtered games
  const filteredGames = useMemo(() => {
    return locations.filter((game) => {
      // Generation filter
      if (selectedGen !== 'all' && game.group !== selectedGen) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesGame = game.game.toLowerCase().includes(q) || game.region?.toLowerCase().includes(q);
        const matchesLocation = game.locations?.some((loc) => loc.toLowerCase().includes(q));
        const matchesArea = game.areas?.some((a) => a.areaName.toLowerCase().includes(q));
        return matchesGame || matchesLocation || matchesArea;
      }

      return true;
    });
  }, [locations, selectedGen, searchQuery]);

  // Render Method Icon helper
  const renderMethodBadge = (methodKey: string) => {
    const meta = ENCOUNTER_METHODS_META[methodKey] || {
      label: methodKey.replace(/-/g, ' '),
      category: 'special' as const,
      color: '#38bdf8',
    };

    let IconComponent = Footprints;
    if (meta.category === 'water') IconComponent = Waves;
    else if (meta.category === 'rod') IconComponent = Fish;
    else if (meta.category === 'tree') IconComponent = TreePine;
    else if (meta.category === 'cave') IconComponent = Mountain;
    else if (meta.category === 'rock') IconComponent = Flame;
    else if (meta.category === 'special') IconComponent = meta.label.includes('Radar') ? Radio : Gift;

    return (
      <span
        key={methodKey}
        className="encounter-method-chip"
        style={{
          color: meta.color,
          borderColor: `${meta.color}55`,
          background: `${meta.color}15`,
        }}
        title={`Método: ${meta.label}`}
      >
        <IconComponent size={11} />
        <span>{meta.label}</span>
      </span>
    );
  };

  // If no encounters at all (e.g. Starters, legendaries like Miraidon, event-only)
  if (!locations || locations.length === 0) {
    return (
      <div className="locations-radar-empty-state">
        <div className="radar-scanner-hud">
          <div className="radar-sweep-ring" />
          <div className="radar-sweep-beam" />
          <Compass size={42} className="radar-core-icon" />
        </div>

        <div className="radar-empty-title">
          <Sparkles size={16} color="var(--poke-gold)" />
          <h3>HABITAT SELVAGEM NÃO REGISTRADO</h3>
        </div>

        <p className="radar-empty-desc">
          <strong>{pokemonName}</strong> não pode ser encontrado na natureza através de encontros de grama ou rotas convencionais nos jogos registrados da franquia.
        </p>

        <div className="acquisition-intel-grid">
          <div className="acquisition-intel-card">
            <div className="intel-card-header">
              <Gift size={15} color="var(--poke-cyan)" />
              <span>INICIAL / PRESENTE</span>
            </div>
            <p>Obtido no início da jornada com o Professor Pokémon ou como presente de NPCs especiais.</p>
          </div>

          <div className="acquisition-intel-card">
            <div className="intel-card-header">
              <Sparkles size={15} color="var(--poke-gold)" />
              <span>EVENTO & CLÍMAX</span>
            </div>
            <p>Espécimes lendários, míticos ou paradoxais requerem eventos de história ou batalhas de clímax.</p>
          </div>

          <div className="acquisition-intel-card">
            <div className="intel-card-header">
              <Layers size={15} color="#a855f7" />
              <span>LINHA EVOLUTIVA</span>
            </div>
            <p>Evolua uma forma prévia através de subida de nível, itens evolutivos ou métodos especiais.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-locations-wrapper">
      {/* Telemetry Header Bar */}
      <div className="locations-telemetry-banner">
        <div className="telemetry-stat-group">
          <div className="stat-pill">
            <Gamepad2 size={14} color="var(--poke-cyan)" />
            <span>
              <strong>{totalGamesCount}</strong> Jogos Registrados
            </span>
          </div>
          <div className="stat-pill">
            <MapPin size={14} color="var(--poke-emerald)" />
            <span>
              <strong>{totalAreasCount}</strong> Habitats Mapeados
            </span>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="locations-search-box">
          <Search size={14} className="search-box-icon" />
          <input
            type="text"
            placeholder="Filtrar por rota, caverna, floresta ou jogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="locations-filter-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="locations-search-clear"
              title="Limpar busca"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Era / Generation Tabs */}
      <div className="locations-era-filter-bar">
        <button
          type="button"
          className={`era-tab-btn ${selectedGen === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedGen('all')}
        >
          <Layers size={13} />
          <span>Todas as Eras ({totalGamesCount})</span>
        </button>

        <button
          type="button"
          className={`era-tab-btn ${selectedGen === 'gen1-3' ? 'active' : ''}`}
          onClick={() => setSelectedGen('gen1-3')}
        >
          <span>Gen I–III (GB/GBA)</span>
        </button>

        <button
          type="button"
          className={`era-tab-btn ${selectedGen === 'gen4-5' ? 'active' : ''}`}
          onClick={() => setSelectedGen('gen4-5')}
        >
          <span>Gen IV–V (NDS)</span>
        </button>

        <button
          type="button"
          className={`era-tab-btn ${selectedGen === 'gen6-7' ? 'active' : ''}`}
          onClick={() => setSelectedGen('gen6-7')}
        >
          <span>Gen VI–VII (3DS)</span>
        </button>

        <button
          type="button"
          className={`era-tab-btn ${selectedGen === 'gen8-9' ? 'active' : ''}`}
          onClick={() => setSelectedGen('gen8-9')}
        >
          <span>Gen VIII–IX (Switch)</span>
        </button>
      </div>

      {/* Filter match count indicator when searching */}
      {(searchQuery || selectedGen !== 'all') && (
        <div className="locations-active-filter-status">
          <SlidersHorizontal size={13} color="var(--poke-cyan)" />
          <span>
            Mostrando <strong>{filteredGames.length}</strong> de {totalGamesCount} edições de jogos
          </span>
          {(searchQuery || selectedGen !== 'all') && (
            <button
              type="button"
              className="reset-filter-link"
              onClick={() => {
                setSelectedGen('all');
                setSearchQuery('');
              }}
            >
              Redefinir Filtros
            </button>
          )}
        </div>
      )}

      {/* If search returns 0 matches */}
      {filteredGames.length === 0 && (
        <div className="locations-no-results">
          <Compass size={32} color="var(--poke-text-muted)" />
          <h4>Nenhum local encontrado para esses filtros</h4>
          <p>Tente alterar os termos de busca ou selecionar outra geração.</p>
        </div>
      )}

      {/* Cartridge Games Grid */}
      <div className="cartridge-games-grid">
        {filteredGames.map((gameItem) => {
          const areaItems = gameItem.areas && gameItem.areas.length > 0
            ? gameItem.areas
            : gameItem.locations.map((loc) => ({
                areaName: loc,
                rawName: loc,
                maxChance: undefined,
                methods: [],
                minLevel: null,
                maxLevel: null,
              }));

          return (
            <div
              key={gameItem.gameId || gameItem.game}
              className="cyber-cartridge-card"
              style={{
                '--cartridge-accent': gameItem.accentColor || '#38bdf8',
                '--cartridge-border': gameItem.borderColor || '#0284c7',
                '--cartridge-bg': gameItem.bgGradient || '#0f172a',
              } as React.CSSProperties}
            >
              {/* Cartridge Header */}
              <div className="cartridge-header-bar">
                <div className="cartridge-title-cluster">
                  <span
                    className="cartridge-accent-pip"
                    style={{ background: gameItem.accentColor || '#38bdf8' }}
                  />
                  <div>
                    <h4 className="cartridge-game-title">{gameItem.game}</h4>
                    <span className="cartridge-region-subtitle">
                      {gameItem.region ? `Região de ${gameItem.region}` : gameItem.consoleName}
                    </span>
                  </div>
                </div>

                <div className="cartridge-badges-cluster">
                  <span
                    className="cartridge-gen-pill"
                    style={{
                      color: gameItem.accentColor || '#38bdf8',
                      borderColor: `${gameItem.accentColor || '#38bdf8'}66`,
                      background: gameItem.badgeBg || 'rgba(56, 189, 248, 0.15)',
                    }}
                  >
                    {gameItem.genName || 'OFICIAL'} • {gameItem.consoleName || 'CONVERSÃO'}
                  </span>

                  <span className="cartridge-count-pill">
                    {areaItems.length} {areaItems.length === 1 ? 'Área' : 'Áreas'}
                  </span>
                </div>
              </div>

              {/* Areas List */}
              <div className="cartridge-areas-grid">
                {areaItems.map((area, idx) => {
                  const chanceRate = area.maxChance && area.maxChance > 0 ? area.maxChance : null;
                  const levelStr =
                    area.minLevel !== null && area.minLevel !== undefined
                      ? area.minLevel === area.maxLevel
                        ? `Lv. ${area.minLevel}`
                        : `Lv. ${area.minLevel}–${area.maxLevel}`
                      : null;

                  return (
                    <div key={`${area.rawName}-${idx}`} className="area-encounter-entry">
                      <div className="area-name-row">
                        <MapPin size={13} className="area-pin-icon" />
                        <span className="area-readable-name">{area.areaName}</span>
                      </div>

                      {/* Area Telemetry Badges */}
                      <div className="area-details-row">
                        {chanceRate !== null && (
                          <span
                            className="area-chance-badge"
                            style={{
                              color:
                                chanceRate >= 50
                                  ? '#4ade80'
                                  : chanceRate >= 20
                                  ? '#38bdf8'
                                  : '#fbbf24',
                            }}
                            title={`Taxa de Encontro Máxima: ${chanceRate}%`}
                          >
                            <Gauge size={11} />
                            <span>{chanceRate}% Chance</span>
                          </span>
                        )}

                        {levelStr && (
                          <span className="area-level-badge" title={`Faixa de Níveis: ${levelStr}`}>
                            <CheckCircle2 size={11} color="#94a3b8" />
                            <span>{levelStr}</span>
                          </span>
                        )}

                        {/* Methods list */}
                        {area.methods && area.methods.length > 0 ? (
                          <div className="area-methods-wrap">
                            {area.methods.map((method) => renderMethodBadge(method))}
                          </div>
                        ) : (
                          <span className="encounter-method-chip default-chip">
                            <Footprints size={11} />
                            <span>Encontro Selvagem</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
