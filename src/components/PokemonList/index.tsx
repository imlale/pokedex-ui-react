
import { useEffect, useState, useContext } from "react";
import './index.css';
import FinDePaginaObserver from "../../util/FinDePaginaObserver";
import { DataContext } from "../../context/DataContext";
import { Pokemon } from "../../util/types";
import Loader from "../../util/Loader";
import { useTranslation } from "react-i18next";
import { fetchPokemonList, fetchPokemonListDetail } from "../../services/fetchPokemonApi";



//funcion para hacer un string de tamaño 5, en este caso 00001 a 00015
function numberToPokeString(number: number) {
  return "#" + ("000" + number).slice(-4);
}



const PokemonList: React.FC = () => {

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const { onSelectedPokemonChange: handleSelectedPokemonChange, siguientePagina, setSiguientePagina, pokemonFetchedList, setPokemonFetchedList } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      fetchPokemonList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1292")
        .then(results => {
          setPokemonFetchedList(results);
          fetchPokemonListDetail(pokemonFetchedList, 0, 14);
        })

    } catch (error: any) {
      throw Error(error.message);
    }
  }, []);

  useEffect(() => {

    setIsLoading(true);

    fetchPokemonListDetail(pokemonFetchedList, siguientePagina, 14)
      .then((updatedPokemonList) => {
        setIsLoading(false);
        if (siguientePagina === 0) {
          setPokemonList([...updatedPokemonList]);
        } else {
          setPokemonList([...pokemonList, ...updatedPokemonList]);
        }
      });
  }, [pokemonFetchedList, siguientePagina])

  const handleCargarMas = () => {
    if(pokemonFetchedList.length === 0) {
      return;
    }
    setSiguientePagina(siguientePagina+14);
  }

  
  return (
    <div>

      <div className="row pokemon-list">
        {pokemonList.map((pokemon: any, index: number) => {
          return <PokemonCard key={pokemon.id} pokemon={pokemon} isLoading={isLoading && index >= siguientePagina}
            onSelectedPokemonChange={handleSelectedPokemonChange} />
        })}
        <div className="cargar-mas">

          <FinDePaginaObserver isLoading={isLoading} onFinDePagina={() => handleCargarMas()} />

        </div>
      </div>
    </div>
  )
}

const PokemonCard = ({ pokemon, onSelectedPokemonChange, isLoading }: { pokemon: Pokemon, onSelectedPokemonChange: (pokemonId: number) => void, isLoading: boolean }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return <div className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-3 card-container poke-id-${pokemon.id} ${isLoading ? "loading" : ""}`}
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
          <div className={`poke-image ${pokemon.sprite ? "" : "no-image"} ${imageLoading ? "loading" : ""}`}>
            {(imageLoading)? <div className="position-absolute"><Loader /></div> : ""}
            {(isLoading) ? <Loader /> : pokemon.sprite ? <img onLoad={() => setImageLoading(false)} src={pokemon.sprite} alt={pokemon.name} className="w-100" /> : ""}
          </div>
        </div>

      </div>
    </div>
  </div>
}

export const TypeBadge = ({ name }: { name: string }) => {
  const [t] = useTranslation("global")
  return <div className={`type-${name} type-badge`} >
    <span className="icon"></span>
    <span className="is-title">{t(`types.${name ? name : "unknown"}`)}</span>
  </div>
}


export default PokemonList;