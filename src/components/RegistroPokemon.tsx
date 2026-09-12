import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemon, type usuario } from "../context/PokemonContext";

export const RegistroPokemon: React.FC = () => {
    const { entrenadores, entrenadorActivo, registrarEntrenador, seleccionarEntrenador } = usePokemon();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [tipoDoc, setDoc] = useState({ "CC" });
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [correo, setCorreo] = useState('');
    const [datosPersonales, setDatosPersonales] = useState('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!datosPersonales) {
            alert('Aceptar el tratamiento de datos personales');
            return;
        }

        Const nuevoUsuario: usuario = {
            id: Date.now(),
            nombreCompleto: '${nombre} ${apellido}',
            apellido: {tipo: tipoDoc, numero: dni},
            fechaNacimiento,
            correo,
            datosPersonales: true,
            fechaRegistro: new Date().toLocaleDateString()
        };

        registrarEntrenador(Nuevo);
        navigate('/pokemon');
        };

    return (
        <div>
            <p>Registro de Entrenador Pokemon</p>
        </div>

    }

     
    };