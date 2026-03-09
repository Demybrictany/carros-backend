import React, {useState} from "react";
import Boton from '../botones/boton';

//no tiene que tener mas de 100 lineas
function Formulario (){

const [nombre, setNombre]= useState("");

const handleSubmit = (event) =>{
    event.preventDefault();
    console.log(nombre)
}

    return(
        /* codigo html */
        <form onSubmit={handleSubmit}>
        <div>
            <label >Nombre: </label>
            <input
                type = "Text"
                value={nombre}/*pueden escribir o inyectar variables*/
                onChange={(event)=> setNombre(event.target.value)} 
            />
        </div>
        <Boton texto= "Enviar"/>
        </form>
    );
}

export default Formulario;