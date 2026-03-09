import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function LoginPage() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const API = `${BASE_URL}/usuarios/login`;

  const iniciarSesion = async () => {
    if (!usuario || !contrasena) {
      return alert("Ingrese usuario o correo y contraseña");
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: usuario,
          contrasena: contrasena,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Error al iniciar sesión");
      }

      // Guarda todo en el localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("token", data.token);
      // Actualizar Sidebar sin recargar
      window.dispatchEvent(new Event("usuarioActualizado"));

      alert("Inicio de sesión correcto ✔");

      const rol = data.usuario.rol.toLowerCase();

      if (rol === "gerente" || rol === "programador") {
        navigate("/");
      } else if (rol === "colaborador") {
        navigate("/carros-predio");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("ERROR LOGIN:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Correo o Nombre"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />

        <button className="btn-primary" onClick={iniciarSesion}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
