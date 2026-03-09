import React, {useState, useEffect} from 'react'
import Boton from '../botones/Boton'
import { BASE_URL } from "../../config";

function FormCrearAutor() {
    const [nombre, setNombre] = useState('')
    const [estado, setEstado] = useState(0)

    const handleSubmit = (event) => {
        event.preventDefault();
        //para crear un nuevo autor
        fetch(`${BASE_URL}/autores/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre: nombre,
                estado: estado
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Autores</h1>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <h1>Estado</h1>
                <input
                    type="number"
                    min="0"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                />
                <Boton texto="Enviar"/>
            </form>
        </div>
    )
}

export default FormCrearAutor;