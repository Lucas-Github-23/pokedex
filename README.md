# ⚡ Pokédex Nacional PRO

Uma Pokédex moderna de alto impacto visual desenvolvida com **React 19**, **TypeScript** e **Vite**, consumindo dados em tempo real da [PokéAPI](https://pokeapi.co/).

![Pokédex Preview](public/pokeball.svg)

---

## ✨ Funcionalidades

- 🔴 **1025 Pokémon**: Suporte completo a todas as gerações (Geração I Kanto até Geração IX Paldea).
- 🔍 **Busca & Filtros Inteligentes**:
  - Busca em tempo real por nome e número (ex: `#0025` ou `Pikachu`).
  - Suporte a comandos de pesquisa (`tipo:fogo`, `região:kanto`).
  - Pílulas de filtro para todos os 18 tipos elementais com cores personalizadas.
  - Abas rápidas para alternar entre as 9 gerações.
  - Ordenação por número (# crescente/decrescente) e nome (A-Z / Z-A).
- 🧬 **Modal de Detalhes Completo**:
  - Estatísticas de combate (HP, Ataque, Defesa, etc.) com barras de progresso animadas e BST (Base Stat Total).
  - Árvore e linha evolutiva interativa (evoluções por nível, itens, etc.) clicável.
  - **Jogos e Locais de Captura**: Áreas de encontro agrupadas por versão de jogo com badges coloridos dedicados para cada título clássico (Red, Blue, Emerald, FireRed, Diamond, etc.).
  - Alternador de versão normal e **Shiny ✨**.
  - **Som Oficial (Pokémon Cry)** com animação de onda sonora.
- ❤️ **Sistema de Favoritos**:
  - Salve seus Pokémon prediletos no `localStorage`.
  - Efeito comemorativo de confetes ao favoritar.
  - Gaveta lateral para acesso rápido e gerenciamento dos favoritos.
- 🎨 **Design Cyber & Glassmorphism**:
  - Tema escuro sofisticado com iluminação dinâmica baseada no tipo elemental primário do Pokémon.
  - Sprites em alta definição (*Official Artwork*).
  - Totalmente responsivo para mobile, tablets e desktop.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **TypeScript**
- **Vite 8**
- **Vanilla CSS** (Design System com Glassmorphism e animações)
- **Lucide React** (Ícones modernos)
- **Canvas Confetti** (Micro-animações de celebração)
- **PokéAPI v2** (REST API)

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/Lucas-Github-23/pokedex.git
cd pokedex
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

5. Para gerar a build de produção:
```bash
npm run build
```

---

## 📄 Licença

Distribuído sob a licença MIT. Criado por [Lucas](https://github.com/Lucas-Github-23).
