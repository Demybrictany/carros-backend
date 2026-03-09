/*import { useEffect, useState } from 'react'

function Tabla1() {
    const [pagina, setPagina] = useState(1);
    const [porPagina, setPorPagina] = useState(50);
    const [usuarios, setUsuarios] = useState([])
    useEffect(() => {
        fetch("${BASE_URL}/autores")
        .then((response) => response.json())
        .then((data) => {
            setUsuarios(data)
        })
    }, []);
    
const inicio = (pagina - 1) * porPagina;
const fin = inicio + porPagina;
const datosPaginados = usuarios.slice(inicio, fin);
    return (
        <div>
                <label>
        Mostrar:
        <select 
        value={porPagina} 
        onChange={(e) => {setPorPagina(Number(e.target.value))
            setPagina(1);
        }}
        
        >
        <option value={50}>50</option>
        <option value={100}>100</option>
        </select>
    </label>
            <h1>Tabla de datos</h1>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    { datosPaginados.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{ usuario.id }</td>
                            <td>{ usuario.nombre }</td>
                            <td>{ usuario.estado }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                <div>
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
        Anterior
        </button>
        <span>
        Página {pagina} de {Math.ceil(usuarios.length / porPagina)}
        </span>
        <button
        disabled={pagina === Math.ceil(usuarios.length / porPagina)}
        onClick={() => setPagina(pagina + 1)}
        >
        Siguiente
        </button>
    </div>
        </div>
    );
}

export default Tabla1*/