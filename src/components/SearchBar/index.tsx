import { pokemonAPI } from "../../util/pokemonAPI";
import {useState, useContext} from 'react';
import './index.css';
import { DataContext } from "../../context/DataContext";

interface  Pokemon{
    name: string;
    id:  number;
    
}


function numberToPokeString(number: number = 0) {
    return ("0000" + number).slice(-5);
}
const SearchBar = () => {
    //const [resultados, setResultados] = useState();
    const {handleSelectedPokemonChange} = useContext(DataContext);
    const [valorBuscado, setValorBuscado] = useState("");
    const handleChange = (valor : string) =>{
        setValorBuscado(valor)

    }

    const handleClick = (id: number) =>{
        
        //limpiar el input de busqueda
        setValorBuscado("")
        handleSelectedPokemonChange(id)
    }

    let datosFiltrados = [];
    if(valorBuscado != ""){
         datosFiltrados = pokemonAPI.results.filter((pokemon: Pokemon)=>{
         return (pokemon.name.toLowerCase()+pokemon.id.toString()).includes(valorBuscado.toLowerCase())
     })
    }
    
    return <div className="search-bar form-outline">
        <span className="search-icon theme-icon"></span>
        <input type="search" onChange={(e)=>{handleChange(e.target.value)}}
                className="input-search focus-ring focus-ring-dark" placeholder="What Pokemon are you looking for?"
                value={valorBuscado}/>
        <div className={'search-results container ' + (valorBuscado != "" ? "show" : "hide")}>
            <ul className="list-group ">
                {datosFiltrados.map((pokemon: Pokemon)=>{
                    return <li  className="py-2  result-item list-group-item list-group-item-action"
                                onClick={() => {handleClick(pokemon.id)}}
                                data-bs-toggle="offcanvas" data-bs-target={"#offcanvasRight"} aria-controls="offcanvasRight"
                                key={pokemon.id}>{numberToPokeString(pokemon.id)} - <span className="is-title">{pokemon.name}</span></li>
                })}
            </ul>
            
        </div>
    </div>  
  }

  export default SearchBar;