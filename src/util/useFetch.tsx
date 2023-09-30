import { useEffect, useState } from 'react';

export const useFetch = (url: string) => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Puedes manejar el error de acuerdo a tus necesidades
      }
    };

    fetchData();
  }, []);

  return data;
};

/*let [detallePokemon, setDetallePokemon] = useState<Pokedex>();
    const { data: pokemonData } = useFetch("https://pokeapi.co/api/v2/pokemon/650");

    if(pokemonData){
        const { data: specisData } = useFetch(pokemonData.species.url);
        setDetallePokemon({...pokemonData, ...specisData})
    }*/