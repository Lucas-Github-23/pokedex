import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { PokemonList } from './components/PokemonList';
import { PokemonModal } from './components/PokemonModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { useFavorites } from './hooks/useFavorites';
import {
  fetchAllPokemonList,
  fetchPokemonByType,
} from './services/pokeapi';
import type { PokemonListItem, GenerationKey, SortKey } from './types/pokemon';
import { GENERATIONS } from './constants/pokemonData';
import type { SpriteStyle } from './constants/spriteStyles';
import { KNOWN_ALTERNATIVE_FORMS } from './constants/pokemonForms';

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
  }, [searchTerm, selectedGeneration, selectedType, sortKey, onlyFavorites]);

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

    // 4. Generation filter
    if (!onlyFavorites && selectedGeneration !== 'all') {
      const genConfig = GENERATIONS.find((g) => g.id === selectedGeneration);
      if (genConfig) {
        list = list.filter(
          (p) => p.id >= genConfig.range[0] && p.id <= genConfig.range[1]
        );
      }
    }

    // 5. Sorting
    list.sort((a, b) => {
      switch (sortKey) {
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return a.id - b.id;
      }
    });

    return list;
  }, [allPokemon, typeFilteredList, onlyFavorites, isFavorite, searchTerm, selectedGeneration, selectedType, sortKey]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pokedex-chassis">
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

