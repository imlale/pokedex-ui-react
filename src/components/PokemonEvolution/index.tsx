import { useState, useEffect } from 'react';
import './index.css'


interface EvolutionChainNode {
    species: {
        name: string;
        url: string       
    };
    evolution_details: any[]
    evolves_to: EvolutionChainNode[];
}


function PokemonEvolution({ id }: { id: number | undefined }): JSX.Element {
    const evolutionNull: EvolutionChainNode = { species: { name: "", url: "" }, evolves_to: [], evolution_details: []};
    const [evolutionChain, setEvolutionChain] = useState(evolutionNull);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPokemonEvolution = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener la cadena evolutiva.');
                }
                const data = await response.json();

                const evolutionResponse = await fetch(data.evolution_chain.url);
                if (!evolutionResponse.ok) {
                    throw new Error('No se pudo obtener la cadena evolutiva.');
                }
                const evolutionData = await evolutionResponse.json();

                setEvolutionChain(evolutionData.chain);
                if(evolutionChain){
                    setLoading(false);
                }
            } catch (error: any) {
                setError(error);
                setLoading(false);
            }
        };

        id ? fetchPokemonEvolution() : "";
    }, [id]);


    if (loading) {

        return <p>Cargando... {id}</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }



    return (
        <div>
            <Evolutitons chain={evolutionChain}></Evolutitons>
        </div>
    );
}

const Evolutitons = ({ chain }: { chain: EvolutionChainNode }) => {
    const evolution: {name: string, url: string, min_level: number}[] = [];

    const traverseChain = (node: EvolutionChainNode) => {
        
        evolution.push({...node.species, min_level: node.evolution_details[0]?.min_level});
        if (node.evolves_to.length > 0) {
            traverseChain(node.evolves_to[0]);
        }
    };
    
    traverseChain({...chain});

    const ids = evolution.map(item => extractUrlLastDigit(item.url));


    const [pokemonData, setPokemonData] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        let results: string[] = [];
        setLoading(true);
        const fetchData = async () => {
            const promises = ids.map(async (id) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del Pokémon.');
                }
                const data = await response.json();
                if(data){
                    console.log("hace Fetch")
                }
                return data.sprites.front_default;
            });

            try {
                results = await Promise.all(promises);
                if (results) {
                    setPokemonData(results);
                    setLoading(false);
                }

            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [chain]);


    return (
        <div className={`evolution-chain ${loading ? "loading" : ""}`}>

            {!loading ? pokemonData.map((sprite, index) => (
                <div key={index} className='evolution-item'>
                    
                    <img
                        src={sprite}
                        alt={`Pokemon ${ids[index]}`}

                    />
                    <p className='is-title'>{evolution[index]?.name}</p>
                    <p className='is-title level'>{evolution[index]?.min_level?"Level "+evolution[index].min_level:""}</p>
                    {index!==pokemonData.length-1 &&<span className='arrow'></span>}
                    
                </div>
            )) : "Loading..."}

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