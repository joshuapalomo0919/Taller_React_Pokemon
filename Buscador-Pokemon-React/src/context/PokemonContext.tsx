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
    const [entrenadoresActivo,setEntrenadores] = useState<usuario[]>();
    const [entrenadorActivo, setEntrenadorActivo] = useState<usuario[] | null> (null);
    const [mochilaActivo, setmochilaActual] = useState<PokemonTarjeta[] | null> (null);


    useEffect(() =>{
        const data = localStorage.getItem('lista_entrenadores');
        if(data){
            const lista : usuario[]= JSON.parse(data);
            setEntrenadores(lista);

            const idActivo = localStorage.getItem('entrenador_Activo_id');

            if(idActivo) {
                const encontrado = lista.find(u => u.id.toString() === idActivo);
                if (encontrado) seleccionarEntrenador(encontrado)
            }
  },[]);

    const cargarMochilaEntrenador = (usuarioId: number) => {
        const data = localStorage.getItem(`mochila_${usuarioId}`);
        setmochilaActual(data ? JSON.parse(data) : []);
    }

    const seleccionarEntrenador = (usuario: usuario) => {
        setEntrenadorActivo(usuario);

        localStorage.setItem('entrenador_Activo_id', usuario.id.toString());
        cargarMochilaEntrenador(usuario.id);
    }

    

}


