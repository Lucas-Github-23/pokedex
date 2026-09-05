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
    case 'fire':
    case 'fogo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2C9.5 6 7 9 7 13c0 3.31 2.69 6 6 6 1.48 0 2.85-.54 3.9-1.44-.32-.91-.5-1.9-.5-2.93 0-3.11 1.63-5.83 4.07-7.39C19.74 8.71 18.5 11 18.5 13c0 .88.19 1.71.53 2.47C20.21 13.97 21 12.1 21 10c0-4-3.5-7-9-8zm-1 9c0 2 1 3.5 2 4.5-.5.3-1.2.5-2 .5-1.66 0-3-1.34-3-3 0-1.5 1-2.8 2-3.5-.67.45-1 .9-1 1.5z" />
        </svg>
      );

    case 'water':
    case 'água':
    case 'agua':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <path d="M14.5 11.5c1.5 1.5 1.5 3.5 0 5s-3.5 1.5-5 0" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'grass':
    case 'planta':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M17 3c-4.5 0-9 3-10 8-1 4.5 1.5 8 5 9 1-.5 3-2 4-4 .5-1 1-2 1-3.5 0-2.5-1-4.5-2-6 3 1 5.5 3 6 6 .5-4-1-9.5-4-9.5z" />
          <path d="M7 21s2-5 5-8" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'electric':
    case 'elétrico':
    case 'eletrico':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M13 2L3 14h8l-2 8 11-12h-8l3-8z" />
        </svg>
      );

    case 'normal':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" className={className}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" fill={color} />
        </svg>
      );

    case 'ice':
    case 'gelo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" className={className}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="12" cy="12" r="2.5" fill={color} />
        </svg>
      );

    case 'fighting':
    case 'lutador':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v2c0 2.5 1.8 4.6 4.2 4.9.7 1.8 2.3 3.1 4.3 3.5V19H9v2h6v-2h-2.5v-1.6c2-.4 3.6-1.7 4.3-3.5 2.4-.3 4.2-2.4 4.2-4.9V7c0-1.1-.9-2-2-2zM5 9V7h2v4.1C5.8 10.7 5 9.9 5 9zm14 0c0 .9-.8 1.7-2 2.1V7h2v2z" />
        </svg>
      );

    case 'poison':
    case 'venenoso':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <circle cx="9" cy="9" r="2" fill="#fff" />
          <circle cx="15" cy="9" r="2" fill="#fff" />
          <path d="M12 2a9 9 0 0 0-9 9c0 3.7 2.2 6.8 5.4 8.2v2.8h7.2v-2.8c3.2-1.4 5.4-4.5 5.4-8.2a9 9 0 0 0-9-9zm4 18h-8v-1.5h8V20z" />
        </svg>
      );

    case 'ground':
    case 'terra':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M3 18h18v3H3zM5 13h14v3H5zM8 8h8v3H8zM10 3h4v3h-4z" />
        </svg>
      );

    case 'flying':
    case 'voador':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M3 15c4-2 7-1 10-3 3-2 5-6 8-8-2 4-5 7-8 9-3 2-6 2-10 2zm2-5c3-2 6-1 8-3 2-2 4-4 6-5-2 3-4 5-6 6-3 2-5 2-8 2z" />
        </svg>
      );

    case 'psychic':
    case 'psíquico':
    case 'psiquico':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3.5" fill={color} />
        </svg>
      );

    case 'bug':
    case 'inseto':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M19 9h-2.1a6.04 6.04 0 0 0-1.8-2.6l1.5-1.5-1.4-1.4-2.1 2.1C12.7 5.2 12.3 5 12 5s-.7.2-1.2.6L8.7 3.5 7.3 4.9l1.5 1.5A6.04 6.04 0 0 0 7 9H5v2h2.1c-.1.3-.1.7-.1 1s0 .7.1 1H5v2h2.1a6 6 0 0 0 4.9 5v-7h2v7a6 6 0 0 0 4.9-5H21v-2h-2.1c.1-.3.1-.7.1-1s0-.7-.1-1H21V9h-2zm-6 2v7c-2.2-.5-3.8-2.5-3.9-4.8L9 13v-2h4z" />
        </svg>
      );

    case 'rock':
    case 'pedra':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M8 3l8 2 5 6-3 10H6L2 14l6-11zm2.5 3L6 13l4 6 5-1 3-6-4-6h-3.5z" />
        </svg>
      );

    case 'ghost':
    case 'fantasma':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2a9 9 0 0 0-9 9v11l3-2 3 2 3-2 3 2 3-2 3 2V11a9 9 0 0 0-9-9zm-3 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
        </svg>
      );

    case 'dragon':
    case 'dragão':
    case 'dragao':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M14 2c-1 2-1 4 0 6 1 1 3 1 5 1-2 3-5 5-9 6-2 .5-4 1-5 2-1 1-1 3 0 4 1.5-1 3-1.5 5-1.5 3 0 6 2 8 4 1-3 1-6 0-9 2-1 3-3 4-5-3 0-5-1-6-3-1-1-2-3-3-4.5z" />
        </svg>
      );

    case 'steel':
    case 'aço':
    case 'aco':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 3.3l5 2.5v7.4l-5 2.5-5-2.5V7.8l5-2.5z" />
        </svg>
      );

    case 'fairy':
    case 'fada':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2l2.4 5.8L20 9.2l-4.4 4 1.3 6-4.9-3-4.9 3 1.3-6-4.4-4 5.6-1.4L12 2z" />
        </svg>
      );

    case 'dark':
    case 'sombrio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12.3 2a10 10 0 0 0 9.7 13.7A10 10 0 1 1 12.3 2z" />
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
