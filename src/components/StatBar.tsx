import React from 'react';
import { STAT_NAMES } from '../constants/pokemonData';

interface StatBarProps {
  name: string;
  value: number;
  max?: number;
}

export const StatBar: React.FC<StatBarProps> = ({ name, value, max = 255 }) => {
  const meta = STAT_NAMES[name] || { label: name, short: name.toUpperCase(), color: '#38bdf8' };
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="stat-row">
      <span className="stat-name">{meta.label}</span>
      <span className="stat-value">{value}</span>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: meta.color,
            color: meta.color,
          }}
        />
      </div>
    </div>
  );
};
