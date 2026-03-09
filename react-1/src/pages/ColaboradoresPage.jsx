import { useState, useEffect } from "react";
import TablaColaboradores from "../Components/tablas/TablaColaboradores";
import { BASE_URL } from "../config";

function ColaboradoresPage() {

  const [colaboradores, setColaboradores] = useState([]);

  const [Id_Colaborador, setIdColaborador] = useState(null);

  const [Nombre, setNombre] = useState("");
  const [Apellido, setApellido] = useState("");
  const [DPI, setDPI] = useState("");

  const [busqueda, setBusqueda] = useState("");

  // -----------------------------
  // VALIDACIÓN DPI
  // -----------------------------

  const validarDPI = (dpi) => /^\d{13}$/.test(dpi);

  // -----------------------------
  // CARGAR DATOS
  // -----------------------------

  const cargarColaboradores = async () => {
    try {
      const res = await fetch(`${BASE_URL}/colaboradores`);
      const data = await res.json();

      setColaboradores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando colaboradores:", error);
      setColaboradores([]);
    }
  };

  useEffect(() => {
    cargarColaboradores();
  }, []);

  // -----------------------------
  // SELECCIONAR PARA EDITAR
  // -----------------------------

  const seleccionar = (c) => {
    setIdColaborador(c.Id_Colaborador);
    setNombre(c.Nombre || "");
    setApellido(c.Apellido || "");
    setDPI(c.DPI || "");
  };

  // -----------------------------
  // LIMPIAR FORMULARIO
  // -----------------------------

  const limpiar = () => {
    setIdColaborador(null);
    setNombre("");
    setApellido("");
    setDPI("");
  };

  // -----------------------------
  // AGREGAR
  // -----------------------------

  const agregar = async () => {
    if (!Nombre.trim() || !Apellido.trim())
      return alert("Nombre y apellido son obligatorios.");

    if (!validarDPI(DPI))
      return alert("El DPI debe tener exactamente 13 dígitos.");

    await fetch(`${BASE_URL}/colaboradores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Nombre,
        Apellido,
        DPI
      })
    });

    limpiar();
    cargarColaboradores();
  };

  // -----------------------------
  // ACTUALIZAR
  // -----------------------------

  const actualizar = async () => {
    if (!Nombre.trim() || !Apellido.trim())
      return alert("Nombre y apellido son obligatorios.");

    if (!validarDPI(DPI))
      return alert("El DPI debe tener exactamente 13 dígitos.");

    await fetch(`${BASE_URL}/colaboradores/${Id_Colaborador}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Nombre,
        Apellido,
        DPI
      })
    });

    limpiar();
    cargarColaboradores();
  };

  // -----------------------------
  // FILTRO BUSQUEDA
  // -----------------------------

  const colaboradoresFiltrados = colaboradores.filter((c) => {
    const texto = busqueda.toLowerCase();

    return (
      (c.Nombre ? c.Nombre.toLowerCase().includes(texto) : false) ||
      (c.Apellido ? c.Apellido.toLowerCase().includes(texto) : false) ||
      (c.DPI ? String(c.DPI).toLowerCase().includes(texto) : false)
    );
  });

  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <div className="page-container">
      <h1>Gestión de Colaboradores</h1>

      <div className="form-box">

        <h3>{Id_Colaborador ? "Editar Colaborador" : "Nuevo Colaborador"}</h3>

        <input
          placeholder="Nombre"
          value={Nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          placeholder="Apellido"
          value={Apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <input
          placeholder="DPI (13 dígitos)"
          value={DPI}
          maxLength={13}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d*$/.test(v)) setDPI(v);
          }}
        />

        {Id_Colaborador ? (
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
          placeholder="Buscar Colaborador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <TablaColaboradores
        colaboradores={colaboradoresFiltrados}
        seleccionar={seleccionar}
        refrescar={cargarColaboradores}
      />
    </div>
  );
}

export default ColaboradoresPage;