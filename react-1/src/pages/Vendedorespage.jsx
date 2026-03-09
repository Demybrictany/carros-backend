import { useState, useEffect } from "react";
import TablaVendedores from "../Components/tablas/TablaVendedores";
import { BASE_URL } from "../config";

function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);

  const [Id_Vendedor, setId] = useState(null);

  const [Nombre, setNombre] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Dpi, setDpi] = useState("");
  const [Foto_DPI, setFotoDPI] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Relacion_Dueño, setRelacion] = useState("");

  const [busqueda, setBusqueda] = useState("");

  // -------------------------------
  // VALIDACIONES
  // -------------------------------

  const validarFormulario = () => {
    if (!Nombre.trim()) return "El nombre es obligatorio.";

    if (!Telefono.trim()) return "El teléfono es obligatorio.";

    if (!/^\d{13}$/.test(Dpi))
      return "El DPI debe tener exactamente 13 dígitos.";

    return null;
  };

  // -------------------------------
  // CARGAR VENDEDORES
  // -------------------------------

  const cargarVendedores = () => {
    fetch(`${BASE_URL}/vendedores`)
      .then((res) => res.json())
      .then((data) => setVendedores(data));
  };

  useEffect(() => {
    cargarVendedores();
  }, []);

  // -------------------------------
  // CONVERTIR IMAGEN
  // -------------------------------

  const convertirImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoDPI(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // -------------------------------
  // SELECCIONAR PARA EDITAR
  // -------------------------------

  const seleccionar = (v) => {
    setId(v.Id_Vendedor);
    setNombre(v.Nombre);
    setTelefono(v.Telefono);
    setDpi(v.Dpi);
    setFotoDPI(v.Foto_DPI);
    setDireccion(v.Direccion);
    setRelacion(v.Relacion_Dueño);
  };

  // -------------------------------
  // LIMPIAR
  // -------------------------------

  const limpiar = () => {
    setId(null);
    setNombre("");
    setTelefono("");
    setDpi("");
    setFotoDPI("");
    setDireccion("");
    setRelacion("");
  };

  // -------------------------------
  // AGREGAR
  // -------------------------------

  const agregar = async () => {
    const error = validarFormulario();
    if (error) return alert(error);

    await fetch(`${BASE_URL}/vendedores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre,
        Telefono,
        Dpi,
        Foto_DPI,
        Direccion,
        Relacion_Dueño,
      }),
    });

    limpiar();
    cargarVendedores();
  };

  // -------------------------------
  // ACTUALIZAR
  // -------------------------------

  const actualizar = async () => {
    const error = validarFormulario();
    if (error) return alert(error);

    await fetch(`${BASE_URL}/vendedores/${Id_Vendedor}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Nombre,
        Telefono,
        Dpi,
        Foto_DPI,
        Direccion,
        Relacion_Dueño,
      }),
    });

    limpiar();
    cargarVendedores();
  };

  // -------------------------------
  // BUSQUEDA
  // -------------------------------

  const vendedoresFiltrados = vendedores.filter((v) => {
    const texto = busqueda.toLowerCase();

    return (
      v.Nombre.toLowerCase().includes(texto) ||
      v.Telefono.toLowerCase().includes(texto) ||
      v.Dpi.toLowerCase().includes(texto) ||
      (v.Direccion ? v.Direccion.toLowerCase().includes(texto) : false) ||
      (v.Relacion_Dueño
        ? v.Relacion_Dueño.toLowerCase().includes(texto)
        : false)
    );
  });

  // -------------------------------
  // RENDER
  // -------------------------------

  return (
    <div className="page-container">
      <h1>Gestión de Vendedores</h1>

      <div className="form-box">
        <h3>{Id_Vendedor ? "Editar Vendedor" : "Nuevo Vendedor"}</h3>

        <input
          placeholder="Nombre"
          value={Nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          placeholder="Teléfono"
          value={Telefono}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) setTelefono(e.target.value);
          }}
        />

        <input
          placeholder="DPI (13 dígitos)"
          value={Dpi}
          maxLength={13}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) setDpi(e.target.value);
          }}
        />

        <label>Foto DPI:</label>
        <input type="file" accept="image/*" onChange={convertirImagen} />

        <input
          placeholder="Dirección"
          value={Direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <select
          value={Relacion_Dueño}
          onChange={(e) => setRelacion(e.target.value)}
        >
          <option value="">Seleccione relación</option>
          <option value="Hermano">Hermano</option>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Amigo">Amigo</option>
        </select>

        {Id_Vendedor ? (
          <>
            <button className="btn-primary" onClick={actualizar}>
              Actualizar
            </button>

            <button className="btn-secondary" onClick={limpiar}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={agregar}>
            Agregar
          </button>
        )}
      </div>

      {/* BUSCADOR */}
      <div className="search-row">
        <input
          className="search-input-inside"
          type="text"
          placeholder="Buscar Vendedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <TablaVendedores
        vendedores={vendedoresFiltrados}
        seleccionar={seleccionar}
        refrescar={cargarVendedores}
      />
    </div>
  );
}

export default VendedoresPage;