import React from 'react';

export type TerrainType = 'water' | 'earth' | 'grass';

/**
 * Resolves the battle terrain type based on the Pokemon's typings:
 * - Water types -> 'water' (Mar / Água)
 * - Ground & Rock types -> 'earth' (Terra / Pedra)
 * - All other types -> 'grass' (Grama / Campo)
 */
export function getPokemonTerrain(types: string[]): TerrainType {
  if (!types || types.length === 0) return 'grass';

  const primary = types[0].toLowerCase();

  // 1. Água -> Mar
  if (primary === 'water') return 'water';

  // 2. Terra e Pedra -> Terra
  if (primary === 'ground' || primary === 'rock') return 'earth';

  // Verificação de tipo secundário
  if (types.some((t) => t.toLowerCase() === 'water')) return 'water';
  if (types.some((t) => t.toLowerCase() === 'ground' || t.toLowerCase() === 'rock')) return 'earth';

  // 3. Os demais -> Grama
  return 'grass';
}

export function getTerrainInfo(terrain: TerrainType): {
  name: string;
  badge: string;
  color: string;
} {
  switch (terrain) {
    case 'water':
      return { name: 'Mar', badge: 'SUPERFÍCIE AQUÁTICA', color: '#06b6d4' };
    case 'earth':
      return { name: 'Terra / Pedra', badge: 'TERRENO ROCHOSO', color: '#d97706' };
    case 'grass':
    default:
      return { name: 'Grama', badge: 'CAMPO DE BATALHA', color: '#22c55e' };
  }
}

interface BattlePedestalProps {
  types: string[];
}

export const BattlePedestal: React.FC<BattlePedestalProps> = ({ types }) => {
  const terrain = getPokemonTerrain(types);

  return (
    <div className={`battle-pedestal-container terrain-${terrain}`} aria-hidden="true">
      <svg
        className={`battle-pedestal-svg pedestal-${terrain}`}
        viewBox="0 0 240 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shadow Blurs */}
          <filter id="pedestalShadowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="pedestalContactBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="causticGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          {/* ================================================================
              1. GRASS TERRAIN GRADIENTS
             ================================================================ */}
          <radialGradient id="grassTopGrad" cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="28%" stopColor="#22c55e" />
            <stop offset="65%" stopColor="#16a34a" />
            <stop offset="85%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>

          <linearGradient id="grassSoilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b1a08" />
            <stop offset="40%" stopColor="#2a1205" />
            <stop offset="100%" stopColor="#150a02" />
          </linearGradient>

          {/* ================================================================
              2. WATER TERRAIN GRADIENTS
             ================================================================ */}
          <radialGradient id="waterTopGrad" cx="50%" cy="36%" r="55%">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="25%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="85%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082f49" />
          </radialGradient>

          <linearGradient id="waterWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.85)" />
            <stop offset="40%" stopColor="rgba(2, 132, 199, 0.75)" />
            <stop offset="100%" stopColor="rgba(8, 47, 73, 0.95)" />
          </linearGradient>

          <radialGradient id="waterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.45)" />
            <stop offset="50%" stopColor="rgba(2, 132, 199, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>

          {/* ================================================================
              3. EARTH TERRAIN GRADIENTS
             ================================================================ */}
          <radialGradient id="earthTopGrad" cx="48%" cy="36%" r="55%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="25%" stopColor="#d97706" />
            <stop offset="60%" stopColor="#92400e" />
            <stop offset="85%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          <linearGradient id="earthWallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="30%" stopColor="#54280b" />
            <stop offset="65%" stopColor="#3b1c07" />
            <stop offset="100%" stopColor="#1f0e03" />
          </linearGradient>

          <linearGradient id="pebbleGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8a29e" />
            <stop offset="100%" stopColor="#57534e" />
          </linearGradient>

          <linearGradient id="pebbleGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78716c" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>
        </defs>

        {/* ------------------------------------------------------------------
            TERRAIN 1: GRAMA (DEFAULT / OS DEMAIS TIPOS)
           ------------------------------------------------------------------ */}
        {terrain === 'grass' && (
          <g className="pedestal-layer-grass">
            {/* Soft Green Floor Halo */}
            <ellipse
              cx="120"
              cy="54"
              rx="92"
              ry="14"
              fill="#22c55e"
              opacity="0.14"
              filter="url(#pedestalShadowBlur)"
            />

            {/* Main Chamber Floor Shadow */}
            <ellipse
              cx="120"
              cy="53"
              rx="104"
              ry="16"
              fill="#000000"
              opacity="0.75"
              filter="url(#pedestalShadowBlur)"
            />

            {/* Front 3D Soil Cylinder Wall (Rich Loam & Strata) */}
            <path
              d="M 20 30 A 100 22 0 0 0 220 30 L 220 45 A 100 22 0 0 1 20 45 Z"
              fill="url(#grassSoilGrad)"
            />

            {/* Soil Strata Texture Lines */}
            <path
              d="M 35 37 Q 120 59 205 37"
              stroke="#542c0f"
              strokeWidth="1.8"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M 28 42 Q 120 64 212 42"
              stroke="#2a1205"
              strokeWidth="2.2"
              fill="none"
              opacity="0.7"
            />

            {/* Top Elliptical Grass Turf Lawn */}
            <ellipse cx="120" cy="30" rx="100" ry="22" fill="url(#grassTopGrad)" />

            {/* Grass Fringe Tufts along the front overhang */}
            <path
              d="M 35 34 L 38 38 L 41 33 M 55 40 L 59 45 L 63 39 M 80 46 L 84 51 L 88 45 M 105 50 L 110 56 L 115 49 M 130 51 L 135 57 L 140 50 M 155 47 L 160 52 L 165 46 M 180 41 L 184 46 L 188 40 M 200 35 L 203 39 L 206 34"
              stroke="#16a34a"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Sunlit tuft tips */}
            <path
              d="M 58 41 L 60 44 M 109 52 L 111 55 M 134 52 L 136 55 M 159 48 L 161 51"
              stroke="#86efac"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Lawn Textures & Wildflower Accents */}
            <circle cx="75" cy="22" r="2" fill="#86efac" opacity="0.6" />
            <circle cx="165" cy="25" r="2.2" fill="#86efac" opacity="0.6" />
            <circle cx="142" cy="18" r="1.6" fill="#facc15" opacity="0.75" />
            <circle cx="96" cy="32" r="1.5" fill="#fef08a" opacity="0.7" />
            <circle cx="178" cy="29" r="1.4" fill="#facc15" opacity="0.65" />

            {/* Contact Shadow under Pokémon Feet */}
            <ellipse
              cx="120"
              cy="33"
              rx="46"
              ry="11"
              fill="rgba(5, 46, 22, 0.78)"
              filter="url(#pedestalContactBlur)"
            />
          </g>
        )}

        {/* ------------------------------------------------------------------
            TERRAIN 2: MAR (TIPO ÁGUA)
           ------------------------------------------------------------------ */}
        {terrain === 'water' && (
          <g className="pedestal-layer-water">
            {/* Aquatic Floor Caustic Halo */}
            <ellipse
              cx="120"
              cy="52"
              rx="106"
              ry="18"
              fill="url(#waterGlow)"
              filter="url(#causticGlow)"
            />

            {/* Chamber Floor Shadow */}
            <ellipse
              cx="120"
              cy="53"
              rx="104"
              ry="16"
              fill="#000000"
              opacity="0.6"
              filter="url(#pedestalShadowBlur)"
            />

            {/* 3D Liquid Meniscus Cylinder Wall */}
            <path
              d="M 20 30 A 100 22 0 0 0 220 30 L 220 45 A 100 22 0 0 1 20 45 Z"
              fill="url(#waterWallGrad)"
            />

            {/* Liquid Refraction Streaks */}
            <path
              d="M 30 38 Q 120 60 210 38"
              stroke="rgba(186, 230, 253, 0.5)"
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="M 25 43 Q 120 65 215 43"
              stroke="rgba(2, 132, 199, 0.6)"
              strokeWidth="2.2"
              fill="none"
            />

            {/* Top Crystalline Water Surface */}
            <ellipse cx="120" cy="30" rx="100" ry="22" fill="url(#waterTopGrad)" />

            {/* Concentric Animated Water Ripples */}
            <ellipse
              className="water-pulse ripple-1"
              cx="120"
              cy="30"
              rx="38"
              ry="8.5"
              stroke="rgba(224, 242, 254, 0.85)"
              strokeWidth="1.6"
              fill="none"
            />
            <ellipse
              className="water-pulse ripple-2"
              cx="120"
              cy="30"
              rx="62"
              ry="13.5"
              stroke="rgba(125, 211, 252, 0.7)"
              strokeWidth="1.4"
              fill="none"
            />
            <ellipse
              className="water-pulse ripple-3"
              cx="120"
              cy="30"
              rx="86"
              ry="18.5"
              stroke="rgba(56, 189, 248, 0.55)"
              strokeWidth="1.2"
              fill="none"
            />

            {/* Water Perimeter Foam / Splash Ring */}
            <ellipse
              cx="120"
              cy="30"
              rx="98"
              ry="21.5"
              stroke="rgba(240, 249, 255, 0.75)"
              strokeWidth="2"
              strokeDasharray="10 5 4 5"
              fill="none"
            />

            {/* Specular Caustic Light Glints */}
            <path
              className="water-caustic"
              d="M 80 22 Q 100 18 115 24 Q 130 30 152 22"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="68" cy="26" r="1.6" fill="#ffffff" opacity="0.85" />
            <circle cx="174" cy="22" r="2" fill="#ffffff" opacity="0.95" />
            <circle cx="146" cy="33" r="1.3" fill="#ffffff" opacity="0.75" />

            {/* Water Contact Ring under Pokémon Feet */}
            <ellipse
              cx="120"
              cy="32"
              rx="40"
              ry="9.5"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="1.6"
              fill="rgba(6, 182, 212, 0.4)"
            />
          </g>
        )}

        {/* ------------------------------------------------------------------
            TERRAIN 3: TERRA / PEDRA (TIPOS GROUND & ROCK)
           ------------------------------------------------------------------ */}
        {terrain === 'earth' && (
          <g className="pedestal-layer-earth">
            {/* Warm Earthen Floor Halo */}
            <ellipse
              cx="120"
              cy="54"
              rx="94"
              ry="14"
              fill="#b45309"
              opacity="0.18"
              filter="url(#pedestalShadowBlur)"
            />

            {/* Chamber Floor Shadow */}
            <ellipse
              cx="120"
              cy="53"
              rx="104"
              ry="16"
              fill="#000000"
              opacity="0.8"
              filter="url(#pedestalShadowBlur)"
            />

            {/* Front Rocky Cliff Cylinder Wall (Geological Strata) */}
            <path
              d="M 20 30 A 100 22 0 0 0 220 30 L 220 45 A 100 22 0 0 1 20 45 Z"
              fill="url(#earthWallGrad)"
            />

            {/* Rock Strata Lines */}
            <path
              d="M 25 35 Q 120 56 215 35"
              stroke="#92400e"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M 22 41 Q 120 63 218 41"
              stroke="#451a03"
              strokeWidth="2.8"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M 28 44 Q 120 66 212 44"
              stroke="#78350f"
              strokeWidth="1.4"
              fill="none"
              opacity="0.55"
            />

            {/* Top Compacted Earth & Sandstone Platform */}
            <ellipse cx="120" cy="30" rx="100" ry="22" fill="url(#earthTopGrad)" />

            {/* Chiseled Earthen Rim Highlight */}
            <path
              d="M 20 30 A 100 22 0 0 0 220 30"
              stroke="#fbbf24"
              strokeWidth="1.4"
              fill="none"
              opacity="0.55"
            />

            {/* Natural Ground Fissures / Cracks */}
            <path
              d="M 62 22 L 76 26 L 83 23 L 96 28 M 76 26 L 80 32"
              stroke="#451a03"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 142 20 L 154 25 L 170 22 M 154 25 L 159 31"
              stroke="#451a03"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Scattered 3D Rock Pebbles */}
            {/* Pebble 1 (Left) */}
            <ellipse cx="52" cy="28" rx="6.5" ry="3.4" fill="url(#pebbleGrad1)" />
            <ellipse cx="51" cy="27" rx="4.2" ry="1.9" fill="#e7e5e4" opacity="0.65" />

            {/* Pebble 2 (Right) */}
            <ellipse cx="182" cy="26" rx="8.5" ry="4.2" fill="url(#pebbleGrad2)" />
            <ellipse cx="180" cy="25" rx="5.5" ry="2.2" fill="#d6d3d1" opacity="0.6" />

            {/* Pebble 3 (Front Right) */}
            <ellipse cx="162" cy="38" rx="5.2" ry="2.9" fill="url(#pebbleGrad1)" />
            <ellipse cx="161" cy="37" rx="3.2" ry="1.5" fill="#e7e5e4" opacity="0.55" />

            {/* Pebble 4 (Front Left) */}
            <ellipse cx="79" cy="38" rx="4.2" ry="2.3" fill="url(#pebbleGrad2)" />

            {/* Fine Mineral Grains */}
            <circle cx="102" cy="36" r="1.3" fill="#78716c" />
            <circle cx="137" cy="37" r="1.6" fill="#a8a29e" />
            <circle cx="118" cy="21" r="1.2" fill="#57534e" />

            {/* Contact Shadow under Pokémon Feet */}
            <ellipse
              cx="120"
              cy="33"
              rx="48"
              ry="11.5"
              fill="rgba(24, 10, 3, 0.82)"
              filter="url(#pedestalContactBlur)"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
