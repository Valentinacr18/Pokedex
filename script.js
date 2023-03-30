const url = 'https://pokeapi.co/api/v2/pokemon/';

const searchInput = document.getElementById("search");
const pokedexContainer = document.getElementById("pokedex");

function showError(msg) {
    pokedexContainer.innerHTML = `<p class="error">${msg}</p>`;
}

async function searchPokemon (){

    const searchedPokemon = searchInput.value.toLowerCase();

    try {

        const response = await fetch(url+searchedPokemon)

        if (!response.ok) {
            showError(`No se encontró ningún Pokémon llamado "${searchedPokemon}"`);
            return;
        }
        
        const information = await response.json();

        pokedexContainer.innerHTML=
        `
            <h2> ${information.name.toUpperCase()} </h2>
            <img src="${information.sprites.front_default}" alt="${information.name}">
            <p> Numero: ${information.id}</p> 
            <p> Altura: ${information.height}</p>
            <p> Peso: ${information.weight}</p>
        `;
        
    } catch (error) {

        showError('Error al buscar el Pokémon');
        console.error(error);
        
    }
}

document.getElementById("btnSearch").addEventListener("click", searchPokemon)