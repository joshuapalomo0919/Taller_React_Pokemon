import React, { createContext, useContext, useEffect, useState } from 'react';

export interface usuario {
    id: number;
    nombreCompleto: string;
    documento: { tipo: string; numero: string };
    fechaNacimiento: string;
    correo: string;
    datosPersonales: boolean;
    fechaRegistro: string;
}

export interface PokemonTarjeta {
    id: number;
    name: string;
    image: string;
    type: string;
    baseExperience: number;
    esFavorito: boolean;
}

interface PokemonContextValue {
    entrenadores: usuario[];
    entrenadorActivo: usuario | null;
    mochilaActual: PokemonTarjeta[];
    seleccionarEntrenador: (usuario: usuario) => void;
    registrarEntrenador: (usuario: usuario) => void;
    guardarPokemonMochila: (pokemon: PokemonTarjeta) => void;
    actualizarPokemon: (pokemonId: number) => void;
    eliminarPokemon: (pokemonId: number) => void;
}

const PokemonContext = createContext<PokemonContextValue | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [entrenadores, setEntrenadores] = useState<usuario[]>([]);
    const [entrenadorActivo, setEntrenadorActivo] = useState<usuario | null>(null);
    const [mochilaActual, setMochilaActual] = useState<PokemonTarjeta[]>([]);

    const cargarMochilaEntrenador = (usuarioId: number) => {
        const data = localStorage.getItem(`mochila_${usuarioId}`);
        setMochilaActual(data ? JSON.parse(data) : []);
    };

    const seleccionarEntrenador = (usuario: usuario) => {
        setEntrenadorActivo(usuario);
        localStorage.setItem('entrenador_Activo_id', usuario.id.toString());
        cargarMochilaEntrenador(usuario.id);
    };

    useEffect(() => {
        const data = localStorage.getItem('lista_entrenadores');
        if (!data) return;
        const lista: usuario[] = JSON.parse(data);
        setEntrenadores(lista);
        const idActivo = localStorage.getItem('entrenador_Activo_id');
        const encontrado = lista.find((usuario) => usuario.id.toString() === idActivo);
        if (encontrado) seleccionarEntrenador(encontrado);
    }, []);

    const registrarEntrenador = (nuevoUsuario: usuario) => {
        const actualizados = [...entrenadores, nuevoUsuario];
        setEntrenadores(actualizados);
        localStorage.setItem('lista_entrenadores', JSON.stringify(actualizados));
        seleccionarEntrenador(nuevoUsuario);
    };

    const guardarPokemonMochila = (pokemon: PokemonTarjeta) => {
        if (!entrenadorActivo) return;
        const actualizada = [...mochilaActual, { ...pokemon, esFavorito: false }];
        setMochilaActual(actualizada);
        localStorage.setItem(`mochila_${entrenadorActivo.id}`, JSON.stringify(actualizada));
    };

    const actualizarPokemon = (pokemonId: number) => {
        if (!entrenadorActivo) return;
        const actualizada = mochilaActual.map((pokemon) =>
            pokemon.id === pokemonId ? { ...pokemon, esFavorito: !pokemon.esFavorito } : pokemon
        );
        setMochilaActual(actualizada);
        localStorage.setItem(`mochila_${entrenadorActivo.id}`, JSON.stringify(actualizada));
    };

    const eliminarPokemon = (pokemonId: number) => {
        if (!entrenadorActivo) return;
        const filtrado = mochilaActual.filter((pokemon) => pokemon.id !== pokemonId);
        setMochilaActual(filtrado);
        localStorage.setItem(`mochila_${entrenadorActivo.id}`, JSON.stringify(filtrado));
    };

    return (
        <PokemonContext.Provider value={{ entrenadores, entrenadorActivo, mochilaActual, seleccionarEntrenador, registrarEntrenador, guardarPokemonMochila, actualizarPokemon, eliminarPokemon }}>
            {children}
        </PokemonContext.Provider>
    );
};

export const usePokemon = () => {
    const context = useContext(PokemonContext);
    if (!context) throw new Error('usePokemon debe ser usado dentro de un Provider');
    return context;
};


