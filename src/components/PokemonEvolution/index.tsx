import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import './index.css'
import { useTranslation } from 'react-i18next';
import { fetchPokemonChain, fetchPokemonEvolution } from '../../services/fetchPokemonApi';



interface EvolutionChainNode {
    species: {
        name: string;
        url: string
    };
    evolution_details: any[]
    evolves_to: EvolutionChainNode[];
    id: number
    url: string
}

function PokemonEvolution({ url = "" }: { url: string }): JSX.Element {

    //const evolutionNull: EvolutionChainNode = { species: { name: "", url: "" }, evolves_to: [], evolution_details: [] };
    const [evolutionChain, setEvolutionChain] = useState({} as EvolutionChainNode);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [t] = useTranslation("global");
 


 

    useEffect(() => {
        
            setLoading(true);
            if (url !== "" ) {
                fetchPokemonEvolution(url)
                    .then((data) => {
                        setEvolutionChain( data.chain);
                    }).catch((error) => {
                        setError(error);
                    }).finally(() => {
                        setLoading(false);
                          
                    })
            }

    }, [url]);




    if (loading) {
        return <p>{t("general.loading")}</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <h6>{t("evolutions.evolution-chain")}</h6>
            <Evolutions chain={evolutionChain}></Evolutions>
        </div>
    );
}

const Evolutions = ({ chain }: { chain: EvolutionChainNode }) => {

    const pokemonEvolutions: { name: string, url: string, min_level: number }[] = [];
    let nivel = 0
    const traverseChain = (node: EvolutionChainNode) => {
        pokemonEvolutions.push({ ...node.species, min_level: nivel })
        for (let i = 0; i < node.evolves_to.length; i++) {
            const nextNode = node.evolves_to[i];
            traverseChain(nextNode);
        }
        if (node.evolves_to.length === 0) {
            nivel++
        }
    };
    traverseChain({ ...chain });

    const [ids, setIds] = useState<number[]>([]);
    const [pokemonData, setPokemonData] = useState([{ sprite: "", id: 0 }]);
    const [loading, setLoading] = useState<boolean>(true);
    const { onSelectedPokemonChange: handleSelectedPokemonChange } = useContext(DataContext);
    const [t] = useTranslation("global")


    useEffect(() => {
        setIds(pokemonEvolutions.map(item => extractUrlLastDigit(item.url)));
    }, [chain]);

    useEffect(() => {

        setLoading(true);
        fetchPokemonChain(ids).then(data => {
            setPokemonData(data);
        }).catch(() => {
            throw new Error(t("errors.fetch-pokemon"));
        }).finally(() => {
            setLoading(false);
        })
    }, [ids]);


    return (
        <div className={`evolution-chain ${loading ? t("general.loading") : ""}`}>

            {!loading ? pokemonData.map((pokemon, index) => (
                <div key={index}
                    onClick={() => handleSelectedPokemonChange(pokemon.id)}
                    className='evolution-item'>

                    <img
                        src={pokemon.sprite}
                        alt={`Pokemon ${ids[index]}`}

                    />
                    <p className='is-title'>{pokemonEvolutions[index]?.name}</p>
                    <p className='is-title level'>{pokemonEvolutions[index]?.min_level ? t("evolutions.alternative") : ""}</p>
                    {(index !== pokemonData.length - 1 && (index + 1) % 3 !== 0) ? <span className='arrow'></span> : ""}

                </div>
            )) : t("general.loading")}

        </div>
    );
};


function extractUrlLastDigit(url: string) {
    // Divide la cadena por "/" y toma la última parte
    const parts = url.split("/");
    const lastPart = parts[parts.length - 2]; // El último segmento antes de la barra final

    // Convierte la última parte a un número
    const lastDigit = parseInt(lastPart, 10);

    return lastDigit;
}

export default PokemonEvolution;