// Elementos do DOM
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const pokemonList = document.getElementById('pokemon-list');

let allPokemon = []; // Armazena todos os Pokémon

// Função para buscar todos os Pokémon
async function fetchAllPokemon() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    allPokemon = data.results.map((pokemon) => ({
      name: pokemon.name,
      id: getPokemonId(pokemon.url),
      url: pokemon.url,
    }));
    displayPokemonList(allPokemon);
  } catch (error) {
    console.error('Erro ao buscar Pokémon:', error);
  }
}

// Função para exibir a lista de Pokémon
function displayPokemonList(pokemonArray) {
  pokemonList.innerHTML = pokemonArray
    .map(
      (pokemon) => `
      <div onclick="window.location.href='details.html?name=${pokemon.name}'">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
        <p>${pokemon.name}</p>
      </div>
    `
    )
    .join('');
}

// Função para extrair o ID do Pokémon da URL
function getPokemonId(url) {
  return url.split('/')[6];
}

// Função para processar a pesquisa
function handleSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  if (!searchTerm) {
    displayPokemonList(allPokemon);
    return;
  }

  if (searchTerm.startsWith('tipo:')) {
    const type = searchTerm.replace('tipo:', '').trim();
    filterByType(type);
  } else if (searchTerm.startsWith('região:')) {
    const region = searchTerm.replace('região:', '').trim();
    filterByRegion(region);
  } else {
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.name.includes(searchTerm)
    );
    displayPokemonList(filteredPokemon);
  }
}

// Função para filtrar Pokémon por tipo
async function filterByType(type) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    const pokemonOfType = data.pokemon.map((entry) => ({
      name: entry.pokemon.name,
      id: getPokemonId(entry.pokemon.url),
      url: entry.pokemon.url,
    }));
    displayPokemonList(pokemonOfType);
  } catch (error) {
    console.error('Erro ao filtrar por tipo:', error);
  }
}

// Função para filtrar Pokémon por região (geração)
async function filterByRegion(region) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${region}`);
    const data = await response.json();
    const pokemonOfRegion = data.pokemon_species.map((pokemon) => ({
      name: pokemon.name,
      id: getPokemonId(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`),
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
    }));
    displayPokemonList(pokemonOfRegion);
  } catch (error) {
    console.error('Erro ao filtrar por região:', error);
  }
}

// Eventos
document.addEventListener('DOMContentLoaded', fetchAllPokemon);
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});