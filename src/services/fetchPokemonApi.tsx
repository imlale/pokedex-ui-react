import { Pokemon } from "../util/types";

export const fetchPokemonDetail = async (selectedPokemon: number) => {

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
  const data = await response.json();
  //obtener informacíon de la especie
  const species = await fetch(data.species.url);
  const data2 = await species.json();

  data.species = { ...data.species, ...data2 }

  return data 
}

export async function fetchPokemonListDetail(pokemonFetchedList: any, initial: number, quantity: number) {


  // Array auxiliar para almacenar los nuevos elementos
  const updatedPokemonList: Pokemon[] = [];

  // Realizar las solicitudes fetch para obtener los detalles de cada Pokémon
  for (let i = initial; i < (initial + quantity); i++) {
    let pokeItem = {} as Pokemon;
    const pokemon = await pokemonFetchedList[i];
    if (!pokemon) { continue }
    if (localStorage.getItem(pokemon.url)) {
      pokeItem = await JSON.parse(localStorage.getItem(pokemon.url) as string)
    } else {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      const { name, types, id, sprites } = data;
      const sprite = sprites.other["official-artwork"].front_default;
      pokeItem = {
        name: name,
        url: pokemon.url,
        types: types,
        id: id,
        sprite: sprite
      }
      localStorage.setItem(pokeItem.url, JSON.stringify(pokeItem));
    }

    updatedPokemonList.push(pokeItem);

  }

  return await Promise.all(updatedPokemonList);
};

export const fetchPokemonList = async (url: string) => {
  let results = [];
  if (!localStorage.getItem(url)) {
    const response = await fetch(url);
    const data = await response.json();
    results = data.results;
    localStorage.setItem(url, JSON.stringify(results));
  } else {
    results = JSON.parse(localStorage.getItem(url) as string);
  }


  return results;
}

export const fetchPokemonChain = async (ids: number[]) => {
  let results = [{ sprite: "", id: 0 }];
  if (!sessionStorage.getItem("chain-" + ids.join("-"))) {
    const promises = ids.map(async (id) => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}/`);
      if (!response.ok) {
        throw new Error("errors.fetch-pokemon");
      }
      const data = await response.json();
      return { sprite: data.sprites.front_default, id: data.id };
    });
    results = await Promise.all(promises);
    sessionStorage.setItem("chain-" + ids.join("-"), JSON.stringify(results));
  } else {
    results = JSON.parse(sessionStorage.getItem("chain-" + ids.join("-")) as string);
  }
  return results;

};

export const fetchPokemonEvolution = async (url: string) => {
  try {
    let results = []

    if (sessionStorage.getItem(url)) {
      results = JSON.parse(sessionStorage.getItem(url) as string);
    } else {
      const response = await fetch(`${url}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener la cadena evolutiva.');
      }
      const data = await response.json();

      const evolutionResponse = await fetch(data.evolution_chain.url);
      if (!evolutionResponse.ok) {
        throw new Error('No se pudo obtener la cadena evolutiva.');
      }
      results = await evolutionResponse.json();
      sessionStorage.setItem(url, JSON.stringify(results));
    }
    return results;

  } catch (error: any) {
    throw new Error(error.message);
  }

};



export async function fetchPokemonColors() {
  let results = []

  if (localStorage.getItem("pokemon-colors")) {
    results = JSON.parse(localStorage.getItem("pokemon-colors") as string);
  } else {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon-color/");
      if (!response.ok) {
        throw new Error("errors.fetch-colors");
      }
      const data = await response.json();
      results = data.results
      localStorage.setItem("pokemon-colors", JSON.stringify(results));
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  return results
}

export async function fetchPokemonTypes() {
  let results = []
  if (localStorage.getItem("pokemon-types")) {
    results = JSON.parse(localStorage.getItem("pokemon-types") as string);
  } else {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/type");
      if (!response.ok) {
        throw new Error("errors.fetch-types");
      }
      const data = await response.json();
      results = data.results;
      localStorage.setItem("pokemon-types", JSON.stringify(results));
    } catch (error: any) {
      throw Error(error.message);

    }
  }
  return results;
}

interface PokemonItem {
  name: string;
  url: string;
}
export const fecthPokemonsByType = async (type: string) => {
  let resultadoMapeado = []
  if (sessionStorage.getItem("types-"+type)) {
    return JSON.parse(sessionStorage.getItem("types-"+type) as string)
  }
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
  const data = await response.json();
  const listaPokemonPorTypo = data.pokemon
  resultadoMapeado = listaPokemonPorTypo.map(({ pokemon }: { pokemon: PokemonItem }) => {
    return pokemon
  })
  sessionStorage.setItem("types-"+type, JSON.stringify(resultadoMapeado));
  return resultadoMapeado;
}


export const fecthPokemonsByColor = async (colorUrl: string) => {
  let resultadoMapeado
  if(sessionStorage.getItem(colorUrl)){
    resultadoMapeado = JSON.parse(sessionStorage.getItem(colorUrl) as string)
    return resultadoMapeado;
  }
  const response = await fetch(colorUrl);
  const data = await response.json();
  if (data) {
      const listaPokemonPorTypo = data.pokemon_species
      resultadoMapeado = listaPokemonPorTypo.map((pokemon: Pokemon) => {
          return { name: pokemon.name, url: pokemon.url.replace("-species", "") }
      }) 
  }
  sessionStorage.setItem(colorUrl, JSON.stringify(resultadoMapeado));
  return resultadoMapeado;

}