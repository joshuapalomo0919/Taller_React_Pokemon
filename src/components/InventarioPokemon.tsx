import React from 'react';
import { usePokemon } from '../context/PokemonContext';

export const InventarioPokemon : React.FC = () => {

    const { entrenadorActivo, eliminarPokemon, actualizarPokemon, mochilaActual } = usePokemon();


     if(!entrenadorActivo) {
        return (
            <div>
                <h3> NO HAY ENTRENADORES </h3>
                <p>Por favor asigne un <strong>entrenador activo</strong> o registre un entrenador.</p>
            </div>
        );}


    return (
        <div className='banner-sesion'>
                <header>
                    <h2> Mochila de { entrenadorActivo.nombreCompleto}</h2>
                </header>
                <div className='grid-mochila'>
                    {mochilaActual.length === 0 ? (
                      <p>La mochila está vacía.</p>
                    ) : (
                      mochilaActual.map((poke, index) => (
                        <div key={poke.id} className={`tarjeta-item ${poke.esFavorito ? 'tarjeta-favorita' : ''}`}>
                          <span>
                            #{index + 1} de {mochilaActual.length}
                          </span>

                          <img src={poke.image} alt={poke.name} />
                          <h4>{poke.name}</h4>
                          <p>Tipo: {poke.type}</p>
                          
                          <div className='panel-botones'>
                            <button type='button' className={`btn-fav ${poke.esFavorito ? 'fav-activo' : ''}`} 
                            onClick={() => actualizarPokemon(poke.id)}>
                              {poke.esFavorito ? 'Favorito' : 'Marcar favorito'}
                            </button>

                            <button type='button' className='btn-eliminar' 
                            onClick={() => eliminarPokemon(poke.id)}>
                              liberar o soltar
                            </button>
                          </div>

                        </div>
                      ))
                    )}
                </div>
        </div>

    );
};