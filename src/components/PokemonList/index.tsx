
import { useEffect, useState, useContext } from "react";
import './index.css';
import FinDePaginaObserver from "../../util/FinDePaginaObserver";
import { DataContext } from "../../context/DataContext";
import { Pokemon } from "../../util/types";
import Loader from "../../util/Loader";



//funcion para hacer un string de tamaño 5, en este caso 00001 a 00015
function numberToPokeString(number: number) {
  return "#" + ("000" + number).slice(-4);
}



const PokemonList: React.FC = () => {

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const { handleSelectedPokemonChange, siguientePagina, setSiguientePagina, pokemonFetchedList, setPokemonFetchedList } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchPokemonList = async (url: string) => {
      const response = await fetch(url);
      const data = await response.json();
      const results = data.results;
      if (results) {
        setPokemonFetchedList(results);
        fetchPokemonListDetail(true);
      }

    }
    fetchPokemonList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1292");

    
    //fetchPokemonList("./util/pokemonFull.json");
  }, []);



  const handleCargarMas = () => {

    if (pokemonFetchedList.length === 0) {
      return;
    }
    fetchPokemonListDetail(false);
  }

  //Si cambia la lista por filtros, actualizar
  useEffect(() => {
    
    fetchPokemonListDetail(true);

  }, [pokemonFetchedList])

  const fetchPokemonListDetail = async (nuevaLista =false) => {

    if (pokemonFetchedList.length === 0) {
      return;
    }
    setIsLoading(true);

    // Array auxiliar para almacenar los nuevos elementos
    const updatedPokemonList: Pokemon[] = [];

    // Realizar las solicitudes fetch para obtener los detalles de cada Pokémon
    for (let i = siguientePagina; i < (siguientePagina + 14); i++) {


      const pokemon = pokemonFetchedList[i];

      if (!pokemon) { continue }
      const response = await fetch(pokemon.url);
      const data = await response.json();
      const { name, types, id, sprites } = data;
      const sprite = sprites.other["official-artwork"].front_default;
      const pokeItem: Pokemon = {
        name: name,
        url: pokemon.url,
        types: types,
        id: id,
        sprite: sprite,
        nuevo: nuevaLista
      };

      updatedPokemonList.push(pokeItem);



    }

    //cuando se aplica un filtro se resetea el valor de las páginas a 0.
    if (siguientePagina === 0) {
      setPokemonList([...updatedPokemonList]);
    } else {
      setPokemonList([...pokemonList, ...updatedPokemonList]);
    }
    // Actualizar el estado una vez finalizadas todas las solicitudes
    setSiguientePagina(siguientePagina + 14);
    setIsLoading(false);

  };



  return (
    <div>

      <div className="row pokemon-list">
        {pokemonList.map((pokemon: any, index: number) => {
          return <PokemonCard key={index} pokemon={pokemon} isLoading={isLoading && index>= siguientePagina}
            onSelectedPokemonChange={handleSelectedPokemonChange} />
        })}
        <div className="cargar-mas">

          <FinDePaginaObserver isLoading={isLoading} onFinDePagina={() => handleCargarMas()} />

        </div>
      </div>
    </div>
  )
}

const PokemonCard = ({ pokemon, onSelectedPokemonChange, isLoading }: { pokemon: Pokemon, onSelectedPokemonChange: (pokemonId: number) => void , isLoading: boolean}) => {

  return <div className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-3 card-container poke-id-${pokemon.id} ${ isLoading? "loading" : ""}`}
    data-bs-toggle="offcanvas"
    data-bs-target={"#offcanvasRight"} aria-controls="offcanvasRight"
    onClick={() => onSelectedPokemonChange(pokemon.id)}>
    <div className={`card custom-card ${pokemon.types[0].type.name}`} >
      <div className="row">
        <div className="col no-wrap">
          <h6>{numberToPokeString(pokemon.id)}</h6>
          <h5 className="is-title">{pokemon.name}</h5>
          <div className="types">
            {pokemon.types.map((type: any, index: number) => {
              return <TypeBadge key={index} name={type.type.name} />
            })}
          </div>
          <div className={`poke-image ${pokemon.sprite ? "" : "no-image"}`}>
            {( isLoading)? <Loader /> :pokemon.sprite ? <img src={pokemon.sprite} alt={pokemon.name} className="w-100" /> : ""}
          </div>
        </div>

      </div>
    </div>
  </div>
}

export const TypeBadge = ({ name }: { name: string }) => {
  return <div className={`type-${name} type-badge`} >
    <span className="icon"></span>
    <span className="is-title">{name}</span>
  </div>
}


export default PokemonList;