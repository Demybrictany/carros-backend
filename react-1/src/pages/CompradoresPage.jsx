import { useState, useEffect } from "react";
import TablaCompradores from "../Components/tablas/TablaCompradores";
import { BASE_URL } from "../config";


function CompradoresPage() {
  const [compradores, setCompradores] = useState([]);

  const [Id_Compra, setIdCompra] = useState(null);

  const [Nombre, setNombre] = useState("");
  const [Apellido, setApellido] = useState("");
  const [DPI, setDPI] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Foto_DPI, setFotoDPI] = useState("");

    const [busqueda, setBusqueda] = useState("");

  
  // -------------------------------
  //  VALIDACIONES
  // -------------------------------

  const validarFormulario = () => {
    if (!Nombre.trim()) return "El nombre es obligatorio.";
    if (!Apellido.trim()) return "El apellido es obligatorio.";

    // VALIDAR DPI (EXACTAMENTE 13)
    if (!/^\d{13}$/.test(DPI))
      return "El DPI debe tener exactamente 13 dígitos.";

    // VALIDAR TELEFONO (OPCIONAL PERO SI LO ESCRIBE DEBE SER 8 DIGITOS)
    if (Telefono && !/^\d{8}$/.test(Telefono))
      return "El teléfono debe tener 8 dígitos.";



    return null;
  };

  // -------------------------------
  //  CARGA DE DATOS
  // -------------------------------

  const cargarCompradores = () => {
    fetch(`${BASE_URL}/compradores`)
      .then((res) => res.json())
      .then((data) => setCompradores(data));
  };

  useEffect(() => {
    cargarCompradores();
  }, []);

  // -------------------------------
  //  CONVERTIR IMAGEN
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
  //  SELECCIONAR PARA EDITAR
  // -------------------------------

  const seleccionarComprador = (c) => {
    setIdCompra(c.Id_Compra);
    setNombre(c.Nombre);
    setApellido(c.Apellido);
    setDPI(c.DPI);
    setTelefono(c.Telefono);
    setFotoDPI(c.Foto_DPI);
  };

  // -------------------------------
  //  LIMPIAR FORMULARIO
  // -------------------------------

  const limpiar = () => {
    setIdCompra(null);
    setNombre("");
    setApellido("");
    setDPI("");
    setTelefono("");
    setFotoDPI("");
  };

  // -------------------------------
  //  AGREGAR
  // -------------------------------

  const agregar = async () => {
    const error = validarFormulario();
    if (error) return alert(error); // ❌ DETIENE SI FALLA

    await fetch(`${BASE_URL}/compradores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nombre,
        Apellido,
        DPI,
        Telefono,
        Foto_DPI,
      }),
    });

    limpiar();
    cargarCompradores();
  };

  // -------------------------------
  //  ACTUALIZAR
  // -------------------------------

  const actualizar = async () => {
    const error = validarFormulario();
    if (error) return alert(error); // ❌ DETIENE SI FALLA

    await fetch(`${BASE_URL}/compradores/${Id_Compra}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nombre,
        Apellido,
        DPI,
        Telefono,
        Foto_DPI,
      }),
    });

    limpiar();
    cargarCompradores();
  };

  // -------------------------------
  //  RENDER
  // -------------------------------
const compradoresFiltrados = compradores.filter((c) => {
  const texto = busqueda.toLowerCase();
  return (
    c.Nombre.toLowerCase().includes(texto) ||
    c.Apellido.toLowerCase().includes(texto) ||
    c.DPI.toLowerCase().includes(texto) ||
    (c.Telefono ? c.Telefono.toLowerCase().includes(texto) : false)
  );
});

  return (
    <div className="page-container">
      <h1>Gestión de Compradores</h1>

      <div className="form-box">
        <h3>{Id_Compra ? "Editar Comprador" : "Nuevo Comprador"}</h3>

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
            if (/^\d*$/.test(e.target.value)) setDPI(e.target.value);
          }}
        />

        <input
          placeholder="Teléfono"
          value={Telefono}
          maxLength={8}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) setTelefono(e.target.value);
          }}
        />

        <label>Foto DPI:</label>
        <input type="file" accept="image/*" onChange={convertirImagen} />


        {Id_Compra ? (
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
         {/* 🔍 BUSCADOR ARRIBA DEL FORM */}
          <div className="search-row">
            <input
              className="search-input-inside"
              type="text"
              placeholder="Buscar Compradores..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
      <TablaCompradores
        compradores={compradoresFiltrados}
        seleccionarComprador={seleccionarComprador}
        refrescar={cargarCompradores}
      />
    </div>
  );
}

export default CompradoresPage;
