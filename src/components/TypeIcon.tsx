import React from 'react';

interface TypeIconProps {
  type: string;
  size?: number;
  className?: string;
  color?: string;
}

export const TypeIcon: React.FC<TypeIconProps> = ({
  type,
  size = 14,
  className = '',
  color = 'currentColor',
}) => {
  const normalized = type.toLowerCase().trim();

  switch (normalized) {
    // 1. FOGO / FIRE - Authentic Pokémon Flame
    case 'fire':
    case 'fogo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 1.5C10.8 4 9 6.5 9 9.5c0 1.2.3 2.3.9 3.2C8.7 12.2 8 11.2 8 10c0-1.5.5-2.8 1.2-3.8-3.5 2-5.2 6-5.2 9.3C4 19.8 7.6 23 12 23s8-3.2 8-7.5c0-4.8-4-8.5-6.5-12.5-.5-.8-1-1.5-1.5-1.5zm.2 11.2c1.8 1.2 2.8 3.1 2.8 5.3 0 2.8-2.2 4.5-5 4.5-1.2 0-2.3-.4-3.1-1.1 1.2-.5 2.1-1.6 2.1-2.9 0-1.2-.6-2.3-1.6-3 .3-1.4 1.2-2.5 2.6-3.2.4.3 1.2.9 2.2.4z" />
        </svg>
      );

    // 2. ÁGUA / WATER - Authentic Pokémon Droplet
    case 'water':
    case 'água':
    case 'agua':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2C9.5 6 5 11.5 5 15.5 5 19.6 8.1 23 12 23s7-3.4 7-7.5C19 11.5 14.5 6 12 2zm3.5 14.5c-.5 2-2.2 3.5-4.2 3.5-.6 0-1.1-.1-1.6-.4.5-.4 1.3-1.2 1.3-2.1 0-1.2-.8-2.2-1.9-2.5 1-2 3.2-3.3 5.4-3.5-.2 1.7.3 3.5 1 5z" />
        </svg>
      );

    // 3. PLANTA / GRASS - Authentic Pokémon Leaf Bud
    case 'grass':
    case 'planta':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M19.8 2.2c-5.8-.2-12.8 3.5-14.6 11.3-.7 3.2-.2 6.5 1.8 8.8 1.8-3.8 5.2-6.5 9.2-7.5-1.5 2-2.2 4.5-2.2 7.2h2c0-3.5 1.5-6.8 4.2-9 2.5-2.2 4.2-5.5 4.6-9.2.1-.6-.2-1.4-.7-1.5-.1-.1-.2-.1-.3-.1z" />
        </svg>
      );

    // 4. ELÉTRICO / ELECTRIC - Dynamic Lightning Bolt
    case 'electric':
    case 'elétrico':
    case 'eletrico':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M14.5 1.5L4 13.5h7.2L8.5 22.5 20 9.8h-7.5l3.8-8.3h-1.8z" />
        </svg>
      );

    // 5. NORMAL - Iconic Concentric Bullseye Rings
    case 'normal':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 3a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
        </svg>
      );

    // 6. GELO / ICE - Hexagonal Snowflake Crystal
    case 'ice':
    case 'gelo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 1l2.5 3-1.5 1.2V8l2.6-1.5 1.5-3 1.8 1-1.5 3 2.6 1.5 2.8-1.6 1 1.7-2.8 1.6V12h3.5v2h-3.5v1.8l2.8 1.6-1 1.7-2.8-1.6-2.6 1.5 1.5 3-1.8 1-1.5-3L13 16v2.8l1.5 1.2-2.5 3-2.5-3 1.5-1.2V16l-2.6 1.5-1.5 3-1.8-1 1.5-3-2.6-1.5-2.8 1.6-1-1.7 2.8-1.6V14H1v-2h3.5v-1.8L1.7 8.6l1-1.7 2.8 1.6 2.6-1.5-1.5-3 1.8-1 1.5 3L11 8V5.2L9.5 4 12 1zm0 8a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      );

    // 7. LUTADOR / FIGHTING - Iconic Clenched Boxing Fist
    case 'fighting':
    case 'lutador':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M18.5 5.5c-1.2 0-2.2.8-2.5 1.8-.6-.5-1.4-.8-2.2-.8-.9 0-1.7.4-2.2 1.1-.5-.7-1.3-1.1-2.2-1.1-1.5 0-2.8 1.2-2.9 2.8L5 9.8C4 10.3 3.5 11.4 3.5 12.5c0 1.2.6 2.3 1.6 2.8l2.4 1.2V21h9v-4.5l4-2.8c1-1 1.5-2.2 1.5-3.5V8.5c0-1.7-1.3-3-3-3zm-1 6.5h-2V7.5c0-.6.4-1 1-1s1 .4 1 1V12zm-3.5 0h-2V8.5c0-.6.4-1 1-1s1 .4 1 1V12zm-3.5 0H9V9.5c0-.6.4-1 1-1s1 .4 1 1V12z" />
        </svg>
      );

    // 8. VENENOSO / POISON - Poison Toxic Flask / Skull
    case 'poison':
    case 'venenoso':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2a8.5 8.5 0 00-8.5 8.5c0 3.2 1.8 6 4.5 7.4v2.6c0 .8.7 1.5 1.5 1.5h5c.8 0 1.5-.7 1.5-1.5v-2.6c2.7-1.4 4.5-4.2 4.5-7.4A8.5 8.5 0 0012 2zm-3.5 7a2 2 0 114 0 2 2 0 01-4 0zm7 0a2 2 0 11-4 0 2 2 0 014 0zm-5 5.5l1.5-2 1.5 2-1.5.5-1.5-.5z" />
        </svg>
      );

    // 9. TERRA / GROUND - Official Layered Tectonic Earth Plates
    case 'ground':
    case 'terra':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M2 18.5l9-4.5 11 3.5-3 4.5H5l-3-3.5zm1.5-6.5l8.5-4.5 10 3-3 4-8.5-3-7 4.5zM7 3.5h10l3 4.5-6 2.5-8-2.5L7 3.5z" />
        </svg>
      );

    // 10. VOADOR / FLYING - Official Soaring Wings
    case 'flying':
    case 'voador':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M2.5 17c5.5-1.5 11.5-6.5 15.5-14.5 1 4-1.5 8.5-4.5 11.5 4-1.5 8-5 10-9.5.5 4.5-3.5 9.5-7.5 12.5 3-.5 6-2 8-4.5-2 5-8 9-14 9-2.5 0-5.5-.8-7.5-2.5v-2.5z" />
        </svg>
      );

    // 11. PSÍQUICO / PSYCHIC - Official Radiating Psychic Eye
    case 'psychic':
    case 'psíquico':
    case 'psiquico':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 4.5C6 4.5 1.5 12 1.5 12s4.5 7.5 10.5 7.5 10.5-7.5 10.5-7.5-4.5-7.5-10.5-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
        </svg>
      );

    // 12. INSETO / BUG - Segmented Beetle with Antennae
    case 'bug':
    case 'inseto':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2c-2.2 0-4 1.8-4 4v1.2C6.2 8.3 5 10.5 5 13v1H2v2h3v1.5c0 1.5.5 2.9 1.4 4L4 23l1.5 1.5 2.6-2.6c1.1.7 2.4 1.1 3.9 1.1s2.8-.4 3.9-1.1l2.6 2.6L20 23l-2.4-2.5c.9-1.1 1.4-2.5 1.4-4V16h3v-2h-3v-1c0-2.5-1.2-4.7-3-5.8V6c0-2.2-1.8-4-4-4zm-2 4c0-1.1.9-2 2-2s2 .9 2 2v1h-4V6zm-3 8c0-2.8 2.2-5 5-5s5 2.2 5 5v5.5c0 2.8-2.2 5-5 5s-5-2.2-5-5V14z" />
        </svg>
      );

    // 13. PEDRA / ROCK - Faceted Jagged Mineral Boulder
    case 'rock':
    case 'pedra':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M7 2.5l10 2 4.5 7-3.5 10H6L2 14.5l5-12zm3 3L5.5 13l4.5 5.5h5l3-5.5-3.5-5.5L10 5.5z" />
        </svg>
      );

    // 14. FANTASMA / GHOST - Spectral Floating Phantom Wisp
    case 'ghost':
    case 'fantasma':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2C6.5 2 3 6.5 3 12c0 3.5 1.5 6 3.5 7.5L8 18l2.5 3 2.5-3 2.5 3 2.5-3 2.5 3 1.5-1.5C21 18 21 15 21 12c0-5.5-3.5-10-9-10zm-3 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
        </svg>
      );

    // 15. DRAGÃO / DRAGON - Serpentine Dragon Crest & Wing
    case 'dragon':
    case 'dragão':
    case 'dragao':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M19 2.5c-3 .5-6 2.5-8 5.5-1.5-1.8-3.8-3-6.5-3-1.5 0-3 .4-4.5 1 2 2 3 4.5 3 7.5 0 4.5 3 8 7 9.5-.5-1.5-.8-3-.8-4.5 0-3.5 1.8-6.5 4.8-8 1.5 2.5 1.5 5.5 0 8.5 3.5-1 6-3.5 7.5-7 1-2.5 1-5 0-7.5 1.5-.5 2.5-1.2 2.5-2z" />
        </svg>
      );

    // 16. AÇO / STEEL - Heavy Industrial Hex Nut with Center Hole
    case 'steel':
    case 'aço':
    case 'aco':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2l8.5 4.9v9.8L12 21.5 3.5 16.7V6.9L12 2zm0 3.5L6.5 8.7v6.6l5.5 3.2 5.5-3.2V8.7L12 5.5zM12 9a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      );

    // 17. FADA / FAIRY - Winged Fairy Sparkle Star
    case 'fairy':
    case 'fada':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 1.5c.8 4.2 3.5 7.2 7.5 8-4 .8-6.7 3.8-7.5 8-.8-4.2-3.5-7.2-7.5-8 4-.8 6.7-3.8 7.5-8zm7 11c.4 2.2 1.8 3.8 4 4.2-2.2.4-3.6 2-4 4.2-.4-2.2-1.8-3.8-4-4.2 2.2-.4 3.6-2 4-4.2zM4 14c.3 1.8 1.5 3 3.2 3.3-1.7.3-2.9 1.5-3.2 3.3-.3-1.8-1.5-3-3.2-3.3C2.5 17 3.7 15.8 4 14z" />
        </svg>
      );

    // 18. SOMBRIO / DARK - Sharp Crescent Moon with Menacing Bevel
    case 'dark':
    case 'sombrio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M11.5 2c-.8 0-1.5.7-1.5 1.5 0 2.8 1.2 5.3 3.1 7.1-3.5.5-6.5 2.8-7.8 6.2C4.5 18.5 5.5 20.5 7 22c-3.2-1.8-5-5.2-5-9 0-6.1 4.9-11 11-11h-1.5zM19.5 7.5c-4.1 0-7.5 3.4-7.5 7.5 0 3.2 2 5.9 4.8 7 1.8.7 3.8.5 5.4-.5-1.5-.2-2.9-.8-4-1.8-2-1.8-2.5-4.6-1.5-7 1-2.2 3-3.8 5.4-4.2-.7-.6-1.6-1-2.6-1z" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};
