import type React from 'react';
import react, {  createContext, useContext, useState, useEffect  } from 'react';

export interface usuario {
    id: number;
    nombreCompleto: string;
    documento: { tipo: string, numero: string};
    fechaNacimiento: string;
    correo: string;
    datosPersonales: boolean;
    fechaRegistro: string;
}

export interface PokemonTarjeta {
    id: string;
    name: string;
    image: string;
    tupe: string;
    baseExperiense: string;
    esFavorito: boolean;
}

interface pokemonContextType {
    entrenadores : usuario[];
    entrenadorActivo : usuario | null;
    mochilaActual: PokemonTarjeta[];
    seleccionarEntrenador : (usuario: usuario) => void;
    registrarEntrenador : (usuario : usuario) => void;
    guardarMochila : (pokemon : PokemonTarjeta) => void;
    actualizarpOKEMON : (pokemonId : Number) => void;
    eliminarPokemon : (pokemonId : number) => void;
}

const pokemonContext = createContext<pokemonContextType | undefined(undefined)>;

export const pokemonProvider : React.FC<{ children : React.ReactNode}> = ({ children }) => {
    

}