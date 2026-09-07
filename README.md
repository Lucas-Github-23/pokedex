<div align="center">

# ⚡ POKÉDEX NACIONAL PRO
### Sistema Biométrico & Terminal de Diagnóstico de Espécimes // Silph Co. OS

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PokéAPI](https://img.shields.io/badge/PokéAPI-v2-EF4444?style=for-the-badge&logo=pokemon&logoColor=white)](https://pokeapi.co/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  Uma Pokédex completa de alto impacto visual e arquitetura moderna inspirada no chassi de hardware físico da Silph Co. Suporta todos os <strong>1.025 Pokémon</strong> (Gerações I a IX), formas alternativas, multi-estilo de sprites de consoles, matriz de filtragem avançada por atributos de combate e biometria, áudio oficial dos Cries e radar de locais de captura.
</p>

[Visualizar Demonstração](#-como-executar-o-projeto) • [Funcionalidades](#-funcionalidades) • [Filtros Avançados](#-central-de-filtros-avançados) • [Instalação](#-como-executar-o-projeto)

</div>

---

## 📸 Visão Geral

- **Hardware Chassi Silph Co.**: Interface estilizada com tela LCD rebaixada, lente sensora com iluminação volumétrica, parafusos chanfrados e LEDs operacionais.
- **1.025 Espécimes Indexados**: Cobertura integral de Kanto (Gen 1) até Paldea e DLCs (Gen 9 - Pecharunt #1025).
- **Nomes Oficiais em Japonês (Katakana)**: Todos os 1.025 espécimes com seus nomes em japonês originais mapeados e exibidos tanto nos cards da grade quanto no modal de análise.

---

## ✨ Funcionalidades Principais

### 🎮 Multi-Console Sprite Engine
Alterne instantaneamente o estilo visual de todos os Pokémon da Pokédex:
- **🎨 Oficial HD**: Ilustrações oficiais em altíssima definição da *The Pokémon Company*.
- **⚡ Showdown 3D**: Sprites animados 3D de todas as gerações provenientes do *Pokémon Showdown*.
- **👾 Nintendo DS**: Sprites animados e pixel-art clássicos da Geração 5 (Black & White).
- **🕹️ Game Boy Advance (GBA)**: Sprites retrô 16-bit clássicos com renderização pixel-perfect e zero blur (`image-rendering: pixelated`).

### 🧬 Formas Alternativas & Variantes
Suporte e identificação automática de formas especiais com seletor interativo no modal:
- **Mega Evoluções**: Mega Charizard X/Y, Mega Mewtwo X/Y, Mega Rayquaza, etc.
- **Formas Regionais**: Alola, Galar, Hisui e Paldea.
- **Gigantamax (G-Max)**: Formas gigantescas com artes dedicadas.
- **Formas Primitivas & Origem**: Primal Kyogre/Groudon, Giratina Origem, Dialga/Palkia Origem.
- **Formas Especiais**: Ash-Greninja, Palafin Hero, Zygarde (10%, 50%, Complete), etc.

### 🔬 Terminal de Diagnóstico (Modal Interativo)
- **Áudio Oficial (Cry)**: Reprodução do som característico de cada Pokémon com equalizador visual animado.
- **Alternador Normal / Shiny ✨**: Visualize a paleta de cores rara de qualquer Pokémon ou forma alternativa em tempo real.
- **Matriz de Atributos & BST**: Barras de status animadas para HP, Ataque, Defesa, Sp. Atk, Sp. Def e Velocidade, além do cálculo do BST (*Base Stat Total*).
- **Matriz Evolutiva Interativa**: Cadeia evolutiva completa com indicação visual do estágio atual e condições de evolução (nível, pedra de evolução, troca, itens especiais, amizade).
- **Radar de Jogos & Locais de Captura**: Mapeamento completo de áreas de encontro divididas por versão de jogo (Geração I até IX), com chances de aparição, níveis e métodos (grama, pesca, surf, etc.).

### ❤️ Sistema de Favoritos com Confetes
- Salve seus espécimes favoritos com persistência automática no `localStorage`.
- Micro-animação comemorativa com chuva de confetes (`canvas-confetti`) ao favoritar.
- **Drawer Lateral de Favoritos**: Acesso rápido, visualização de cards favoritados e botão de filtro direto na tela principal.

### ⚡ Carregamento Infinito (Infinite Scroll)
- Carregamento gradual e fluido via `IntersectionObserver` com barra de telemetria de progresso do radar biométrico.

---

## 🎛️ Central de Filtros Avançados

O terminal inclui um modal dedicado de filtragem paramétrica com suporte a múltiplos critérios simultâneos:

| Categoria | Opções Disponíveis |
| :--- | :--- |
| **Atributos de Combate (BST)** | Faixas de poder: Muito Baixo (<300), Baixo (300-399), Médio (400-499), Alto (500-599), Competitivo (600+) |
| **Atributo Destaque (Stat)** | Filtrar espécimes pelo maior atributo base (HP, Ataque, Defesa, Sp. Atk, Sp. Def ou Velocidade) |
| **Biometria (Peso & Altura)** | Classes de Peso (Leve, Médio, Pesado, Titânico) e Altura (Pequeno, Médio, Alto, Colossal) |
| **Estágio Evolutivo** | Forma Básica (Inicial), Estágio 1 (Intermediário), Estágio Final, Forma Única (Sem Evolução) |
| **Categorias Especiais** | Iniciais, Lendários, Míticos, Paradoxos, Ultra Beasts, Bebês, Fósseis, Pseudo-Lendários |
| **Combinações de Tipos** | Filtro por tipo primário e secundário com opção de tipo único (*Mono-tipo*) |
| **Ordenação Biométrica** | Número (# crescente/decrescente), Nome (A-Z / Z-A), BST Total, Atributos individuais e Peso/Altura |

---

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
| :---: | :--- |
| <kbd>/</kbd> | Foca instantaneamente a barra de busca do Radar |
| <kbd>Esc</kbd> | Fecha o modal de detalhes, filtros avançados ou gaveta de favoritos |
| <kbd>→</kbd> | Avança para o próximo espécime dentro do modal |
| <kbd>←</kbd> | Retorna para o espécime anterior dentro do modal |

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)**: Biblioteca central com novos hooks e arquitetura baseada em componentes reativos.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática rigorosa para dados da PokéAPI, estados e modelos.
- **[Vite 8](https://vitejs.dev/)**: Build tool ultrarrápido com Hot Module Replacement (HMR).
- **[Vanilla CSS (Design Tokens)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)**: Sistema de design próprio com glassmorphism, temas dinâmicos por tipo elemental e animações aceleradas por hardware.
- **[Lucide React](https://lucide.dev/)**: Conjunto de ícones vetoriais modernos.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)**: Efeito de partículas para celebração de favoritos.
- **[PokéAPI v2](https://pokeapi.co/)**: Fonte de dados REST para espécies, estatísticas, evoluções e locais.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** / **pnpm**

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/Lucas-Github-23/pokedex.git
cd pokedex
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Abra no seu navegador:**
```
http://localhost:5173
```

5. **Gerar a build de produção:**
```bash
npm run build
```

6. **Visualizar a build de produção localmente:**
```bash
npm run preview
```

---

## 📂 Estrutura do Projeto

```
pokedex/
├── public/                     # Favicons, SVGs e assets estáticos
├── src/
│   ├── components/             # Componentes React modulares
│   │   ├── ActiveFilterChips.tsx    # Chips de filtros ativos com remoção rápida
│   │   ├── AdvancedFilterModal.tsx  # Central de filtragem avançada por biometria/BST
│   │   ├── EvolutionChain.tsx       # Linha evolutiva interativa
│   │   ├── FavoritesDrawer.tsx      # Gaveta lateral de favoritos
│   │   ├── FilterBar.tsx            # Barra de busca, cartuchos de geração e tipos
│   │   ├── GameLocations.tsx        # Radar de jogos e locais de captura
│   │   ├── Navbar.tsx               # Topo de hardware Silph Co. com sensores
│   │   ├── PokemonCard.tsx          # Card do espécime com número e Katakana
│   │   ├── PokemonList.tsx          # Grade de espécimes com infinite scroll
│   │   ├── PokemonModal.tsx         # Terminal holográfico de diagnóstico completo
│   │   ├── StatBar.tsx              # Barra animada de estatísticas de combate
│   │   └── TypeIcon.tsx             # Ícones vetoriais dos 18 tipos elementais
│   ├── constants/              # Dicionários e dados estáticos de alta velocidade
│   │   ├── gameLocationsData.ts     # Metadados de edições de jogos e consoles
│   │   ├── japaneseNames.ts         # 1.025 nomes em japonês Katakana (Gen I - IX)
│   │   ├── pokemonBaseData.ts       # Estatísticas base, BST e biometria dos 1.025
│   │   ├── pokemonData.ts           # Configurações de tipos elementais e gerações
│   │   ├── pokemonForms.ts          # Mapeamento de formas alternativas e megas
│   │   ├── pokemonTypes.ts          # Mapeamento rápido de tipos por ID
│   │   └── spriteStyles.ts          # Resolução de CDNs de sprites multi-console
│   ├── hooks/                  # Hooks customizados
│   │   └── useFavorites.ts          # Gerenciamento e persistência de favoritos
│   ├── services/               # Camada de comunicação com a PokéAPI
│   │   └── pokeapi.ts               # Requisições REST com cache em memória
│   ├── types/                  # Definições de tipos TypeScript
│   │   └── pokemon.ts               # Interfaces de Pokémon, filtros e locais
│   ├── utils/                  # Funções utilitárias
│   │   └── filterHelpers.ts         # Pipeline de filtragem paramétrica
│   ├── App.tsx                 # Componente raiz da aplicação
│   ├── index.css               # Design system global e estilos do chassi
│   └── main.tsx                # Ponto de entrada React
├── LICENSE                     # Licença MIT
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença **MIT** - consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.

---

<div align="center">
  Desenvolvido com carinho por <a href="https://github.com/Lucas-Github-23"><strong>Lucas</strong></a> ⚡
</div>
