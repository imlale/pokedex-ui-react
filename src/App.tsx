import PokemonList from "./components/PokemonList";
import DetailedPokemon from "./components/DetailedPokemon";
import SearchBar from "./components/SearchBar";
import "./assets/bootstrap/css/bootstrap.min.css";
import './assets/bootstrap/js/bootstrap.bundle.min.js';
import ScrollToTopButton from "./util/ScrollToTopButton";
import Filters from "./components/Filters/";
import { DataProvider } from "./context/DataContext.js";



function App(): JSX.Element {

  return (
    <DataProvider>
      
    <div className="container">
      <header >
        <div className="row options float-end">
          <Filters />
        </div>
        <div className="row">
          <div className="col">
            <div className="main-title">
              <h1>Pokédex</h1>
            </div>
            {<SearchBar/>}
          </div>
        </div>
      </header>
      <aside>
        {<DetailedPokemon />}
      </aside>
      <main >
       { <PokemonList />}

      </main>
      <ScrollToTopButton></ScrollToTopButton>
    </div>
    </DataProvider>
  )
}






export default App
