import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { PokemonProvider } from './context/PokemonContext';
import { RegistroPokemon } from './components/RegistroUsuario';
import { BuscadorPokemon } from './components/BuscadorPokemon';
import { InventarioPokemon } from './components/InventarioPokemon';

function App() {
  return (
    <PokemonProvider>
      <BrowserRouter>
        <header>
          <h1>Bienvenido al Portal Pokemon de entrenadores en react</h1>
          <nav>
            <NavLink to="/registro" className={({ isActive }) => (isActive ? 'active-tab' : '')}> Registro</NavLink>
            <NavLink to="/buscador" className={({ isActive }) => (isActive ? 'active-tab' : '')}> Buscar</NavLink>
            <NavLink to="/inventario" className={({ isActive }) => (isActive ? 'active-tab' : '')}> Inventario</NavLink>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/registro" replace />} />
            <Route path="/registro" element={<RegistroPokemon />} />
            <Route path="/buscador" element={<BuscadorPokemon />} />
            <Route path="/inventario" element={<InventarioPokemon />} />
          </Routes>
        </main>
      </BrowserRouter>
    </PokemonProvider>
  );
}

export default App;