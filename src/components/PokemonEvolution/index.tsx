import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import './index.css'


interface EvolutionChainNode {
    species: {
        name: string;
        url: string       
    };
    evolution_details: any[]
    evolves_to: EvolutionChainNode[];
}


function PokemonEvolution({ url }: { url: string | undefined }): JSX.Element {
    const evolutionNull: EvolutionChainNode = { species: { name: "", url: "" }, evolves_to: [], evolution_details: []};
    const [evolutionChain, setEvolutionChain] = useState(evolutionNull);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);


    useEffect(() => {       
        const fetchPokemonEvolution = async () => {
            try {
                const response = await fetch(`${url}`);
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

        url ? fetchPokemonEvolution() : "";
    }, [url]);


    if (loading) {

        return <p>Cargando...</p>;
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
    let nivel = 0 
    const traverseChain = (node: EvolutionChainNode) => {    
        
        evolution.push({...node.species, min_level: nivel})//node.evolution_details[0]?.min_level});

        for (let i = 0; i < node.evolves_to.length; i++) {
            const nextNode = node.evolves_to[i];            
            traverseChain(nextNode); 
        }
        if(node.evolves_to.length === 0){
            nivel++
        }
        
        
    };
    
    traverseChain({...chain});

    const ids = evolution.map(item => extractUrlLastDigit(item.url));


    const [pokemonData, setPokemonData] = useState([{sprite: "", id: 0}]);
    const [loading, setLoading] = useState<boolean>(true);
    const {handleSelectedPokemonChange} = useContext(DataContext);


    useEffect(() => {
        let results: {sprite: string, id: number}[] = [] ;
        setLoading(true);
        const fetchData = async () => {
            const promises = ids.map(async (id) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}/`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del Pokémon.');
                }
                const data = await response.json();                
                return {sprite: data.sprites.front_default, id: data.id};
            });

            try {
                results = await Promise.all(promises);
                if (results) {
                    setPokemonData(results);
                    setLoading(false);
                }

            } catch (error) {      
                setLoading(false);
            }
        };

        fetchData();
    }, [chain]);


    return (
        <div className={`evolution-chain ${loading ? "loading" : ""}`}>

            {!loading ? pokemonData.map((pokemon, index) => (
                <div key={index}
                    onClick={()=>handleSelectedPokemonChange(pokemon.id)}
                    className='evolution-item'>
                    
                    <img
                        src={pokemon.sprite}
                        alt={`Pokemon ${ids[index]}`}

                    />
                    <p className='is-title'>{evolution[index]?.name}</p>
                    <p className='is-title level'>{evolution[index]?.min_level?"Alternative"/*+evolution[index].min_level*/:""}</p>
                    {(index!==pokemonData.length-1 && (index+1) % 3 !== 0)?<span className='arrow'></span>:""}
                    
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