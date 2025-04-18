const searchInput = document.getElementById('search');
const searchButton = document.getElementById('btnSearch');
const pokemonList = document.getElementById('pokemon-list');
const btnViewAll = document.getElementById('btnViewAll');

async function showFirstPokemon() {
  for (let i = 1; i <= 12; i++) {
    await showPokemonById(i);
  }
}

async function showPokemonByName(name) {
  cleanScreen();
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) throw new Error('Not found');

    const data = await res.json();
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

    const card = createPokemonCard(data, speciesData, true); 
    pokemonList.appendChild(card);

    btnViewAll.style.display = 'block';
  } catch (err) {
    pokemonList.innerHTML = `
      <p style="color: white;">Oops! We couldn't find Pokémon "${name}"...<br>Maybe another Pokémon is waiting for you!</p>
    `;
    btnViewAll.style.display = 'block';  
  }
}

async function showPokemonById(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();

  const card = createPokemonCard(data, speciesData);
  pokemonList.appendChild(card);
}

function createPokemonCard(pokemon, species, enSearch = false) {
  const types = pokemon.types.map(t => t.type.name);
  const typePrincipal = types[0];
  const abilities = pokemon.abilities.map(h => h.ability.name).join(', ');

  const descriptionRaw = species.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text || 'No description available.';
  const description = descriptionRaw.replace(/\n|\f/g, ' ');

  const card = document.createElement('div');
  const typeClass = `type-${typePrincipal}`; 

  card.className = `pokemon-card${enSearch ? ' large' : ''} ${enSearch ? typeClass : ''}`;
  card.innerHTML = `
    <h3>${pokemon.name.toUpperCase()}</h3>
    <img class="pokemon-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}" />
    <div class="pokemon-details">
      <p><strong>Type:</strong> ${types.join(', ')}</p>
      <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
      <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
      <p><strong>Abilities:</strong> ${abilities}</p>
      <p><strong>Description:</strong> ${description}</p>
    </div>
  `;

  if (!enSearch) {
    card.addEventListener('click', () => {
      showPokemonByName(pokemon.name);
    });
  }

  return card;
}

function cleanScreen() {
  pokemonList.innerHTML = '';
}

btnViewAll.addEventListener('click', () => {
  cleanScreen();
  showFirstPokemon();
  btnViewAll.style.display = 'none';
  searchInput.value = '';
});

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query !== '') {
    showPokemonByName(query);
    btnViewAll.style.display = 'block';
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});

showFirstPokemon();