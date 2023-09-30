import { useState, createContext } from "react";

type Pokemon = {
    name: string;
    url: string;
}

interface ContextValue {
    selectedPokemon: number;
    onSelectedPokemonChange: (id: number) => void;
    pokemonFetchedList: Pokemon[];
    setPokemonFetchedList: (list: Pokemon[]) => void;
    siguientePagina: number;
    setSiguientePagina: (page: number) => void;
}
export const DataContext = createContext({} as ContextValue);

export const DataProvider = ({ children }: { children: JSX.Element }) => {

    const [selectedPokemon, setSelectedPokemon] = useState(0);
    const [pokemonFetchedList, setPokemonFetchedList] = useState<Pokemon[]>([]);
    const [siguientePagina, setSiguientePagina] = useState(0);
    const onSelectedPokemonChange = (pokemonId: number) => {
        setSelectedPokemon(pokemonId);
    };

    const contextValue = {
        selectedPokemon,
        onSelectedPokemonChange: onSelectedPokemonChange,
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