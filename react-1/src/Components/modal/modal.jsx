import { useEffect, useState } from "react";

function Modal({ abierto, cierra })
{
    //esto se usa como contenedor de los datos
    const [datos, setDatos]= useState([]); //array
    useEffect(()=> {
//aqui se solicitan los datos
        fetch("https://api.covidtracking.com/v1/us/current.json")
        .then ((response) => response.json())
        .then((data) => {
            setDatos(data[0])
            console.log(data[0])
    })
    .catch((error)=> console.log("error, algo salio mal"+error))
    }, [])
    
if(!abierto) return null
    return(
        <div onClick={cierra}>
            <h2>cantidad de negativos: {datos.positive}</h2>
            <h2>Cantidad de positivos: { datos.positive }</h2>
            <h3>Ultima fecha de actualizacion: { datos.date }</h3>
        </div>
    )
}

export default Modal