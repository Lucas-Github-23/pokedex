import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { PokemonList } from './components/PokemonList';
import { PokemonModal } from './components/PokemonModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { AdvancedFilterModal } from './components/AdvancedFilterModal';
import { ActiveFilterChips } from './components/ActiveFilterChips';
import { XbrSvgFilter } from './components/XbrSvgFilter';
import { useFavorites } from './hooks/useFavorites';
import {
  fetchAllPokemonList,
  fetchPokemonByType,
} from './services/pokeapi';
import {
  DEFAULT_ADVANCED_FILTERS,
  type AdvancedFilters,
  type PokemonListItem,
  type GenerationKey,
  type SortKey,
} from './types/pokemon';
import { GENERATIONS } from './constants/pokemonData';
import { POKEMON_BASE_DATA } from './constants/pokemonBaseData';
import type { SpriteStyle } from './constants/spriteStyles';
import { KNOWN_ALTERNATIVE_FORMS } from './constants/pokemonForms';
import {
  countActiveFilters,
  getActiveFilterChips,
  HEIGHT_CLASSES,
  WEIGHT_CLASSES,
} from './utils/filterHelpers';

const PAGE_SIZE = 36;

export const App: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [typeFilteredList, setTypeFilteredList] = useState<PokemonListItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<GenerationKey>('all');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('id-asc');
  const [spriteStyle, setSpriteStyle] = useState<SpriteStyle>('official');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Advanced Filters & Modal state
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(DEFAULT_ADVANCED_FILTERS);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState<boolean>(false);

  // Modal & Drawer states
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const { favorites, isFavorite, toggleFavorite, clearAllFavorites, count: favoritesCount } = useFavorites();

  // Load all Pokemon list initially
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const list = await fetchAllPokemonList();
        setAllPokemon(list);

        // Check if URL has ?name= or ?id= to open modal (backward compatibility)
        const params = new URLSearchParams(window.location.search);
        const nameParam = params.get('name');
        const idParam = params.get('id');

        if (nameParam) {
          const match = list.find((p) => p.name.toLowerCase() === nameParam.toLowerCase());
          if (match) {
            setSelectedPokemonId(match.id);
          }
        } else if (idParam) {
          const num = parseInt(idParam, 10);
          if (!isNaN(num)) {
            setSelectedPokemonId(num);
          }
        }
      } catch (error) {
        console.error('Falha ao carregar Pokédex:', error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // Handle Type filter changes (fetch type-specific list if selected)
  useEffect(() => {
    if (!selectedType) {
      setTypeFilteredList(null);
      return;
    }

    let isMounted = true;
    async function loadTypePokemon() {
      try {
        const typePokemon = await fetchPokemonByType(selectedType);
        if (isMounted) {
          setTypeFilteredList(typePokemon);
        }
      } catch (err) {
        console.error('Erro ao buscar tipo:', err);
      }
    }

    loadTypePokemon();

    return () => {
      isMounted = false;
    };
  }, [selectedType]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedGeneration, selectedType, sortKey, onlyFavorites, advancedFilters]);

  // Filter and Sort Pipeline
  const filteredAndSortedPokemon = useMemo(() => {
    // 1. Start with base list (either type-filtered or all)
    let list = typeFilteredList !== null ? [...typeFilteredList] : [...allPokemon];

    // 2. Only Favorites filter
    if (onlyFavorites) {
      list = list.filter((p) => isFavorite(p.id));
    }

    // 3. Search query filter (supporting prefix syntax 'tipo:', 'região:' or generic text / form tags)
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      if (term === 'favorito' || term === 'favoritos' || term === 'fav') {
        list = list.filter((p) => isFavorite(p.id));
      } else if (term === 'mega' || term === 'megas') {
        list = list.filter((p) =>
          KNOWN_ALTERNATIVE_FORMS[p.id]?.some((f) => f.category === 'mega')
        );
      } else if (term === 'alola' || term === 'alolan') {
        list = list.filter((p) =>
          KNOWN_ALTERNATIVE_FORMS[p.id]?.some((f) => f.category === 'alola')
        );
      } else if (term === 'galar' || term === 'galarian') {
        list = list.filter((p) =>
          KNOWN_ALTERNATIVE_FORMS[p.id]?.some((f) => f.category === 'galar')
        );
      } else if (term === 'hisui' || term === 'hisuian') {
        list = list.filter((p) =>
          KNOWN_ALTERNATIVE_FORMS[p.id]?.some((f) => f.category === 'hisui')
        );
      } else if (term === 'paldea' || term === 'paldean') {
        list = list.filter((p) =>
          KNOWN_ALTERNATIVE_FORMS[p.id]?.some((f) => f.category === 'paldea')
        );
      } else if (term === 'gmax' || term === 'gigantamax') {
        list = list.filter((p) =>
          KNOWN_ALTERNATIVE_FORMS[p.id]?.some((f) => f.category === 'gmax')
        );
      } else if (term === 'primal' || term === 'primais') {
        list = list.filter((p) =>
          KNOWN_ALTERNATIVE_FORMS[p.id]?.some((f) => f.category === 'primal')
        );
      } else if (term === 'forma' || term === 'formas' || term === 'variantes') {
        list = list.filter((p) => Boolean(KNOWN_ALTERNATIVE_FORMS[p.id]?.length));
      } else if (term.startsWith('tipo:')) {
        const typeArg = term.replace('tipo:', '').trim();
        if (typeArg && selectedType !== typeArg) {
          list = list.filter((p) =>
            p.types?.some((t) => t.toLowerCase() === typeArg.toLowerCase())
          );
        }
      } else if (term.startsWith('região:') || term.startsWith('regiao:')) {
        const genNum = term.replace(/regi[ãa]o:/, '').trim();
        const gen = GENERATIONS.find((g) => g.id === genNum || g.region.toLowerCase() === genNum);
        if (gen) {
          list = list.filter((p) => p.id >= gen.range[0] && p.id <= gen.range[1]);
        }
      } else {
        // Search by name, ID (e.g. 25, #0025, pikachu) or form tag match
        const numericSearch = parseInt(term.replace('#', ''), 10);
        list = list.filter((p) => {
          const matchName = p.name.toLowerCase().includes(term);
          const matchId = !isNaN(numericSearch) && p.id === numericSearch;
          const matchForm = KNOWN_ALTERNATIVE_FORMS[p.id]?.some(
            (f) => f.tag.toLowerCase().includes(term) || f.category.toLowerCase().includes(term)
          );
          return matchName || matchId || matchForm;
        });
      }
    }

    // 4. Generation filter (single or multi-selection from advanced filters)
    if (!onlyFavorites) {
      if (advancedFilters.generations.length > 0) {
        list = list.filter((p) => {
          return advancedFilters.generations.some((genId) => {
            const genConfig = GENERATIONS.find((g) => g.id === genId);
            return genConfig && p.id >= genConfig.range[0] && p.id <= genConfig.range[1];
          });
        });
      } else if (selectedGeneration !== 'all') {
        const genConfig = GENERATIONS.find((g) => g.id === selectedGeneration);
        if (genConfig) {
          list = list.filter(
            (p) => p.id >= genConfig.range[0] && p.id <= genConfig.range[1]
          );
        }
      }
    }

    // 5. Advanced Type Filtering (primaryType, secondaryType, typeMode)
    if (advancedFilters.primaryType || advancedFilters.secondaryType || advancedFilters.typeMode !== 'any') {
      list = list.filter((p) => {
        const types = p.types || [];
        const prim = advancedFilters.primaryType;
        const sec = advancedFilters.secondaryType;

        if (advancedFilters.typeMode === 'mono') {
          if (types.length !== 1) return false;
          if (prim && types[0] !== prim) return false;
          return true;
        }

        if (advancedFilters.typeMode === 'dual') {
          if (types.length < 2) return false;
          if (prim && !types.includes(prim)) return false;
          if (sec && !types.includes(sec)) return false;
          return true;
        }

        if (advancedFilters.typeMode === 'exact') {
          if (prim && sec) {
            return types.length === 2 && types.includes(prim) && types.includes(sec);
          }
          if (prim) {
            return types.length === 1 && types[0] === prim;
          }
          return true;
        }

        // Default 'any' type mode
        if (prim && !types.includes(prim)) return false;
        if (sec && !types.includes(sec)) return false;
        return true;
      });
    }

    // 6. Categories (Starters, Legendaries, Mythicals, Paradox, Ultra Beasts, Babies, Fossils, Pseudo-Legendaries, Forms)
    if (advancedFilters.categories.length > 0) {
      list = list.filter((p) => {
        const base = POKEMON_BASE_DATA[p.id];
        if (!base) return false;

        return advancedFilters.categories.some((cat) => {
          if (cat === 'forms') {
            return Boolean(KNOWN_ALTERNATIVE_FORMS[p.id]?.length);
          }
          return base.category === cat;
        });
      });
    }

    // 7. Evolution Stages
    if (advancedFilters.evolutionStages.length > 0) {
      list = list.filter((p) => {
        const base = POKEMON_BASE_DATA[p.id];
        return base && advancedFilters.evolutionStages.includes(base.stage);
      });
    }

    // 8. BST Range
    if (advancedFilters.minBst > 180 || advancedFilters.maxBst < 780) {
      list = list.filter((p) => {
        const bst = POKEMON_BASE_DATA[p.id]?.bst || 300;
        return bst >= advancedFilters.minBst && bst <= advancedFilters.maxBst;
      });
    }

    // 9. Dominant Stat (Specialty)
    if (advancedFilters.dominantStat) {
      list = list.filter((p) => {
        const b = POKEMON_BASE_DATA[p.id];
        if (!b) return false;
        const statMap: Record<string, number> = {
          hp: b.hp,
          atk: b.atk,
          def: b.def,
          spa: b.spa,
          spd: b.spd,
          spe: b.spe,
        };
        const targetVal = statMap[advancedFilters.dominantStat] || 0;
        return Object.values(statMap).every((val) => targetVal >= val);
      });
    }

    // 10. Minimum Stat Thresholds
    const minStats = advancedFilters.minStat;
    if (Object.values(minStats).some((v) => v > 0)) {
      list = list.filter((p) => {
        const b = POKEMON_BASE_DATA[p.id];
        if (!b) return false;
        return (
          b.hp >= minStats.hp &&
          b.atk >= minStats.atk &&
          b.def >= minStats.def &&
          b.spa >= minStats.spa &&
          b.spd >= minStats.spd &&
          b.spe >= minStats.spe
        );
      });
    }

    // 11. Height Class
    if (advancedFilters.heightClass !== 'any') {
      const range = HEIGHT_CLASSES[advancedFilters.heightClass];
      if (range) {
        list = list.filter((p) => {
          const h = POKEMON_BASE_DATA[p.id]?.heightM || 1.0;
          return h >= range.min && h < range.max;
        });
      }
    }

    // 12. Weight Class
    if (advancedFilters.weightClass !== 'any') {
      const range = WEIGHT_CLASSES[advancedFilters.weightClass];
      if (range) {
        list = list.filter((p) => {
          const w = POKEMON_BASE_DATA[p.id]?.weightKg || 20.0;
          return w >= range.min && w < range.max;
        });
      }
    }

    // 13. Sorting
    list.sort((a, b) => {
      const baseA = POKEMON_BASE_DATA[a.id] || { bst: 0, hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, weightKg: 0, heightM: 0 };
      const baseB = POKEMON_BASE_DATA[b.id] || { bst: 0, hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, weightKg: 0, heightM: 0 };

      switch (sortKey) {
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'bst-desc':
          return baseB.bst - baseA.bst;
        case 'bst-asc':
          return baseA.bst - baseB.bst;
        case 'hp-desc':
          return baseB.hp - baseA.hp;
        case 'atk-desc':
          return baseB.atk - baseA.atk;
        case 'def-desc':
          return baseB.def - baseA.def;
        case 'spa-desc':
          return baseB.spa - baseA.spa;
        case 'spd-desc':
          return baseB.spd - baseA.spd;
        case 'spe-desc':
          return baseB.spe - baseA.spe;
        case 'weight-desc':
          return baseB.weightKg - baseA.weightKg;
        case 'weight-asc':
          return baseA.weightKg - baseB.weightKg;
        case 'height-desc':
          return baseB.heightM - baseA.heightM;
        case 'height-asc':
          return baseA.heightM - baseB.heightM;
        default:
          return a.id - b.id;
      }
    });

    return list;
  }, [
    allPokemon,
    typeFilteredList,
    onlyFavorites,
    isFavorite,
    searchTerm,
    selectedGeneration,
    selectedType,
    sortKey,
    advancedFilters,
  ]);

  // Active filters count & chips
  const activeAdvancedCount = useMemo(() => countActiveFilters(advancedFilters), [advancedFilters]);
  const activeChips = useMemo(() => getActiveFilterChips(advancedFilters, setAdvancedFilters), [advancedFilters]);

  // Paginated visible slice
  const visiblePokemon = useMemo(() => {
    return filteredAndSortedPokemon.slice(0, visibleCount);
  }, [filteredAndSortedPokemon, visibleCount]);

  const hasMore = visibleCount < filteredAndSortedPokemon.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredAndSortedPokemon.length));
  }, [filteredAndSortedPokemon.length]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedGeneration('all');
    setSelectedType('');
    setSortKey('id-asc');
    setOnlyFavorites(false);
    setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pokedex-chassis">
      {/* GPU-Accelerated Real-Time xBR 2x Vector Filter Definitions */}
      <XbrSvgFilter />

      {/* Top Hardware Bar: Sensor Lens + Indicator LEDs + HUD */}
      <Navbar
        favoritesCount={favoritesCount}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {/* Recessed High-Tech LCD Screen Enclosure */}
      <div className="pokedex-screen-enclosure">
        <main className="pokedex-lcd-screen">
          {/* Authentic Pokédex Screen Bezel Corner Screws */}
          <span className="lcd-screw tl" aria-hidden="true" />
          <span className="lcd-screw tr" aria-hidden="true" />
          <span className="lcd-screw bl" aria-hidden="true" />
          <span className="lcd-screw br" aria-hidden="true" />

          {/* Authentic Top Bezel Sensors & Speaker Slits */}
          <div className="lcd-hardware-bezel-top" aria-hidden="true">
            <div className="lcd-bezel-lamps">
              <span className="lcd-bezel-lamp red" />
              <span className="lcd-bezel-lamp red" />
            </div>
            <div className="lcd-speaker-grille">
              <span /><span /><span /><span /><span />
            </div>
          </div>

          {/* LCD Screen Device Banner */}
          <div className="lcd-banner">
            <div className="lcd-title-group">
              <h1 className="lcd-main-title">
                POKÉDEX NACIONAL
                <span className="lcd-status-badge">SILPH CO. OS</span>
              </h1>
              <span className="lcd-subtitle">
                SISTEMA BIOMÉTRICO DE REGISTRO // GERAÇÕES I - IX
              </span>
            </div>
          </div>

          {/* Filter Bar Controls */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedGeneration={selectedGeneration}
            onSelectGeneration={setSelectedGeneration}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            sortKey={sortKey}
            onSortChange={setSortKey}
            resultsCount={filteredAndSortedPokemon.length}
            selectedSpriteStyle={spriteStyle}
            onSelectSpriteStyle={setSpriteStyle}
            onlyFavorites={onlyFavorites}
            onToggleOnlyFavorites={setOnlyFavorites}
            favoritesCount={favoritesCount}
            onOpenAdvancedFilters={() => setIsAdvancedModalOpen(true)}
            activeAdvancedCount={activeAdvancedCount}
          />

          {/* Active Filter Chips Bar */}
          <ActiveFilterChips
            chips={activeChips}
            onClearAll={() => setAdvancedFilters(DEFAULT_ADVANCED_FILTERS)}
            resultsCount={filteredAndSortedPokemon.length}
          />

          {/* Pokemon Specimen Grid */}
          <PokemonList
            pokemonList={visiblePokemon}
            loading={loading}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectPokemon={setSelectedPokemonId}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            totalFilteredCount={filteredAndSortedPokemon.length}
            spriteStyle={spriteStyle}
            onlyFavorites={onlyFavorites}
          />
        </main>
      </div>

      {/* Hardware Bottom Chassis Footer */}
      <footer className="hardware-footer">
        <span>POKÉDEX HARDWARE MODEL PK-890 // SILPH CO. ARCHIVE</span>
        <span>
          DADOS FORNECIDOS POR{' '}
          <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
            POKÉAPI
          </a>{' '}
          • REACT 19 & TYPESCRIPT
        </span>
      </footer>

      {/* Advanced Filters Terminal Modal */}
      <AdvancedFilterModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        filters={advancedFilters}
        onApplyFilters={setAdvancedFilters}
        onResetFilters={() => setAdvancedFilters(DEFAULT_ADVANCED_FILTERS)}
        totalFilteredCount={filteredAndSortedPokemon.length}
      />

      {/* Dual-Screen Diagnostic Terminal Modal */}
      {selectedPokemonId !== null && (
        <PokemonModal
          pokemonId={selectedPokemonId}
          initialPokemon={allPokemon.find((p) => p.id === selectedPokemonId)}
          onClose={() => setSelectedPokemonId(null)}
          onSelectPokemon={setSelectedPokemonId}
          isFavorite={isFavorite(selectedPokemonId)}
          onToggleFavorite={toggleFavorite}
          totalPokemonCount={allPokemon.length || 1025}
          initialSpriteStyle={spriteStyle}
        />
      )}

      {/* Favorites Storage Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectPokemon={setSelectedPokemonId}
        onRemoveFavorite={toggleFavorite}
        onClearAll={clearAllFavorites}
        onViewInMainGrid={() => setOnlyFavorites(true)}
      />
    </div>
  );
};

export default App;


