import PokemonList from "./components/PokemonList";
import DetailedPokemon from "./components/DetailedPokemon";
import SearchBar from "./components/SearchBar";
import "./assets/bootstrap/css/bootstrap.min.css";
import './assets/bootstrap/js/bootstrap.bundle.min.js';
import { useState } from "react";


function App(): JSX.Element {

  const [selectedPokemon, setSelectedPokemon] = useState(0);

  const handleSelectedPokemonChange = (pokemonId: number) => {
    setSelectedPokemon(pokemonId);
    
  };
  return (
    <>
      <header >
        <div className="row">
          <div className="col">
            <div className="main-title">
              <h1>Pokédex</h1>
            </div>
            <SearchBar onSelectedPokemonChange={handleSelectedPokemonChange} />
          </div>
        </div>
      </header>
      <aside>
        <DetailedPokemon id={selectedPokemon}  />
      </aside>
      <main >
        <PokemonList onSelectedPokemonChange={handleSelectedPokemonChange} />
      </main>
    </>
  )
}






export default App
