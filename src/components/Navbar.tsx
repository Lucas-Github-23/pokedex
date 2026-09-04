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
    <header className="pokedex-top-bar">
      {/* Sensor Cluster: Iconic Big Blue Lens + 3 LEDs */}
      <div className="sensor-cluster">
        <div
          className="main-scanner-lens"
          onClick={onResetFilters}
          title="Reiniciar Filtros / Início da Pokédex"
          role="button"
          tabIndex={0}
        >
          <div className="lens-specular-glint" />
        </div>

        <div className="led-indicator-group">
          <div className="pokedex-led red" title="Sensor Óptico Ativo" />
          <div className="pokedex-led yellow" title="Canal de Dados PokéAPI" />
          <div className="pokedex-led green" title="Sincronização Online" />
        </div>
      </div>

      {/* System HUD Telemetry */}
      <div className="system-telemetry">
        <div className="telemetry-item">
          <span className="telemetry-dot" />
          <span>DEX OS // SILPH CO. v4.2</span>
        </div>
        <div className="telemetry-item" style={{ color: '#94a3b8' }}>
          <span>REGISTRY: 1025 ENTRIES</span>
        </div>
        <div className="telemetry-item" style={{ color: '#00ff66' }}>
          <span>SYS: ONLINE</span>
        </div>
      </div>

      {/* Hardware Favorites Action Button */}
      <button
        className="btn-hardware-fav"
        onClick={onOpenFavorites}
        title="Acessar Banco de Dados de Favoritos"
      >
        <Heart
          size={16}
          fill={favoritesCount > 0 ? '#ef4444' : 'none'}
          color={favoritesCount > 0 ? '#ef4444' : 'currentColor'}
        />
        <span>FAVORITOS</span>
        <span className="fav-badge-count">{favoritesCount}</span>
      </button>
    </header>
  );
};
