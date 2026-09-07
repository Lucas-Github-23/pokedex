import type { FormCategory } from '../types/pokemon';

export interface FormBadgeInfo {
  category: FormCategory;
  tag: string;
  label: string;
  color: string;
}

/**
 * Patterns of internal PokéAPI entries that are non-battle ride modes,
 * in-turn ability states, or duplicates without any distinct official artwork or battle sprites.
 */
const IGNORED_FORM_PATTERNS = [
  '-low-power-mode',
  '-drive-mode',
  '-aquatic-mode',
  '-glide-mode',
  '-limited-build',
  '-sprinting-build',
  '-swimming-build',
  '-gliding-build',
  '-starter',
  '-busted',
  '-gulping',
  '-gorging',
  '-hangry',
  '-own-tempo',
  '-antique',
  '-dada',
];

/**
 * Checks if a species variety is a genuine distinct visual/battle form.
 */
export function isMeaningfulVariety(varietyName: string, isDefault: boolean): boolean {
  if (isDefault) return true;
  const clean = varietyName.toLowerCase();

  // Exclude ignored phantom patterns
  if (IGNORED_FORM_PATTERNS.some((pat) => clean.endsWith(pat) || clean.includes(pat))) {
    return false;
  }

  // Filter out redundant Minior meteor color clones (keep only standard meteor)
  if (clean.startsWith('minior-') && clean.endsWith('-meteor') && !clean.includes('red-meteor')) {
    return false;
  }

  return true;
}

export function formatVarietyInfo(
  varietyName: string,
  baseSpeciesName: string,
  isDefault: boolean
): { displayName: string; category: FormCategory; tag: string } {
  if (isDefault) {
    return {
      displayName: 'Forma Padrão',
      category: 'default',
      tag: 'PADRÃO',
    };
  }

  const clean = varietyName.toLowerCase();

  // Mega Evolutions
  if (clean.includes('-mega-x')) {
    return { displayName: 'Mega Evolução X', category: 'mega', tag: 'MEGA X' };
  }
  if (clean.includes('-mega-y')) {
    return { displayName: 'Mega Evolução Y', category: 'mega', tag: 'MEGA Y' };
  }
  if (clean.includes('-mega')) {
    return { displayName: 'Mega Evolução', category: 'mega', tag: 'MEGA' };
  }

  // Primal Reversion
  if (clean.includes('-primal')) {
    return { displayName: 'Forma Primal', category: 'primal', tag: 'PRIMAL' };
  }

  // Gigantamax
  if (clean.includes('-gmax')) {
    return { displayName: 'Gigantamax', category: 'gmax', tag: 'G-MAX' };
  }

  // Regional Variants
  if (clean.includes('-alola')) {
    return { displayName: 'Forma de Alola', category: 'alola', tag: 'ALOLA' };
  }
  if (clean.includes('-galar')) {
    return { displayName: 'Forma de Galar', category: 'galar', tag: 'GALAR' };
  }
  if (clean.includes('-hisui')) {
    return { displayName: 'Forma de Hisui', category: 'hisui', tag: 'HISUI' };
  }
  if (clean.includes('-paldea')) {
    return { displayName: 'Forma de Paldea', category: 'paldea', tag: 'PALDEA' };
  }

  // Origin / Altered Formes
  if (clean.includes('-origin')) {
    return { displayName: 'Forma Origem', category: 'origin', tag: 'ORIGEM' };
  }
  if (clean.includes('-altered')) {
    return { displayName: 'Forma Alterada', category: 'special', tag: 'ALTERADA' };
  }

  // Therian / Incarnate
  if (clean.includes('-therian')) {
    return { displayName: 'Forma Therian', category: 'special', tag: 'THERIAN' };
  }
  if (clean.includes('-incarnate')) {
    return { displayName: 'Forma Incarnate', category: 'special', tag: 'INCARNATE' };
  }

  // Deoxys Formes
  if (clean.includes('-attack')) {
    return { displayName: 'Forma de Ataque', category: 'special', tag: 'ATAQUE' };
  }
  if (clean.includes('-defense')) {
    return { displayName: 'Forma de Defesa', category: 'special', tag: 'DEFESA' };
  }
  if (clean.includes('-speed')) {
    return { displayName: 'Forma de Velocidade', category: 'special', tag: 'VELOCIDADE' };
  }

  // Rotom Appliances
  if (clean.includes('-heat')) {
    return { displayName: 'Rotom Calor (Fogo)', category: 'special', tag: 'CALOR' };
  }
  if (clean.includes('-wash')) {
    return { displayName: 'Rotom Lavagem (Água)', category: 'special', tag: 'LAVAGEM' };
  }
  if (clean.includes('-frost')) {
    return { displayName: 'Rotom Geada (Gelo)', category: 'special', tag: 'GEADA' };
  }
  if (clean.includes('-fan')) {
    return { displayName: 'Rotom Ventilador (Voo)', category: 'special', tag: 'VENTO' };
  }
  if (clean.includes('-mow')) {
    return { displayName: 'Rotom Corte (Planta)', category: 'special', tag: 'CORTE' };
  }

  // Kyurem & Necrozma Fusions
  if (clean.includes('-black')) {
    return { displayName: 'Kyurem Preto', category: 'special', tag: 'PRETO' };
  }
  if (clean.includes('-white')) {
    return { displayName: 'Kyurem Branco', category: 'special', tag: 'BRANCO' };
  }
  if (clean.includes('-dusk-mane') || clean.includes('-dusk')) {
    return { displayName: 'Juba Crepúsculo', category: 'special', tag: 'CREPÚSCULO' };
  }
  if (clean.includes('-dawn-wings') || clean.includes('-dawn')) {
    return { displayName: 'Asas da Alvorada', category: 'special', tag: 'ALVORADA' };
  }
  if (clean.includes('-ultra')) {
    return { displayName: 'Ultra Necrozma', category: 'special', tag: 'ULTRA' };
  }

  // Urshifu Strikes
  if (clean.includes('-rapid-strike')) {
    return { displayName: 'Golpe Fluido', category: 'special', tag: 'FLUIDO' };
  }
  if (clean.includes('-single-strike')) {
    return { displayName: 'Golpe Decisivo', category: 'special', tag: 'DECISIVO' };
  }

  // Crowned Zacian / Zamazenta
  if (clean.includes('-crowned')) {
    return { displayName: 'Forma Espada/Escudo Real', category: 'special', tag: 'CROWNED' };
  }

  // Calyrex Riders
  if (clean.includes('-ice')) {
    return { displayName: 'Cavaleiro Glacial', category: 'special', tag: 'GLACIAL' };
  }
  if (clean.includes('-shadow')) {
    return { displayName: 'Cavaleiro Espectral', category: 'special', tag: 'ESPECTRAL' };
  }

  // Ogerpon & Terapagos Masks / Terastal
  if (clean.includes('-terastal')) {
    return { displayName: 'Forma Terastal', category: 'special', tag: 'TERASTAL' };
  }
  if (clean.includes('-stellar')) {
    return { displayName: 'Forma Estelar', category: 'special', tag: 'ESTELAR' };
  }
  if (clean.includes('-wellspring')) {
    return { displayName: 'Máscara Nascente', category: 'special', tag: 'NASCENTE' };
  }
  if (clean.includes('-hearthflame')) {
    return { displayName: 'Máscara Fornalha', category: 'special', tag: 'FORNALHA' };
  }
  if (clean.includes('-cornerstone')) {
    return { displayName: 'Máscara Alicerce', category: 'special', tag: 'ALICERCE' };
  }

  // Palafin
  if (clean.includes('-hero')) {
    return { displayName: 'Forma Heroica', category: 'special', tag: 'HERÓI' };
  }

  // Zygarde Formes
  if (clean.includes('-10')) {
    return { displayName: 'Forma 10%', category: 'special', tag: '10%' };
  }
  if (clean.includes('-complete')) {
    return { displayName: 'Forma Completa (100%)', category: 'special', tag: '100%' };
  }

  // Totem
  if (clean.includes('-totem')) {
    return { displayName: 'Forma Totem', category: 'totem', tag: 'TOTEM' };
  }

  // Fallback nicely formatted title
  const suffix = clean.replace(`${baseSpeciesName.toLowerCase()}-`, '').replace('-', ' ');
  return {
    displayName: `Forma ${suffix.toUpperCase()}`,
    category: 'special',
    tag: suffix.toUpperCase().slice(0, 8),
  };
}

// Visual category styling metadata
export const FORM_CATEGORY_CONFIG: Record<
  FormCategory,
  { label: string; color: string; bg: string; border: string }
> = {
  default: {
    label: 'Padrão',
    color: '#94a3b8',
    bg: '#141a26',
    border: '#2a364d',
  },
  mega: {
    label: 'Mega',
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, #0369a1 0%, #1e1b4b 100%)',
    border: '#38bdf8',
  },
  gmax: {
    label: 'Gigantamax',
    color: '#f87171',
    bg: 'linear-gradient(135deg, #b91c1c 0%, #450a0a 100%)',
    border: '#f87171',
  },
  alola: {
    label: 'Alola',
    color: '#fde047',
    bg: 'linear-gradient(135deg, #ca8a04 0%, #713f12 100%)',
    border: '#fde047',
  },
  galar: {
    label: 'Galar',
    color: '#c084fc',
    bg: 'linear-gradient(135deg, #7e22ce 0%, #3b0764 100%)',
    border: '#c084fc',
  },
  hisui: {
    label: 'Hisui',
    color: '#4ade80',
    bg: 'linear-gradient(135deg, #15803d 0%, #052e16 100%)',
    border: '#4ade80',
  },
  paldea: {
    label: 'Paldea',
    color: '#fb923c',
    bg: 'linear-gradient(135deg, #c2410c 0%, #431407 100%)',
    border: '#fb923c',
  },
  primal: {
    label: 'Primal',
    color: '#f43f5e',
    bg: 'linear-gradient(135deg, #be123c 0%, #4c0519 100%)',
    border: '#f43f5e',
  },
  origin: {
    label: 'Origem',
    color: '#a855f7',
    bg: 'linear-gradient(135deg, #6b21a8 0%, #3b0764 100%)',
    border: '#a855f7',
  },
  totem: {
    label: 'Totem',
    color: '#fbbf24',
    bg: 'linear-gradient(135deg, #b45309 0%, #451a03 100%)',
    border: '#fbbf24',
  },
  special: {
    label: 'Especial',
    color: '#2dd4bf',
    bg: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
    border: '#2dd4bf',
  },
};

// Index of species IDs with known alternative forms for instant search and card micro-badges
export const KNOWN_ALTERNATIVE_FORMS: Record<number, { category: FormCategory; tag: string }[]> = {
  // Gen 1
  3: [{ category: 'mega', tag: 'MEGA' }, { category: 'gmax', tag: 'G-MAX' }], // Venusaur
  6: [{ category: 'mega', tag: 'MEGA X/Y' }, { category: 'gmax', tag: 'G-MAX' }], // Charizard
  9: [{ category: 'mega', tag: 'MEGA' }, { category: 'gmax', tag: 'G-MAX' }], // Blastoise
  12: [{ category: 'gmax', tag: 'G-MAX' }], // Butterfree
  15: [{ category: 'mega', tag: 'MEGA' }], // Beedrill
  18: [{ category: 'mega', tag: 'MEGA' }], // Pidgeot
  19: [{ category: 'alola', tag: 'ALOLA' }], // Rattata
  20: [{ category: 'alola', tag: 'ALOLA' }], // Raticate
  25: [{ category: 'gmax', tag: 'G-MAX' }], // Pikachu
  26: [{ category: 'alola', tag: 'ALOLA' }], // Raichu
  27: [{ category: 'alola', tag: 'ALOLA' }], // Sandshrew
  28: [{ category: 'alola', tag: 'ALOLA' }], // Sandslash
  37: [{ category: 'alola', tag: 'ALOLA' }], // Vulpix
  38: [{ category: 'alola', tag: 'ALOLA' }], // Ninetales
  50: [{ category: 'alola', tag: 'ALOLA' }], // Diglett
  51: [{ category: 'alola', tag: 'ALOLA' }], // Dugtrio
  52: [{ category: 'alola', tag: 'ALOLA' }, { category: 'galar', tag: 'GALAR' }, { category: 'gmax', tag: 'G-MAX' }], // Meowth
  53: [{ category: 'alola', tag: 'ALOLA' }], // Persian
  58: [{ category: 'hisui', tag: 'HISUI' }], // Growlithe
  59: [{ category: 'hisui', tag: 'HISUI' }], // Arcanine
  65: [{ category: 'mega', tag: 'MEGA' }], // Alakazam
  68: [{ category: 'gmax', tag: 'G-MAX' }], // Machamp
  74: [{ category: 'alola', tag: 'ALOLA' }], // Geodude
  75: [{ category: 'alola', tag: 'ALOLA' }], // Graveler
  76: [{ category: 'alola', tag: 'ALOLA' }], // Golem
  77: [{ category: 'galar', tag: 'GALAR' }], // Ponyta
  78: [{ category: 'galar', tag: 'GALAR' }], // Rapidash
  79: [{ category: 'galar', tag: 'GALAR' }], // Slowpoke
  80: [{ category: 'mega', tag: 'MEGA' }, { category: 'galar', tag: 'GALAR' }], // Slowbro
  83: [{ category: 'galar', tag: 'GALAR' }], // Farfetch'd
  88: [{ category: 'alola', tag: 'ALOLA' }], // Grimer
  89: [{ category: 'alola', tag: 'ALOLA' }], // Muk
  94: [{ category: 'mega', tag: 'MEGA' }, { category: 'gmax', tag: 'G-MAX' }], // Gengar
  99: [{ category: 'gmax', tag: 'G-MAX' }], // Kingler
  100: [{ category: 'hisui', tag: 'HISUI' }], // Voltorb
  101: [{ category: 'hisui', tag: 'HISUI' }], // Electrode
  103: [{ category: 'alola', tag: 'ALOLA' }], // Exeggutor
  105: [{ category: 'alola', tag: 'ALOLA' }], // Marowak
  110: [{ category: 'galar', tag: 'GALAR' }], // Weezing
  115: [{ category: 'mega', tag: 'MEGA' }], // Kangaskhan
  122: [{ category: 'galar', tag: 'GALAR' }], // Mr. Mime
  127: [{ category: 'mega', tag: 'MEGA' }], // Pinsir
  128: [{ category: 'paldea', tag: 'PALDEA' }], // Tauros
  130: [{ category: 'mega', tag: 'MEGA' }], // Gyarados
  131: [{ category: 'gmax', tag: 'G-MAX' }], // Lapras
  133: [{ category: 'gmax', tag: 'G-MAX' }], // Eevee
  142: [{ category: 'mega', tag: 'MEGA' }], // Aerodactyl
  143: [{ category: 'gmax', tag: 'G-MAX' }], // Snorlax
  144: [{ category: 'galar', tag: 'GALAR' }], // Articuno
  145: [{ category: 'galar', tag: 'GALAR' }], // Zapdos
  146: [{ category: 'galar', tag: 'GALAR' }], // Moltres
  150: [{ category: 'mega', tag: 'MEGA X/Y' }], // Mewtwo

  // Gen 2
  157: [{ category: 'hisui', tag: 'HISUI' }], // Typhlosion
  181: [{ category: 'mega', tag: 'MEGA' }], // Ampharos
  194: [{ category: 'paldea', tag: 'PALDEA' }], // Wooper
  199: [{ category: 'galar', tag: 'GALAR' }], // Slowking
  208: [{ category: 'mega', tag: 'MEGA' }], // Steelix
  211: [{ category: 'hisui', tag: 'HISUI' }], // Qwilfish
  212: [{ category: 'mega', tag: 'MEGA' }], // Scizor
  214: [{ category: 'mega', tag: 'MEGA' }], // Heracross
  215: [{ category: 'hisui', tag: 'HISUI' }], // Sneasel
  222: [{ category: 'galar', tag: 'GALAR' }], // Corsola
  229: [{ category: 'mega', tag: 'MEGA' }], // Houndoom
  248: [{ category: 'mega', tag: 'MEGA' }], // Tyranitar

  // Gen 3
  254: [{ category: 'mega', tag: 'MEGA' }], // Sceptile
  257: [{ category: 'mega', tag: 'MEGA' }], // Blaziken
  260: [{ category: 'mega', tag: 'MEGA' }], // Swampert
  263: [{ category: 'galar', tag: 'GALAR' }], // Zigzagoon
  264: [{ category: 'galar', tag: 'GALAR' }], // Linoone
  282: [{ category: 'mega', tag: 'MEGA' }], // Gardevoir
  302: [{ category: 'mega', tag: 'MEGA' }], // Sableye
  303: [{ category: 'mega', tag: 'MEGA' }], // Mawile
  306: [{ category: 'mega', tag: 'MEGA' }], // Aggron
  308: [{ category: 'mega', tag: 'MEGA' }], // Medicham
  310: [{ category: 'mega', tag: 'MEGA' }], // Manectric
  319: [{ category: 'mega', tag: 'MEGA' }], // Sharpedo
  323: [{ category: 'mega', tag: 'MEGA' }], // Camerupt
  334: [{ category: 'mega', tag: 'MEGA' }], // Altaria
  351: [{ category: 'special', tag: 'CLIMA' }], // Castform
  354: [{ category: 'mega', tag: 'MEGA' }], // Banette
  359: [{ category: 'mega', tag: 'MEGA' }], // Absol
  362: [{ category: 'mega', tag: 'MEGA' }], // Glalie
  373: [{ category: 'mega', tag: 'MEGA' }], // Salamence
  376: [{ category: 'mega', tag: 'MEGA' }], // Metagross
  380: [{ category: 'mega', tag: 'MEGA' }], // Latias
  381: [{ category: 'mega', tag: 'MEGA' }], // Latios
  382: [{ category: 'primal', tag: 'PRIMAL' }], // Kyogre
  383: [{ category: 'primal', tag: 'PRIMAL' }], // Groudon
  384: [{ category: 'mega', tag: 'MEGA' }], // Rayquaza
  386: [{ category: 'special', tag: 'FORMAS' }], // Deoxys

  // Gen 4
  413: [{ category: 'special', tag: 'MANTOS' }], // Wormadam
  428: [{ category: 'mega', tag: 'MEGA' }], // Lopunny
  445: [{ category: 'mega', tag: 'MEGA' }], // Garchomp
  448: [{ category: 'mega', tag: 'MEGA' }], // Lucario
  460: [{ category: 'mega', tag: 'MEGA' }], // Abomasnow
  475: [{ category: 'mega', tag: 'MEGA' }], // Gallade
  479: [{ category: 'special', tag: 'ROTOM' }], // Rotom
  487: [{ category: 'origin', tag: 'ORIGEM' }], // Giratina
  492: [{ category: 'special', tag: 'SKY' }], // Shaymin

  // Gen 5
  503: [{ category: 'hisui', tag: 'HISUI' }], // Samurott
  531: [{ category: 'mega', tag: 'MEGA' }], // Audino
  549: [{ category: 'hisui', tag: 'HISUI' }], // Lilligant
  554: [{ category: 'galar', tag: 'GALAR' }], // Darumaka
  555: [{ category: 'galar', tag: 'GALAR' }], // Darmanitan
  562: [{ category: 'galar', tag: 'GALAR' }], // Yamask
  569: [{ category: 'gmax', tag: 'G-MAX' }], // Garbodor
  570: [{ category: 'hisui', tag: 'HISUI' }], // Zorua
  571: [{ category: 'hisui', tag: 'HISUI' }], // Zoroark
  618: [{ category: 'galar', tag: 'GALAR' }], // Stunfisk
  628: [{ category: 'hisui', tag: 'HISUI' }], // Braviary
  641: [{ category: 'special', tag: 'THERIAN' }], // Tornadus
  642: [{ category: 'special', tag: 'THERIAN' }], // Thundurus
  645: [{ category: 'special', tag: 'THERIAN' }], // Landorus
  646: [{ category: 'special', tag: 'FUSÃO' }], // Kyurem
  648: [{ category: 'special', tag: 'DANÇA' }], // Meloetta

  // Gen 6
  658: [{ category: 'special', tag: 'ASH' }], // Greninja
  705: [{ category: 'hisui', tag: 'HISUI' }], // Sliggoo
  706: [{ category: 'hisui', tag: 'HISUI' }], // Goodra
  713: [{ category: 'hisui', tag: 'HISUI' }], // Avalugg
  718: [{ category: 'special', tag: '10/50/100' }], // Zygarde
  719: [{ category: 'mega', tag: 'MEGA' }], // Diancie
  720: [{ category: 'special', tag: 'UNBOUND' }], // Hoopa

  // Gen 7
  724: [{ category: 'hisui', tag: 'HISUI' }], // Decidueye
  741: [{ category: 'special', tag: 'ESTILOS' }], // Oricorio
  745: [{ category: 'special', tag: 'FORMAS' }], // Lycanroc
  746: [{ category: 'special', tag: 'CARDUME' }], // Wishiwashi
  774: [{ category: 'special', tag: 'NÚCLEOS' }], // Minior
  778: [{ category: 'special', tag: 'DISFARCE' }], // Mimikyu
  800: [{ category: 'special', tag: 'FUSÃO' }, { category: 'special', tag: 'ULTRA' }], // Necrozma
  809: [{ category: 'gmax', tag: 'G-MAX' }], // Melmetal

  // Gen 8
  812: [{ category: 'gmax', tag: 'G-MAX' }], // Rillaboom
  815: [{ category: 'gmax', tag: 'G-MAX' }], // Cinderace
  818: [{ category: 'gmax', tag: 'G-MAX' }], // Inteleon
  823: [{ category: 'gmax', tag: 'G-MAX' }], // Corviknight
  826: [{ category: 'gmax', tag: 'G-MAX' }], // Orbeetle
  834: [{ category: 'gmax', tag: 'G-MAX' }], // Drednaw
  839: [{ category: 'gmax', tag: 'G-MAX' }], // Coalossal
  841: [{ category: 'gmax', tag: 'G-MAX' }], // Flapple
  842: [{ category: 'gmax', tag: 'G-MAX' }], // Appletun
  844: [{ category: 'gmax', tag: 'G-MAX' }], // Sandaconda
  849: [{ category: 'gmax', tag: 'G-MAX' }], // Toxtricity
  851: [{ category: 'gmax', tag: 'G-MAX' }], // Centiskorch
  858: [{ category: 'gmax', tag: 'G-MAX' }], // Hatterene
  861: [{ category: 'gmax', tag: 'G-MAX' }], // Grimmsnarl
  869: [{ category: 'gmax', tag: 'G-MAX' }], // Alcremie
  879: [{ category: 'gmax', tag: 'G-MAX' }], // Copperajah
  884: [{ category: 'gmax', tag: 'G-MAX' }], // Duraludon
  888: [{ category: 'special', tag: 'CROWNED' }], // Zacian
  889: [{ category: 'special', tag: 'CROWNED' }], // Zamazenta
  890: [{ category: 'special', tag: 'ETERNAMAX' }], // Eternatus
  892: [{ category: 'special', tag: 'STRIKES' }, { category: 'gmax', tag: 'G-MAX' }], // Urshifu
  898: [{ category: 'special', tag: 'RIDERS' }], // Calyrex
  901: [{ category: 'special', tag: 'LUA SANGRENTA' }], // Ursaluna
  905: [{ category: 'special', tag: 'THERIAN' }], // Enamorus

  // Gen 9
  964: [{ category: 'special', tag: 'HERÓI' }], // Palafin
  999: [{ category: 'special', tag: 'COFRE' }], // Gimmighoul
  1017: [{ category: 'special', tag: 'MÁSCARAS' }], // Ogerpon
  1024: [{ category: 'special', tag: 'TERASTAL' }], // Terapagos
};
