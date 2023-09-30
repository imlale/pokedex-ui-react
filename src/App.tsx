import PokemonList from "./components/PokemonList";
import DetailedPokemon from "./components/DetailedPokemon";
import SearchBar from "./components/SearchBar";
import "./assets/bootstrap/css/bootstrap.min.css";
import './assets/bootstrap/js/bootstrap.bundle.min.js';
import ScrollToTopButton from "./util/ScrollToTopButton";
import OptionsMenu from "./components/OptionsMenu/index.js";
import { DataProvider } from "./context/DataContext.js";
import './App.css';
import './themes/themes.css'




function App(): JSX.Element {


  return (
    <DataProvider>
      <div className="container">
        <Header />
        <aside>
          <DetailedPokemon />
        </aside>
        <main >
          <PokemonList />
        </main>
        <ScrollToTopButton></ScrollToTopButton>
      </div>
    </DataProvider>

  )
}

function Header() {
  return (
    <header >
      <nav >
        <OptionsMenu />
      </nav>
      <div className="header-content">
        <div className="main-title">
          <h1>Pokédex</h1>
        </div>
        <SearchBar />

      </div>
    </header>
  )
}





export default App
