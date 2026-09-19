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
    sincronizarConBD: () => void;
}

const PokemonContext = createContext<PokemonContextValue | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [entrenadores, setEntrenadores] = useState<usuario[]>([]);
    const [entrenadorActivo, setEntrenadorActivo] = useState<usuario | null>(null);
    const [mochilaActual, setMochilaActual] = useState<PokemonTarjeta[]>([]);

    // Carga los entrenadores sincronizados siempre desde la BD (localStorage)
    const sincronizarConBD = () => {
        const dataEntrenadores = localStorage.getItem('lista_entrenadores');
        const lista: usuario[] = dataEntrenadores ? JSON.parse(dataEntrenadores) : [];
        setEntrenadores(lista);

        const idActivo = localStorage.getItem('entrenador_Activo_id');
        const encontrado = lista.find((u) => u.id.toString() === idActivo);

        if (encontrado) {
            setEntrenadorActivo(encontrado);
            cargarMochilaEntrenador(encontrado.id);
        } else {
            // Si el entrenador activo ya no existe en la BD (fue eliminado), resetea la selección
            setEntrenadorActivo(null);
            setMochilaActual([]);
            localStorage.removeItem('entrenador_Activo_id');
        }
    };

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
        sincronizarConBD();

        // Listener para detectar cambios manuales en el localStorage desde DevTools o entre pestañas
        const handleStorageChange = () => {
            sincronizarConBD();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const registrarEntrenador = (nuevoUsuario: usuario) => {
        // Validación: Obtener la lista REAL y actualizada desde la BD antes de insertar
        const data = localStorage.getItem('lista_entrenadores');
        const listaActualBD: usuario[] = data ? JSON.parse(data) : [];

        const actualizados = [...listaActualBD, nuevoUsuario];
        setEntrenadores(actualizados);
        localStorage.setItem('lista_entrenadores', JSON.stringify(actualizados));
        seleccionarEntrenador(nuevoUsuario);
    };

    const guardarPokemonMochila = (pokemon: PokemonTarjeta) => {
        if (!entrenadorActivo) return;

        // Validación clave del tablero: Leer la mochilas directamente desde la BD
        const dataMochila = localStorage.getItem(`mochila_${entrenadorActivo.id}`);
        const mochilaBD: PokemonTarjeta[] = dataMochila ? JSON.parse(dataMochila) : [];

        // Guarda SOLO lo que estaba en BD + el nuevo registro (sin arrastrar estado desactualizado del DOM)
        const actualizada = [...mochilaBD, { ...pokemon, esFavorito: false }];
        setMochilaActual(actualizada);
        localStorage.setItem(`mochila_${entrenadorActivo.id}`, JSON.stringify(actualizada));
    };

    const actualizarPokemon = (pokemonId: number) => {
        if (!entrenadorActivo) return;

        const dataMochila = localStorage.getItem(`mochila_${entrenadorActivo.id}`);
        const mochilaBD: PokemonTarjeta[] = dataMochila ? JSON.parse(dataMochila) : [];

        const actualizada = mochilaBD.map((pokemon) =>
            pokemon.id === pokemonId ? { ...pokemon, esFavorito: !pokemon.esFavorito } : pokemon
        );
        setMochilaActual(actualizada);
        localStorage.setItem(`mochila_${entrenadorActivo.id}`, JSON.stringify(actualizada));
    };

    const eliminarPokemon = (pokemonId: number) => {
        if (!entrenadorActivo) return;

        const dataMochila = localStorage.getItem(`mochila_${entrenadorActivo.id}`);
        const mochilaBD: PokemonTarjeta[] = dataMochila ? JSON.parse(dataMochila) : [];

        const filtrado = mochilaBD.filter((pokemon) => pokemon.id !== pokemonId);
        setMochilaActual(filtrado);
        localStorage.setItem(`mochila_${entrenadorActivo.id}`, JSON.stringify(filtrado));
    };

    return (
        <PokemonContext.Provider
            value={{
                entrenadores,
                entrenadorActivo,
                mochilaActual,
                seleccionarEntrenador,
                registrarEntrenador,
                guardarPokemonMochila,
                actualizarPokemon,
                eliminarPokemon,
                sincronizarConBD
            }}
        >
            {children}
        </PokemonContext.Provider>
    );
};

export const usePokemon = () => {
    const context = useContext(PokemonContext);
    if (!context) throw new Error('usePokemon debe ser usado dentro de un Provider');
    return context;
};