import { useState, useEffect, useContext } from "react";
import { Pokedex } from "../../util/types";
import { TypeBadge } from "../PokemonList";
import "./index.css";
import Loader from "../../util/Loader";
import PokemonEvolution from "../PokemonEvolution";
import { DataContext } from "../../context/DataContext";



const DetailedPokemon = () => {
    const {selectedPokemon} = useContext(DataContext);

    const [detallePokemon, setDetallePokemon] = useState<Pokedex>();
    const [isLoading, setisLoading] = useState(false);
    useEffect(() => {

        const fetchPokemon = async () => {
            setisLoading(true)
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
            const data = await response.json();
            //obtener informacíon de la especie
            const species = await fetch(data.species.url);
            const data2 = await species.json();

            data.species = { ...data.species, ...data2 }
            setDetallePokemon(data)
            if (data) {
                setisLoading(false)
            }


        }
        if (selectedPokemon !== 0) {
            fetchPokemon();

        }
    }, [selectedPokemon])

    //añadir evento al offcanvas cuando se cierra
    useEffect(() => {
           
            var myOffcanvas = document.getElementById('offcanvasRight')
            myOffcanvas?.addEventListener('hide.bs.offcanvas', function () {
                const a = document.querySelector("#myTab #home-tab") as HTMLButtonElement
                a.click()
            })

            return () => {
                myOffcanvas?.removeEventListener('hide.bs.offcanvas', function () {
                    return
                });
            }

    }, [])

    function numberToPokeString(number: number = 0) {
        return "#" + ("0000" + number).slice(-5);
    }


    return (


        <div className="pokemon-detail">

            <div className={`offcanvas offcanvas-end ${detallePokemon?.types[0].type.name} ${detallePokemon ? "show" : "hide"} ${isLoading ? "loading" : ""}`}
                tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">

                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    <h5 id="offcanvasRightLabel">Details</h5>

                </div>
                {isLoading ? <Loader className="pokemon-loader" /> : ""}
                <div className="offcanvas-body p-0">

                    <div className="pokemon-header d-flex">
                        <div className='pokemon-name-bg'>
                            <p>{detallePokemon?.name}</p>
                            <div className={`gradient`}
                                style={{ background: `linear-gradient(0deg, var(--${detallePokemon?.types[0].type.name}-color) 46%, rgba(45,253,189,0) 100%)` }}
                            >

                            </div>
                        </div>
                        <div className="pokemon-image w-50">
                            {isLoading ? <Loader /> : <img src={detallePokemon?.sprites.other?.["official-artwork"].front_default} ></img>}
                            di</div>
                        <div className="pokemon-info w-50">
                            <p>{numberToPokeString(detallePokemon?.id)}</p>
                            <h2 className="is-title">{detallePokemon?.name}</h2>
                            <div className="types">
                                {detallePokemon?.types.map((type, index) => {
                                    return <TypeBadge key={index} name={type.type.name} />
                                })}
                            </div>
                        </div>
                    </div>


                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">About</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Stats</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Evolutions</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <PokeAbout detallePokemon={detallePokemon} />

                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div className="stats">
                                <div className="pokedex-stats">
                                    <BaseStats stats={detallePokemon?.stats ?? []} type={detallePokemon?.types[0].type.name}></BaseStats>
                                </div>
                                <div className="pokedex-training">
                                    <TypeDefences types={detallePokemon?.types ?? []}></TypeDefences>
                                </div>

                            </div>
                        </div>
                        <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            <div className="evolution">
                                <h6>Evolution Chain</h6>
                                <PokemonEvolution url={detallePokemon?.species.url}></PokemonEvolution>

                            </div>
                        </div>
                    </div>

                </div>
            </div>



        </div>
    )
}

function kgToLbs(kg: number) {
    return (kg * 2.20462).toFixed(1);
}
const PokeAbout = ({ detallePokemon }: { detallePokemon: Pokedex | undefined }) => {

    return <div className="about">
        <p>{detallePokemon?.species?.flavor_text_entries.find((element) => element.language.name === "en")?.flavor_text.replace("\f"," ")}</p>
        <div className="pokedex-data">
            <h6>Pokedex Data</h6>
            <p><span className="property-title">Height: </span><span className="property-value">{(detallePokemon?.height)?`${(detallePokemon?.height/10).toFixed(1)}m`:0}</span></p>
            <p><span className="property-title">Weight: </span><span className="property-value">{(detallePokemon?.weight)?`${(detallePokemon?.weight/10).toFixed(1)}kg (${kgToLbs(detallePokemon?.weight/10)}lbs) `:0}</span></p>
        </div>
        <div className="pokedex-training">
            <h6>Pokedex Training</h6>

            <p><span className="property-title">Capture Rate: </span> <span className="property-value">{detallePokemon?.species?.capture_rate}</span></p>
            <p><span className="property-title">Base Happines: </span><span className="property-value">{detallePokemon?.species?.base_happiness}</span></p>
            <p><span className="property-title">Base Exp: </span>     <span className="property-value">{detallePokemon?.base_experience}</span></p>
            <p><span className="property-title">Growth Rate: </span>  <span className="property-value">{detallePokemon?.species?.growth_rate.name}</span></p>
        </div>

    </div>

}

const BaseStats = ({ stats, type }: { stats: (Pokedex["stats"] | undefined), type: string | undefined }) => {
    if (!stats || !type) {
        return <><Loader></Loader></>
    }
    return <div className="base-stats">
        <h6>Base Stats</h6>
        <BaseStatItem type={type} nombre="HP" valor={stats[0].base_stat}></BaseStatItem>
        <BaseStatItem type={type} nombre="Attack" valor={stats[1].base_stat}></BaseStatItem>
        <BaseStatItem type={type} nombre="Defense" valor={stats[2].base_stat}></BaseStatItem>
        <BaseStatItem type={type} nombre="Sp. Atk" valor={stats[3].base_stat}></BaseStatItem>
        <BaseStatItem type={type} nombre="Sp. Def" valor={stats[4].base_stat}></BaseStatItem>
        <BaseStatItem type={type} nombre="Speed" valor={stats[5].base_stat}></BaseStatItem>


    </div>
}

const BaseStatItem = ({ type, nombre, valor }: { type: string, nombre: string, valor: number }) => {
    return (
        <div className="row">
            <div className="col-4">
                <p><span className="property-title">{nombre} </span><span className="property-value">{valor}</span></p>
            </div>
            <div className="col-8">
                <div className="progress">
                    <div className={`progress-bar ${type}`} role="progressbar" style={{ width: `${valor / 255 * 100}%` }}
                        aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
            </div>
        </div>
    )

}

const TypeDefences = ({ types }: { types: Pokedex["types"] }) => {

    return <div className="type-defences">
        <h6>Type Defences</h6>
        {types.map((typeProp, index) => {
            return <div className={`type-defenses-${typeProp.type.name}`} key={index}>
                <DamageRelations type={typeProp.type} ></DamageRelations>
            </div>
        })}
    </div>
}

const DamageRelations = ({ type }: { type: Pokedex["species"] }) => {
    const [damageRelations, setDamageRelations] = useState<any>();
    useEffect(() => {
        const fetchDamageRelations = async () => {
            const response = await fetch(type.url);
            const data = await response.json();
            setDamageRelations(data.damage_relations);
        }

        fetchDamageRelations();
    }, [])

    if (!damageRelations) {
        return <div>no data</div>
    }
    return <div className="damage-relations">
        <h6 className="mt-3">{type.name}</h6>
        <div className="double-damage-from">
            <p>Double Damage From</p>
            <div className="d-flex">
                {damageRelations["double_damage_from"].map((typeProp: Pokedex["species"], index: number) => {
                    return <div title={typeProp.name} className={`type-${typeProp.name} mx-1`} key={index}><span className="icon"></span></div>
                })}
            </div>
        </div>

        <div className="double-damage-to">
            <p>Double Damage To</p>
            <div className="d-flex">
                {damageRelations["double_damage_to"].map((typeProp: Pokedex["species"], index: number) => {
                    return <div title={typeProp.name} className={`type-${typeProp.name} mx-1`} key={index}><span className="icon"></span></div>
                })}
            </div>
        </div>
    </div >
}
export default DetailedPokemon;