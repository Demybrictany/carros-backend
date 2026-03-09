import React, { useState } from "react";
import { BASE_URL } from "../../config";
import Boton from '../botones/Boton'

function Formulario() {
    /* Nuestro codigo javascript */
    /* Construccion de variables */

    const [id, setId] = useState(0);
    const [autor, setAutor] = useState({});
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState(0);

    /* Construccion de funcion */

    const handleSubmit = (event) => {
        event.preventDefault();
        
        //Por defecto es una peticion GET
        fetch(`${BASE_URL}/autores/${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setAutor(data)
            setNombre(data.nombre)
            setEstado(data.estado)
            setId(data.id)
        })
    }

    return (
        /* Nuestro codigo html */
        <div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Id: </label>
                    <input 
                        type="number"
                        min="0"
                        value={id} /* Pueden escribir o inyectar variables */
                        onChange={(event) => setId(Number(event.target.value))}
                    />
                </div>
                <Boton texto="Enviar"/>
            </form>
            <h1>El id es: {id}</h1>
            <h1>El nombre es: {nombre}</h1>
            <h1>El estado es: {estado}</h1>
        </div>
    );
}

export default Formulario;