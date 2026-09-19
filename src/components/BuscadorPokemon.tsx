import { useState } from 'react';
import { usePokemon, type PokemonTarjeta } from '../context/PokemonContext';

export const BuscadorPokemon: React.FC = () => {
    const { entrenadorActivo, guardarPokemonMochila } = usePokemon();
    const [busqueda, setBusqueda] = useState('');
    const [pokemonActual, setPokemonActual] = useState<PokemonTarjeta | null>(null);
    const [mensajeError, setMensajeError] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);

    const buscarPokemon = async (e: React.FormEvent) => {
        e.preventDefault();

        const query = busqueda.trim().toLowerCase();
        if (!query) return;

        setCargando(true);
        setMensajeError(null);

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
            if (!res.ok) throw new Error('auxilio, socorro, no hay pokemon');

            const datos = await res.json();
            setPokemonActual({
                id: datos.id,
                name: datos.name.toUpperCase(),
                image: datos.sprites.front_default,
                type: datos.types[0].type.name,
                baseExperience: datos.base_experience,
                esFavorito: false
            });
        } catch (error: any) {
            setPokemonActual(null);
            setMensajeError(error.message);
        } finally {
            setCargando(false);
        }
    };

    const clickGuardarPokemon = () => {
        if (!entrenadorActivo) {
            alert('debes seleccionar o registrar un entrenador');
            return;
        } 

        if (pokemonActual) {
            guardarPokemonMochila(pokemonActual);
            alert(`Pokemon ${pokemonActual.name} guardado en la mochila de ${entrenadorActivo?.nombreCompleto}`);

            // Limpieza del buscador para el quiz
            setBusqueda('');
            setPokemonActual(null);
        }
    };

    return (
        <>
            <div>
                {entrenadorActivo ? (
                    <p>Mochila Activa de: <strong>{entrenadorActivo.nombreCompleto}</strong></p>
                ) : (
                    <p>No hay entrenador activo. Ve al formulario de registro para activarlo.</p>
                )}
            </div>

            <form onSubmit={buscarPokemon}>
                <div>
                    <label>Buscar Pokemon</label>
                    <input 
                        type="text" 
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)} 
                        placeholder='ej: Pikachu, charmander' 
                    />
                </div>
                <button type='submit' disabled={cargando}>
                    {cargando ? 'Escaneando...' : 'Buscar'}
                </button>
            </form>

            {mensajeError && <p role="alert">{mensajeError}</p>}

            {pokemonActual && (
                <div>
                    <h4>{pokemonActual?.name}</h4>
                    <img src={pokemonActual.image} alt={pokemonActual.name} />
                    <p>
                        Elemento:{' '}
                        <span style={{ 
                            backgroundColor:
                                pokemonActual.type === 'fire' ? '#ff0000' :
                                pokemonActual.type === 'water' ? '#0000ff' :
                                pokemonActual.type === 'grass' ? '#00ff00' : 
                                pokemonActual.type === 'electric' ? '#ffff00' : 
                                pokemonActual.type === 'psychic' ? '#ff00ff' :
                                pokemonActual.type === 'ice' ? '#00ffff' :
                                pokemonActual.type === 'dragon' ? '#800080' :
                                pokemonActual.type === 'dark' ? '#000000' :
                                pokemonActual.type === 'fairy' ? '#ffc0cb' :
                                pokemonActual.type === 'normal' ? '#808080' :
                                pokemonActual.type === 'fighting' ? '#a52a2a' :
                                pokemonActual.type === 'flying' ? '#87ceeb' :
                                pokemonActual.type === 'poison' ? '#800080' : 
                                pokemonActual.type === 'ground' ? '#ddb870' : 
                                pokemonActual.type === 'bug' ? '#a8b820' :     
                                pokemonActual.type === 'rock' ? '#b8a038' :    
                                pokemonActual.type === 'steel' ? '#b8b8d0' :   
                                pokemonActual.type === 'ghost' ? '#705898' :   
                                '#cdcace',                                     
                            color: 'white',
                            padding: '3px 8px',
                            borderRadius: '5px',
                        }}>
                            {pokemonActual.type.toLocaleUpperCase()} 
                        </span>
                    </p>
                    <p>Experiencia Base: <strong>{pokemonActual.baseExperience}</strong></p>

                    <button type="button" className="btn-capturar" onClick={clickGuardarPokemon} disabled={!entrenadorActivo}>
                        Guardar en Mochila
                    </button>
                </div>
            )}
        </>
    );
};