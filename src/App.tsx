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

  // Modal & Drawer states
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const { favorites, isFavorite, toggleFavorite, count: favoritesCount } = useFavorites();

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
  }, [searchTerm, selectedGeneration, selectedType, sortKey]);

  // Filter and Sort Pipeline
  const filteredAndSortedPokemon = useMemo(() => {
    // 1. Start with base list (either type-filtered or all)
    let list = typeFilteredList !== null ? [...typeFilteredList] : [...allPokemon];

    // 2. Search query filter (supporting prefix syntax 'tipo:' and 'região:' or generic text)
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      if (term.startsWith('tipo:')) {
        const typeArg = term.replace('tipo:', '').trim();
        if (typeArg && selectedType !== typeArg) {
          // Will be handled if user uses input or we can filter
        }
      } else if (term.startsWith('região:') || term.startsWith('regiao:')) {
        const genNum = term.replace(/regi[ãa]o:/, '').trim();
        const gen = GENERATIONS.find((g) => g.id === genNum || g.region.toLowerCase() === genNum);
        if (gen) {
          list = list.filter((p) => p.id >= gen.range[0] && p.id <= gen.range[1]);
        }
      } else {
        // Search by name or ID (e.g. 25, #0025, pikachu)
        const numericSearch = parseInt(term.replace('#', ''), 10);
        list = list.filter((p) => {
          const matchName = p.name.toLowerCase().includes(term);
          const matchId = !isNaN(numericSearch) && p.id === numericSearch;
          return matchName || matchId;
        });
      }
    }

    // 3. Generation filter
    if (selectedGeneration !== 'all') {
      const genConfig = GENERATIONS.find((g) => g.id === selectedGeneration);
      if (genConfig) {
        list = list.filter(
          (p) => p.id >= genConfig.range[0] && p.id <= genConfig.range[1]
        );
      }
    }

    // 4. Sorting
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
  }, [allPokemon, typeFilteredList, searchTerm, selectedGeneration, selectedType, sortKey]);

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
          {/* HUD Corner Reticles */}
          <span className="screen-hud-corner tl" />
          <span className="screen-hud-corner tr" />
          <span className="screen-hud-corner bl" />
          <span className="screen-hud-corner br" />

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
      <PokemonModal
        pokemonId={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
        onSelectPokemon={setSelectedPokemonId}
        isFavorite={selectedPokemonId ? isFavorite(selectedPokemonId) : false}
        onToggleFavorite={toggleFavorite}
        totalPokemonCount={allPokemon.length || 1025}
      />

      {/* Favorites Storage Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectPokemon={setSelectedPokemonId}
        onRemoveFavorite={toggleFavorite}
      />
    </div>
  );
};

export default App;
