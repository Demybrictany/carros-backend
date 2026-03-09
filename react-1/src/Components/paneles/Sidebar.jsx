import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Sidebar({ menuOpen, toggleMenu }) {

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);

  useEffect(() => {
    const cargarUsuario = () => {
      const data = localStorage.getItem("usuario");
      setUsuario(data ? JSON.parse(data) : null);
    };

    cargarUsuario();

    window.addEventListener("usuarioActualizado", cargarUsuario);

    return () => {
      window.removeEventListener("usuarioActualizado", cargarUsuario);
    };
  }, []);

  return (

    <div className={`sidebar ${menuOpen ? "open" : ""}`}>

      {/* BOTON CERRAR */}
      <button
        className="close-sidebar"
        onClick={toggleMenu}
      >
        ✖
      </button>

      <h3 className="sidebar-title">Menú</h3>

      <ul className="sidebar-menu">

        {!usuario && (
          <>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {usuario && (
          <>
            <li><Link to="/">Inicio</Link></li>
          </>
        )}

        {(usuario?.rol === "gerente" || usuario?.rol === "programador") && (
          <>
            <li><Link to="/crear-usuario">Crear Usuario</Link></li>
            <li><Link to="/vendedores">Vendedores</Link></li>
            <li><Link to="/compradores">Compradores</Link></li>
            <li><Link to="/colaboradores">Colaboradores</Link></li>
            <li><Link to="/carros-predio">Carros Predio</Link></li>
            <li><Link to="/gastos">Gastos</Link></li>
            <li><Link to="/ventas">Ventas</Link></li>
            <li><Link to="/buscar">Busquedas</Link></li>
            <li><Link to="/usuarios">Usuarios</Link></li>
            <li><Link to="/estadisticas">Estadisticas</Link></li>
          </>
        )}

        {usuario?.rol === "colaborador" && (
          <>
            <li><Link to="/vendedores">Vendedores</Link></li>
            <li><Link to="/compradores">Compradores</Link></li>
            <li><Link to="/carros-predio">Carros Predio</Link></li>
            <li><Link to="/gastos">Gastos</Link></li>
            <li><Link to="/ventas">Ventas</Link></li>
            <li><Link to="/buscar">Busquedas</Link></li>
          </>
        )}

        {usuario && (
          <li>
            <button
              style={{
                background: "#d9534f",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left"
              }}
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Cerrar Sesión
            </button>
          </li>
        )}

      </ul>

    </div>
  );
}

export default Sidebar;