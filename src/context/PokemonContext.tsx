import React, {  createContext, useContext, useState, useEffect  } from 'react';

export interface usuario {
    id: number;
    nombreCompleto: string;
    documento: { tipo: string, numero: string};
    fechaNacimiento: string;
    correo: string;
    datosPersonales: boolean;
    fechaRegistro: string;
};

export interface PokemonTarjeta {
    id: string;
    name: string;
    image: string;
    tupe: string;
    baseExperiense: string;
    esFavorito: boolean;
};

interface pokemonContext {
    entrenadores : usuario[];
    entrenadorActivo : usuario | null;
    mochilaActual: PokemonTarjeta[];
    seleccionarEntrenador : (usuario: usuario) => void;
    registrarEntrenador : (usuario : usuario) => void;
    guardarPokemonMochila : (pokemon : PokemonTarjeta) => void;
    actualizarPokemon : (pokemonId : Number) => void;
    eliminarPokemon : (pokemonId : number) => void;
};

const pokemonContext = createContext<pokemonContext | undefined(undefined)>;

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
    };

    const seleccionarEntrenador = (usuario: usuario) => {
        setEntrenadorActivo(usuario);

        localStorage.setItem('entrenador_Activo_id', usuario.id.toString());
        cargarMochilaEntrenador(usuario.id);
    };

    const registrarEntrenador = (nuevoUsuario : usuario) => {
        const actualizados = [...entrenadores, nuevoUsuario];
        localStorage.setItem('lista_entrenadores', JSON.stringify(actualizados));
        seleccionarEntrenador(nuevoUsuario);
    };

    const guardarPokemonMochila = (pokemon: PokemonTerjeta) => {
        if(!entrenadorActivo) return;
        const actualizada = [ ...mochillaActual, {...pokemon, esFavorito: false} ];
        setMochilaActual(actualizada)
        localStorage.setItem(`mochilla_${entrenadorActivo.id}`);
        
    };

    const actuañizarFavorito = (PokemonId : number) =>{
        if (!entrenadorActivo) return
        const actualizada = mochilaActual.map(p => p.id === pokemonId ? {...p, esFavorito} : p);
        setMochilaActual(actualizada);
        localstorage.setItem('mochila_${entrenadorActivo.id}',JSON.stringify(actualizados));
    };

    const eliminarPokemon = (pokemonId : number) =>{
        if(!entrenadorActivo) return;
        const filtrado = mochilaActua?.filter(p => p.id !== pokemonId);
        setMochilaActual(filtrado);
        localstorage.setItem('mochila_${entrenadorActivo.id}',JSON.stringify(filtrado));
    };

    return (
        <pokemonContext.Provider value={{
            entrenadores,
            entrenadorActivo,
            mochilaActual,
            seleccionarEntrenador,
            registrarEntrenador,
            guardarPokemonMochila,
            actualizarPokemon,
            eliminarPokemon
        }}>
            {children}
        </pokemonContext.Provider>
    );
};

export const pokemonContext = () => {
    const context = useContext(pokemonContext);
    if(!context) throw new Error('usePokemon debe ser usado dentro de un Provider');
    return context;
}


