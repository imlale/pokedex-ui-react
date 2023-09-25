import { pokemonAPI } from "../../util/pokemonAPI";
import {useState} from 'react';
import './index.css';

interface  Pokemon{
    name: string;
    id:  number;
    
}
interface PokemonListProps {
    onSelectedPokemonChange: (pokemonId: number) => void;
  }
const SearchBar = ({onSelectedPokemonChange} : PokemonListProps) => {
    //const [resultados, setResultados] = useState();
    const [valorBuscado, setValorBuscado] = useState("");
    const handleChange = (valor : string) =>{
        setValorBuscado(valor)

    }

    const handleClick = (id: number) =>{
        
        //limpiar el input de busqueda
        setValorBuscado("")
        onSelectedPokemonChange(id)
    }

    let datosFiltrados = [];
    if(valorBuscado != ""){
         datosFiltrados = pokemonAPI.results.filter((pokemon: Pokemon)=>{
         return pokemon.name.toLowerCase().includes(valorBuscado.toLowerCase())
     })
    }
    
    return <div className="search-bar form-outline">
        <span className="search-icon"></span>
        <input type="search" onChange={(e)=>{handleChange(e.target.value)}}
                className="input-search focus-ring focus-ring-dark" placeholder="What Pokemon are you looking for?"
                value={valorBuscado}/>
        <div className={'search-results ' + (valorBuscado != "" ? "show" : "hide")}>
            <ul className="list-group ">
                {datosFiltrados.map((pokemon: Pokemon)=>{
                    return <li  className="py-2 is-title result-item list-group-item list-group-item-action"
                                onClick={() => {handleClick(pokemon.id)}}
                                data-bs-toggle="offcanvas" data-bs-target={"#offcanvasRight"} aria-controls="offcanvasRight"
                                key={pokemon.id}>{pokemon.name}</li>
                })}
            </ul>
            
        </div>
    </div>  
  }

  export default SearchBar;