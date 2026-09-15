import {BrowserRouter, Routes, Route, NavLink, Navigate} from 'react-router-dom';
import { pokemonProvider } from './context/pokemonContext';
import { registroPokemon } from './components/RegistroUsuario';
import { buscarPokemon } from './components/BuscarPokemon';
import { inventarioPokemon } from './components/InventarioPokemon';

function App() {
  return (
    <pokemonProvider>
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
            <Route path="/buscador" element={<buscarPokemon />} />
            <Route path="/inventario" element={<inventarioPokemon />} />
          </Routes>
        </main>

      </BrowserRouter>
    </pokemonProvider>
 
  );
}

export default App;