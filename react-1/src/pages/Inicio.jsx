import React from "react";
import logo from "../Components/Imagenes/logo1.png";

function Inicio() {
  return (
    <div className="inicio-container">
      <img src={logo} alt="Logo" className="inicio-logo" />
    </div>
  );
}

export default Inicio;
