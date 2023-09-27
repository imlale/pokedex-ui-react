import { useState, createContext } from "react";
import { Pokemon } from "../util/types";

interface ContextValue {
    selectedPokemon: number;
    handleSelectedPokemonChange: (arg0: number) => void;
    pokemonFetchedList: Pokemon[];
    setPokemonFetchedList: (arg0: Pokemon[]) => void;
    siguientePagina: number;
    setSiguientePagina: (arg0: number) => void;
  }
  
  // Crea el contexto con el valor inicial
  const initialContextValue: ContextValue = {
    selectedPokemon: 42, // Ejemplo de valor numérico
    handleSelectedPokemonChange: (a:number) => {console.log(a); },
    pokemonFetchedList: [],
    setPokemonFetchedList: (pokemonFetchedList: Pokemon[]) => { return pokemonFetchedList},
    siguientePagina: 0, // Ejemplo de valor numérico
    setSiguientePagina: (a:number) => { console.log(a); },
  };

  export const DataContext = createContext(initialContextValue);

export const DataProvider = ({ children }: { children: JSX.Element }) => {

    const [selectedPokemon, setSelectedPokemon] = useState(0);
    const [pokemonFetchedList, setPokemonFetchedList] = useState<Pokemon[]>([]);
    const [siguientePagina, setSiguientePagina] = useState(0);

    const handleSelectedPokemonChange = (pokemonId: number) => {
        setSelectedPokemon(pokemonId);

    };

    const contextValue = {
        // Puedes agregar tus datos o funciones aquí
        selectedPokemon,
        handleSelectedPokemonChange,
        pokemonFetchedList,
         setPokemonFetchedList,
         siguientePagina,
         setSiguientePagina
    };
    return (
        <DataContext.Provider value={contextValue} >

            {children}
        </DataContext.Provider>
    )
}