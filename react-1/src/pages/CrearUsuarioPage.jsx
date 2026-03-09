import { useState } from "react";
import { registrarUsuario } from "../services/usuarioApi";

function CrearUsuarioPage() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    Nombre: "",
    Correo: "",
    Contrasena: "",
    Rol: "colaborador",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No autorizado");
      return;
    }

    try {
      const data = await registrarUsuario(form, token);

      if (data.error) {
        alert(data.error);
        return;
      }

      alert("Usuario creado ✔");
      window.location.href = "/usuarios";

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Crear Usuario</h2>

        <form onSubmit={submit}>
          <input name="Nombre" placeholder="Nombre" onChange={handleChange} required />
          <input name="Correo" placeholder="Correo" onChange={handleChange} required />
          <input
            name="Contrasena"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />

          <select name="Rol" onChange={handleChange}>
            <option value="colaborador">Colaborador</option>
            <option value="gerente">Gerente</option>
            <option value="cliente">Cliente</option>
          </select>

          <button type="submit" className="btn-primary">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearUsuarioPage;