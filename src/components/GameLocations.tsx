import React from 'react';
import type { GameLocations as IGameLocations } from '../types/pokemon';
import { GAME_VERSION_COLORS } from '../constants/pokemonData';
import { Compass } from 'lucide-react';

interface GameLocationsProps {
  locations: IGameLocations[];
}

export const GameLocations: React.FC<GameLocationsProps> = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="empty-state">
        <Compass size={36} className="empty-state-icon" />
        <h3>Não capturável diretamente</h3>
        <p>Este Pokémon não pode ser encontrado na natureza nos jogos registrados ou é obtido via evento/evolução.</p>
      </div>
    );
  }

  return (
    <div className="locations-container">
      {locations.map((item) => {
        const colorStyle = GAME_VERSION_COLORS[item.colorClass] || {
          bg: '#334155',
          text: '#f8fafc',
          border: '#475569',
        };

        return (
          <div
            key={item.game}
            className="game-location-card"
            style={{
              backgroundColor: colorStyle.bg,
              color: colorStyle.text,
              borderColor: colorStyle.border,
            }}
          >
            <div className="game-name-header">
              <span>🎮 Pokémon {item.game}</span>
            </div>
            <div className="game-areas-list">
              <strong>Locais: </strong>
              {item.locations.join(', ')}
            </div>
          </div>
        );
      })}
    </div>
  );
};
