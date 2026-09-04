import React from 'react';
import { Heart } from 'lucide-react';

interface NavbarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onResetFilters: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount,
  onOpenFavorites,
  onResetFilters,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={onResetFilters} role="button" tabIndex={0}>
        <img src="/pokeball.svg" alt="Pokéball" className="pokeball-logo" />
        <div className="brand-text">
          <div className="brand-title">
            Pokédex <span className="brand-badge">PRO</span>
          </div>
          <span className="brand-subtitle">Gerações I - IX • National Dex</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button
          className="btn-favorites"
          onClick={onOpenFavorites}
          title="Ver Pokémon Favoritos"
          aria-label="Ver Pokémon Favoritos"
        >
          <Heart size={18} fill={favoritesCount > 0 ? '#ef4444' : 'none'} color={favoritesCount > 0 ? '#ef4444' : 'currentColor'} />
          <span>Favoritos</span>
          <span className="favorites-counter">{favoritesCount}</span>
        </button>
      </div>
    </nav>
  );
};
