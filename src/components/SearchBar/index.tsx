import { pokemonAPI } from "../../util/pokemonAPI";
import {useState, useContext} from 'react';
import './index.css';
import { DataContext } from "../../context/DataContext";
import {useTranslation} from 'react-i18next';

interface  Pokemon{
    name: string;
    id:  number;    
}


function numberToPokeString(number: number = 0) {
    return ("0000" + number).slice(-5);
}
const SearchBar = () => {
    const {onSelectedPokemonChange: handleSelectedPokemonChange} = useContext(DataContext);
    const [valorBuscado, setValorBuscado] = useState("");
    const [t] = useTranslation("global")
    const handleInputChange = (valor : string) =>{
        setValorBuscado(valor)
    }

    const handleResultClick = (id: number) =>{       
        
        setValorBuscado("")//limpiar el input de busqueda
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
        <input type="search" onChange={(e)=>{handleInputChange(e.target.value)}}
                className="input-search focus-ring focus-ring-dark" placeholder={t("search.placeholder")}
                value={valorBuscado}/>
        <div className={'search-results container ' + (valorBuscado != "" ? "show" : "hide")}>
            <ul className="list-group ">
                {datosFiltrados.map((pokemon: Pokemon)=>{
                    return <li  className="py-2  result-item list-group-item list-group-item-action"
                                onClick={() => {handleResultClick(pokemon.id)}}
                                data-bs-toggle="offcanvas" data-bs-target={"#offcanvasRight"} aria-controls="offcanvasRight"
                                key={pokemon.id}>{numberToPokeString(pokemon.id)} - <span className="is-title">{pokemon.name}</span></li>
                })}
            </ul>
            
        </div>
    </div>  
  }

  export default SearchBar;