import React, { useEffect, useState } from "react";
import { usePokemon, type PokemonTarjeta } from "../context/PokemonContext";

export const BuscadorPokemon: React.FC = () => {
    const { entrenadorActivo, guardarPokemonMochila } = usePokemon();

    const [busqueda, setBusqueda] = useState('');
    const [pokemonActual, setPokemonActual] = useState<PokemonTarjeta | null>(null);
    const [mensajeError, setMensajeError] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!pokemonActual || !entrenadorActivo) return;

        guardarPokemonMochila(pokemonActual);
        alert(`Pokémon ${pokemonActual.name} guardado en la mochila de ${entrenadorActivo.nombreCompleto}`);
    }, [pokemonActual, entrenadorActivo, guardarPokemonMochila]);

    const buscarPokemon = async (e: React.FormEvent) => {
        e.preventDefault();

        const query = busqueda.trim().toLocaleLowerCase();

        if (!query) return;

        setCargando(true);
        setMensajeError(null);

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
            if (!res.ok) throw new Error('Pokémon no encontrado');

            const datos = await res.json();
            const pokemon: PokemonTarjeta = {
                id: String(datos.id),
                name: datos.name,
                image: datos.sprites.front_default,
                tupe: datos.types[0].type.name,
                baseExperiense: String(datos.base_experience),
                esFavorito: false,
            };

            setPokemonActual(pokemon);
        } catch (error: any) {
            setPokemonActual(null);
            setMensajeError(error.message || 'Error al buscar el Pokémon');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
            <div>
                {entrenadorActivo ? (
                    <p>mochila activa de: <strong>{entrenadorActivo.nombreCompleto}</strong>!</p>
                ) : (
                    <p>Por favor, selecciona un entrenador para buscar pokemones.</p>
                )}
            </div>

            <form onSubmit={buscarPokemon}>
                <div>
                    <label>Buscar Pokemon:</label>
                    <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Ej Pikachu, charmander" />
                </div>
                <button type="submit" disabled={cargando}>
                    {cargando ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}

            {pokemonActual && (
                <div>
                    <h3>{pokemonActual.name}</h3>
                    <img src={pokemonActual.image} alt={pokemonActual.name} />
                </div>
            )}
        </div>
    );
};