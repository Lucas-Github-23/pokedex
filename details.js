// Função para buscar detalhes do Pokémon
async function fetchPokemonDetails(name) {
  try {
    // Detalhes básicos
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();

    // Detalhes da espécie (para a cadeia de evolução)
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    // Cadeia de evolução
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();

    // Jogos e locais
    const locationsResponse = await fetch(data.location_area_encounters);
    const locationsData = await locationsResponse.json();

    // Verificar se o Pokémon é capturável
    const isCatchable = locationsData.length > 0;

    // Exibir os dados
    document.getElementById('pokemon-name').textContent = data.name;
    document.getElementById('pokemon-image').src = data.sprites.front_default;
    document.getElementById('pokemon-types').textContent = data.types.map((type) => type.type.name).join(', ');
    document.getElementById('pokemon-height').textContent = (data.height / 10).toFixed(1);
    document.getElementById('pokemon-weight').textContent = (data.weight / 10).toFixed(1);

    // Exibir locais e jogos apenas se o Pokémon for capturável
    if (isCatchable) {
      const locations = groupByGame(locationsData);
      document.getElementById('pokemon-locations').textContent = 'Capturável em:';
      const gamesContainer = document.getElementById('pokemon-games');
      gamesContainer.innerHTML = '';

      Object.keys(locations).forEach(game => {
        const gameLocations = locations[game].join(', ');
        const regionClass = getRegionColorClass(game); // Obtém a classe de cor
        gamesContainer.innerHTML += `
          <div class="game-card ${regionClass}">
            <p><strong>${game}:</strong> ${gameLocations}</p>
          </div>
        `;
      });
    } else {
      document.getElementById('pokemon-locations').textContent = 'Não capturável';
    }

    // Exibir estatísticas
    const statsList = document.getElementById('pokemon-stats');
    statsList.innerHTML = data.stats
      .map(
        (stat) => `
        <li>
          <strong>${stat.stat.name}:</strong> ${stat.base_stat}
        </li>
      `
      )
      .join('');

    // Exibir linha evolutiva
    const evolutionChain = getEvolutionChain(evolutionData.chain);
    const evolutionContainer = document.getElementById('evolution-chain');
    evolutionContainer.innerHTML = evolutionChain
      .map(
        (stage) => `
        <div class="evolution-stage">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png" alt="${stage.name}">
          <p>${stage.name}</p>
        </div>
      `
      )
      .join('');
  } catch (error) {
    console.error('Erro ao buscar detalhes do Pokémon:', error);
  }
}

// Função para agrupar os locais por jogo
function groupByGame(locations) {
  return locations.reduce((acc, location) => {
    location.version_details.forEach((detail) => {
      const gameName = detail.version.name;
      if (!acc[gameName]) {
        acc[gameName] = [];
      }
      acc[gameName].push(location.location_area.name);
    });
    return acc;
  }, {});
}

// Função para obter a classe de cor da região com base no nome do jogo
function getRegionColorClass(gameName) {
  const regionColors = {
    red: 'red',
    blue: 'blue',
    'firered': 'fire-red',
    'leafgreen': 'leaf-green',
    yellow: 'yellow',
    gold: 'gold',
    silver: 'silver',
    crystal: 'crystal',
    ruby: 'ruby',
    sapphire: 'sapphire',
    emerald: 'emerald',
    diamond: 'diamond',
    pearl: 'pearl',
    platinum: 'platinum',
    black: 'black',
    white: 'white',
    sun: 'sun',
    moon: 'moon',
    'ultra-sun': 'ultra-sun',
    'ultra-moon': 'ultra-moon',
    sword: 'sword',
    shield: 'shield',
    'lets-go-pikachu': 'lets-go-pikachu',
    'lets-go-eevee': 'lets-go-eevee',
    'heartgold': 'heartgold',
    'soulsilver': 'soulsilver',
    x: 'x',
    y: 'y',
  };

  // Retorna a classe de cor associada ao nome do jogo (ou vazio se não encontrado)
  return regionColors[gameName.toLowerCase()] || '';
}

// Função para extrair a cadeia de evolução
function getEvolutionChain(chain) {
  let evolutionChain = [];
  let current = chain;

  while (current) {
    const id = current.species.url.split('/')[6];
    evolutionChain.push({ name: current.species.name, id });
    current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
  }

  return evolutionChain;
}

// Inicialização
const urlParams = new URLSearchParams(window.location.search);
const pokemonName = urlParams.get('name');
fetchPokemonDetails(pokemonName);