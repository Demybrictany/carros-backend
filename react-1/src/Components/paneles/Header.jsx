import logo from "../Imagenes/logo.png";

function Header({ toggleMenu, menuOpen }) {

  return (
    <div className="top-header">

      <img src={logo} alt="Logo" className="header-logo" />

      <h2 className="header-title">
        Sistema de Gestión de Autos
      </h2>

      {/* BOTON HAMBURGUESA */}
      {!menuOpen && (
        <button
          className="menu-btn"
          onClick={toggleMenu}
        >
          ☰
        </button>
      )}

    </div>
  );
}

export default Header;