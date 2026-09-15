import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePokemon, type usuario } from "../context/PokemonContext";

export const RegistroPokemon: React.FC = () => {
    const { registrarEntrenador } = usePokemon();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [tipoDoc, setTipoDoc] = useState('CC');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [correo, setCorreo] = useState('');
    const [datosPersonales, setDatosPersonales] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!datosPersonales) {
            alert('Aceptar el tratamiento de datos personales');
            return;
        }

        const nuevoUsuario: usuario = {
            id: Date.now(),
            nombreCompleto: `${nombre} ${apellido}`,
            documento: { tipo: tipoDoc, numero: dni },
            fechaNacimiento,
            correo,
            datosPersonales: true,
            fechaRegistro: new Date().toLocaleDateString()
        };

        registrarEntrenador(nuevoUsuario);
        navigate('/pokemon');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <header className="form-header">
                    <div className="badge">SISTEMA DE REGISTRO</div>
                <h1>Acceso al Portal</h1>
                <p>Ingresa tus datos de identificación para validar tu perfil espacial.</p>
                </header>

                <fieldset className="form-section">
                    <legend>01. Información Personal</legend>
                    <div className="grid-2">
                        <div className="input-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Alex" required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input type="text" id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ej. Vance" required />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="input-group">
                            <label htmlFor="tipo_identificacion">Tipo de Documento</label>
                            <select id="tipo_identificacion" name="tipo_identificacion" value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)} required>
                                <option value="DNI">Documento Nacional de Identidad (DNI)</option>
                                <option value="CC">Cédula de Ciudadanía (CC)</option>
                                <option value="TI">Tarjeta de Identidad (TI)</option>
                                <option value="PA">Pasaporte (PA)</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="numero_identificacion">Número de Documento</label>
                            <input type="text" id="numero_identificacion" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="1000000000" required />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="nacimiento">Fecha de Nacimiento</label>
                        <input type="date" id="nacimiento" name="nacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                    </div>
                </fieldset>

                <fieldset className="form-section">
                    <legend>02. Datos de Contacto</legend>
                    <div className="input-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input type="email" id="correo" name="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="usuario@espacio.com" required />
                    </div>
                </fieldset>

                <div className="checkbox-group">
                    <input type="checkbox" id="tratamiento_datos" name="acepta_politica" checked={datosPersonales} onChange={(e) => setDatosPersonales(e.target.checked)} required />
                    <label htmlFor="tratamiento_datos">
                        Acepto la <a href="#" target="_blank" rel="noreferrer">política de tratamiento de datos</a> y términos de servicio.
                    </label>
                </div>

                <button type="submit" className="cyber-button">Enviar Formulario</button>
            </form>
        </div>
    );
};