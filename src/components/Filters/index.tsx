import { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import { Pokemon } from "../../util/types";
import { TypeBadge } from "../PokemonList";
import ThemeToggler from "../../themes/ThemeToggler";
import './index.css'

function toggleSize() {
    var x = document.getElementById("offcanvasFilters");
    x?.classList.toggle("full-size")
}



function Filters() {


    return (
        <div>
            <div className="d-flex gap-2">
                <ThemeToggler></ThemeToggler>
                <span className="filter-button theme-icon" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters"></span>
                <OrderElements ></OrderElements>
            </div>
            <div className="offcanvas offcanvas-bottom" onClick={() => { toggleSize() }} tabIndex={-1} id="offcanvasFilters" aria-labelledby="offcanvasBottomLabel">
                <div className="enlarger"></div>
                <div className="offcanvas-header" >
                    <h5 className="offcanvas-title" id="offcanvasBottomLabel">Filters</h5>
                    <button type="button" className="btn-close text-reset theme-icon" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
                    <p>Use advanced search to explore Pokémon by type, weakness, height and more!</p>
                    <TypesFilter  />
                    <Colors />
                    <HeightsFilter />
                    <WeightsFilter />
                    <NumberRangeFilter />
                </div>
            </div>

        </div>
    )
}

interface PokemonFilter {
    pokemon: Pokemon
    pokemon_species: Pokemon
}

function TypesFilter() {
    const [types, setTypes] = useState([{ name: "", url: "" }]);
    const [isLoading, setIsLoading] = useState(false);
    const { setPokemonFetchedList, setSiguientePagina } = useContext(DataContext);

    const {pokemonFetchedList} = useContext(DataContext);
    const [localState, setLocalState] = useState(pokemonFetchedList);
    const cargaIinicial = useRef(false);

       // Esto es solo un ejemplo de cómo el componente modifica globalState
    useEffect(() => {
        //actualizar el estado local, si es carga inicial, o si el filtro cambia la carga inicial
        if (!cargaIinicial.current || localState.length === 0 ) {
            setLocalState([...pokemonFetchedList]);

            cargaIinicial.current = true
        }
    }, [pokemonFetchedList]); // Asegúrate de usar globalState como dependencia

    const handleTypeFilter = (url: string) => {

        if(url ==="all"){
            setSiguientePagina(0)
            setPokemonFetchedList(localState);
            return;
        }
        fecthFilteredPokemons(url);
    }

    const fecthFilteredPokemons = async (url: string) => {

        const response = await fetch(url);
        const data = await response.json();
        if (data) {

            const listaPokemonPorTypo: PokemonFilter[] = data.pokemon
            const resultadoMapeado:Pokemon[] = listaPokemonPorTypo.map((pokemon) => {
                return pokemon.pokemon
            })

            setSiguientePagina(0)
            setPokemonFetchedList(resultadoMapeado);
        }

    }

    useEffect(() => {

        async function fetchTypes() {
            setIsLoading(true);

            try {
                const response = await fetch("https://pokeapi.co/api/v2/type");
                if (!response.ok) {
                    throw new Error('Can\'t fetch types - Response.');

                }
                const data = await response.json();
                if (data) {
                    setIsLoading(false);
                    setTypes(data.results);
                }
            } catch (error: any) {
                setIsLoading(false);
                throw Error(error.message);

            }
        }

        fetchTypes();
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return <div>
        <h6>Types</h6>
        <div className="filter-option d-flex overflow-auto mt-4">
            <button className="all-button" onClick={()=>{handleTypeFilter("all")}}
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters">All</button>
            {types.map((type, index) =>
                <div className="fiter-item mx-2"
                    key={index}
                    data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters"
                    onClick={() => handleTypeFilter(type.url)}
                ><TypeBadge name={type.name}></TypeBadge></div>
            )}
        </div>
    </div >
}

function Colors() {
    ///https://pokeapi.co/api/v2/pokemon-color/
    const [colors, setColors] = useState([{ name: "", url: "" }]);
    const [isLoading, setIsLoading] = useState(false);
    const {setSiguientePagina, setPokemonFetchedList, pokemonFetchedList} = useContext(DataContext);
    const [localState, setLocalState] = useState(pokemonFetchedList);
    const cargaIinicial = useRef(false);

   
    useEffect(() => {
        //actualizar el estado local, si es carga inicial, o si el filtro cambia la carga inicial
        if (!cargaIinicial.current || localState.length === 0 ) {
            setLocalState([...pokemonFetchedList]);
            console.log(localState.length)
            cargaIinicial.current = true
        }
    }, [pokemonFetchedList]); // Asegúrate de usar globalState como dependencia
    const handleTypeColor = (url: string) => {

        if(url ==="all"){
            setSiguientePagina(0)
            setPokemonFetchedList(localState);
            return;
        }
        fecthFilteredPokemons(url);
    }

    const fecthFilteredPokemons = async (url: string) => {

        const response = await fetch(url);
        const data = await response.json();
        if (data) {
            console.log(data);
            const listaPokemonPorTypo = data.pokemon_species
            const resultadoMapeado= listaPokemonPorTypo.map((pokemon:Pokemon) => {                
                return {name: pokemon.name, url: pokemon.url.replace("-species", "")}
            })
            
            setSiguientePagina(0)
            setPokemonFetchedList([...resultadoMapeado]);
        }

    }

    useEffect(() => {

        async function fetchColors() {
            setIsLoading(true);

            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon-color/");
                if (!response.ok) {
                    throw new Error('Can\'t fetch Colors - Response.');

                }
                const data = await response.json();
                if (data) {
                    setIsLoading(false);
                    setColors(data.results);
                }
            } catch (error: any) {
                setIsLoading(false);
                throw Error(error.message);

            }
        }

        fetchColors();
    }, [])
    if (isLoading) {
        return <div>Loading...</div>
    }

    return <div>
        <h6>Colors</h6>
        <div className="filter-option d-flex overflow-auto mt-4">
            <button className="all-button" onClick={()=>{handleTypeColor("all")}}
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters">All</button>
            {colors.map((color, index) =>
                <div className="fiter-item mx-2"
                    key={index}
                    data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters"
                    onClick={() => handleTypeColor(color.url)}
                ><button type="button" className={`color-button ${color.name} is-title`} > {color.name}</button></div>
            )}
        </div>
    </div >
}
function HeightsFilter() {
    return <div>

    </div>
}
function WeightsFilter() {
    return <div>

    </div>
}

function NumberRangeFilter() {
    return <div>

    </div>
}


function OrderElements() {
    const [toggleOrder, setToggleOrder] = useState(0);
    


    const { setPokemonFetchedList, setSiguientePagina, pokemonFetchedList } = useContext(DataContext);
    // Usa useState para manejar un estado local en el componente

    const [localState, setLocalState] = useState(pokemonFetchedList);
    const cargaIinicial = useRef(false);

       // Esto es solo un ejemplo de cómo el componente modifica globalState
    useEffect(() => {
        //actualizar el estado local, si es carga inicial, o si el filtro cambia la carga inicial
        if (!cargaIinicial.current || localState.length === 0 ||
             (pokemonFetchedList.length !== localState.length && localState.length !== 0)) {
            setLocalState([...pokemonFetchedList]);
            console.log(localState.length)
            cargaIinicial.current = true
        }
    }, [pokemonFetchedList]); // Asegúrate de usar globalState como dependencia


    function handleOrderItems() {
        let newPokemonList = localState
        if (toggleOrder >= 2) {
            setToggleOrder(0)
        } else {
            newPokemonList = pokemonFetchedList.sort((a, b) => {
                if (toggleOrder === 0) return a.name.localeCompare(b.name)
                if (toggleOrder === 1) return b.name.localeCompare(a.name)
                return 1;
            })
            setToggleOrder(toggleOrder + 1)
        }
        setSiguientePagina(0)
        setPokemonFetchedList([...newPokemonList])
        document.querySelector(".sort-button")?.classList.toggle("invert")
    }

    return <div>
        <span className={`sort-button theme-icon`} onClick={() => handleOrderItems()}></span>
    </div>
}



export default Filters;