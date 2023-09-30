import { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import { TypeBadge } from "../PokemonList";
import ThemeToggler from "../../themes/ThemeToggler";
import i18n from "../../i18n";
import './index.css'
import { useTranslation } from "react-i18next";
import { fetchPokemonColors, fetchPokemonTypes, fecthPokemonsByType, fecthPokemonsByColor } from "../../services/fetchPokemonApi";

function toggleSize() {
    var x = document.getElementById("offcanvasFilters");
    x?.classList.toggle("full-size")

}



function OptionsMenu() {

    useEffect(() => {
        var myOffcanvas = document.getElementById('myOffcanvas')
        myOffcanvas?.addEventListener('hide.bs.offcanvas', function () {
            document.getElementById("offcanvasFilters")?.classList.remove("full-size")
        })
    }, [])

    const [t] = useTranslation("global");
    return (
        <div>
            <div className="d-flex gap-2 justify-content-end">
                <LanguageSelector />
                <ThemeToggler />
                <span  className="filter-button theme-icon" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters"></span>
                <OrderElements ></OrderElements>
            </div>
            <div className="offcanvas offcanvas-bottom"   onClick={() => { toggleSize() }} tabIndex={-1} id="offcanvasFilters" aria-labelledby="offcanvasBottomLabel">
                <div className="enlarger"></div>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasBottomLabel">{t("filters.title")}</h5>
                    <button type="button" className="btn-close text-reset theme-icon" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
                    <p>{t("filters.description")}</p>
                    <TypesFilter />
                    <Colors />
                    <HeightsFilter />
                    <WeightsFilter />
                    <NumberRangeFilter />
                </div>
            </div>

        </div>
    )
}

function LanguageSelector() {
    return <div>
        {i18n.language === 'es' ? <button type="button" className="btn-language theme-icon" onClick={() => { i18n.changeLanguage('en') }}>ES</button> :
            <button type="button" className="btn-language theme-icon" onClick={() => { i18n.changeLanguage('es') }}>EN</button>}
    </div>
}


const ALL_FILLTER = "all";

function TypesFilter() {
    const [types, setTypes] = useState([{ name: "", url: "" }]);
    const [isLoading, setIsLoading] = useState(false);
    const { setPokemonFetchedList, setSiguientePagina, pokemonFetchedList } = useContext(DataContext);
    const [t] = useTranslation("global");
    const [localState, setLocalState] = useState(pokemonFetchedList);
    const cargaIinicial = useRef(false);
    const [type, setType] = useState(ALL_FILLTER);

    useEffect(() => {
        //Almacenamos la lista en el orden inicial, antes de aplicar filtros
        if (!cargaIinicial.current || localState.length === 0) {
            setLocalState([...pokemonFetchedList]);
            cargaIinicial.current = true           
        }
    }, [pokemonFetchedList]);

    const handleTypeFilter = (type: string) => {        
        setType(type);                //fecthFilteredPokemons(url);
    }

    useEffect(() => {
        setSiguientePagina(0)
        if (type === ALL_FILLTER) {

            setPokemonFetchedList(localState);
        } else {
            fecthPokemonsByType(type).then(data => {
                setPokemonFetchedList(data);
            }).catch(() => {
                throw new Error(t("errors.fetch-types"));
            })
        }
    }, [type])

    useEffect(() => {
        setIsLoading(true);
        fetchPokemonTypes().then(data => {
            setTypes(data);
        }).catch(() => {
            throw new Error(t("errors.fetch-types"));
        }).finally(() => {
            setIsLoading(false);
            
        });
    }, [])

    if (isLoading) {
        return <div>{t("general.loading")}</div>
    }

    return <div>
        <h6>Types</h6>
        <div className="filter-option d-flex overflow-auto mt-4">
            <button className="all-button" onClick={() => { handleTypeFilter(ALL_FILLTER) }}
                data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters">{t("filters.all")}</button>
            {types.map((type, index) =>
                <div className="fiter-item mx-2"
                    key={index}
                    data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters"
                    onClick={() => handleTypeFilter(type.name)}
                ><TypeBadge name={type.name}></TypeBadge></div>
            )}
        </div>
    </div >
}

function Colors() {

    const [colors, setColors] = useState([{ name: "", url: "" }]);
    const [isLoading, setIsLoading] = useState(false);
    const { setSiguientePagina, setPokemonFetchedList, pokemonFetchedList } = useContext(DataContext);
    const [localState, setLocalState] = useState(pokemonFetchedList);
    const cargaIinicial = useRef(false);
    const [t] = useTranslation("global");
    const [color, setColor] = useState(ALL_FILLTER);


    useEffect(() => {
        //actualizar el estado local, si es carga inicial, o si el filtro cambia la carga inicial
        if (!cargaIinicial.current || localState.length === 0) {
            setLocalState([...pokemonFetchedList]);
            cargaIinicial.current = true
        }
    }, [pokemonFetchedList]); // Asegúrate de usar globalState como dependencia
    const handleTypeColor = (color: string) => {
        setColor(color);
    }

    useEffect(() => {
        if (color === ALL_FILLTER) {
            setSiguientePagina(0)
            setPokemonFetchedList(localState);
        } else {
            fecthPokemonsByColor(color).then(data => {
                setSiguientePagina(0)
                setPokemonFetchedList(data);
            }).catch(() => {
                throw new Error(t("errors.fetch-colors"));
            })
        }

    }, [color])

    useEffect(() => {
        setIsLoading(true);
        fetchPokemonColors().then(data => {
            setColors(data);
        }).catch(() => {
            throw new Error(t("errors.fetch-colors"))
        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return <div className="mt-3">
        <h6>Colors</h6>
        <div className="filter-option d-flex overflow-auto mt-4">
            <button className="all-button" onClick={() => { handleTypeColor(ALL_FILLTER) }}
                data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters">All</button>
            {colors.map((color, index) =>
                <div className="fiter-item mx-2"
                    key={index}
                    data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters" aria-controls="offcanvasFilters"
                    onClick={() => handleTypeColor(color.url)}
                ><button type="button" className={`color-button ${color.name} is-title`}>{t(`colors.${color.name ? color.name : "default"}`)}</button></div>
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



export default OptionsMenu;