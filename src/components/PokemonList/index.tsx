
import { useEffect, useState } from "react";
import './index.css';
import FinDePaginaObserver from "../../util/FinDePaginaObserver";


interface PokemonListProps {
  onSelectedPokemonChange: (pokemonId: number) => void;
}
//funcion para hacer un string de tamaño 5, en este caso 00001 a 00015
function numberToPokeString(number: number) {
  return "#" + ("000" + number).slice(-4);
}

interface Pokemon {
  name: string;
  url: string;
  types: Type[];
  id: number;
  sprite: string;
}

interface Type {
  type: Type;
  name: string;
}
const PokemonList: React.FC<PokemonListProps> = ({ onSelectedPokemonChange }: PokemonListProps) => {

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [siguientePagina, setSiguientePagina] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    fetchPokemonList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=15");
  }, []);



  const handleCargarMas = () => {
    setIsLoading(true);
    if(siguientePagina === ""){
      return;
    }    
    
    fetchPokemonList(siguientePagina);
  }
  const fetchPokemonList = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    setSiguientePagina(data.next);

    // Array auxiliar para almacenar los nuevos elementos
    const updatedPokemonList: Pokemon[] = [];
    
    // Realizar las solicitudes fetch para obtener los detalles de cada Pokémon
    for (const pokemon of results) {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      const { name, types, id, sprites } = data;
      const sprite = sprites.other["official-artwork"].front_default;
      const pokeItem: Pokemon = {
        name: name,
        url: pokemon.url,
        types: types,
        id: id,
        sprite: sprite
      };

      updatedPokemonList.push(pokeItem);
    }

    // Actualizar el estado una vez finalizadas todas las solicitudes
    setPokemonList([...pokemonList, ...updatedPokemonList]);
    setIsLoading(false);

  };



  return (
    <div>
     
      <div className="row pokemon-list" style={{pointerEvents: isLoading ? "none" : "auto"}}>
        {pokemonList.map((pokemon: any, index: number) => {
          return <PokemonCard key={index} pokemon={pokemon} onSelectedPokemonChange={onSelectedPokemonChange} />
        })}
        <div className="cargar-mas">   
                 
          <FinDePaginaObserver isLoading={isLoading} onFinDePagina={() => handleCargarMas()}/>
          
        </div>
      L</div>
    </div>
  )
}

const PokemonCard = ({ pokemon, onSelectedPokemonChange }: { pokemon: Pokemon, onSelectedPokemonChange: (pokemonId: number) => void }) => {
  return <div className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-3 card-container poke-id-${pokemon.id}`}
    data-bs-toggle="offcanvas"
    data-bs-target={"#offcanvasRight"} aria-controls="offcanvasRight"
    onClick={() => onSelectedPokemonChange(pokemon.id)}>
    <div className={`card custom-card ${pokemon.types[0].type.name}`} >
      <div className="row">
        <div className="col">
          <h6>{numberToPokeString(pokemon.id)}</h6>
          <h5 className="is-title">{pokemon.name}</h5>
          <div className="types">
            {pokemon.types.map((type: any, index: number) => {
              return <TypeBadge key={index} name={type.type.name} />
            })}
          </div>
          <div className="poke-image">
            <img src={pokemon.sprite} alt={pokemon.name} className="w-100" />
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