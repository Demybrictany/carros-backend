import { useState, useEffect } from "react";
import TablaVentas from "../Components/tablas/TablaVentas";
import { BASE_URL } from "../config";


  function VentasPage() {
    const [ventas, setVentas] = useState([]);
    const [carros, setCarros] = useState([]);
    const [compradores, setCompradores] = useState([]);

    const [Id_Venta, setIdVenta] = useState(null);
    const [Id_Predio, setIdPredio] = useState("");
    const [Id_Compra, setIdCompra] = useState("");

    const [Fecha, setFecha] = useState("");
    const [PrecioVenta, setPrecioVenta] = useState("");
    const [Porcentaje, setPorcentaje] = useState("");
    const [Comision, setComision] = useState("");
    const [DiasContrato, setDiasContrato] = useState("");
    
    // Busqueda
  const [busqueda, setBusqueda] = useState("");

  const API = `${BASE_URL}`;

  // ============================
  // CARGA INICIAL
  // ============================

  useEffect(() => {
    cargarVentas();
    cargarCarros();
    cargarCompradores();
  }, []);

  const cargarVentas = async () => {
    try {
      const res = await fetch(`${API}/ventas`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setVentas(data);
    } catch (error) {
      console.error("Error cargando ventas", error);
    }
  };

  const cargarCarros = async () => {
    try {
      const res = await fetch(`${API}/carros-predio`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setCarros(data);
    } catch (error) {
      console.error("Error cargando carros", error);
    }
  };

  const cargarCompradores = async () => {
    try {
      const res = await fetch(`${API}/compradores`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setCompradores(data);
    } catch (error) {
      console.error("Error cargando compradores", error);
    }
  };

  // ============================
  // LIMPIAR CAMPOS
  // ============================

  const limpiar = () => {
    setIdVenta(null);
    setIdPredio("");
    setIdCompra("");
    setFecha("");
    setPrecioVenta("");
    setPorcentaje("");
    setComision("");
    setDiasContrato("");

  };

  // ============================
  // SELECCIONAR VENTA
  // ============================

  const seleccionar = (v) => {
    setIdVenta(v.Id_Venta);
    setIdPredio(v.Id_Predio);
    setIdCompra(v.Id_Compra);
    setFecha(v.Fecha);
    setPrecioVenta(v.PrecioVenta);
    setPorcentaje(v.Porcentaje || "");
    setComision(v.Comision || "");
  };

  // ============================
  // GUARDAR / ACTUALIZAR
  // ============================

  const guardar = async () => {
    if (!Id_Predio) return alert("Debe seleccionar un carro.");
    if (!Id_Compra) return alert("Debe seleccionar un comprador.");
    if (!Fecha) return alert("Debe ingresar la fecha.");
    if (!PrecioVenta) return alert("Debe ingresar el precio de venta.");

    // Validar fecha no futura
    const hoy = new Date();
    if (new Date(Fecha) > hoy)
      return alert("La fecha no puede ser mayor a hoy.");

    const body = {
      Id_Predio: parseInt(Id_Predio),
      Id_Compra: parseInt(Id_Compra),
      Fecha,
      PrecioVenta: parseFloat(PrecioVenta),
      Porcentaje: Porcentaje ? parseFloat(Porcentaje) : null,
      Comision: Comision ? parseFloat(Comision) : null,
      DiasContrato: DiasContrato ? parseInt(DiasContrato) : null,
    };

    const metodo = Id_Venta ? "PUT" : "POST";
    const url = Id_Venta ? `${API}/ventas/${Id_Venta}` : `${API}/ventas`;

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("❌ Error: " + data.error);
        return;
      }

      alert("✅ Venta registrada correctamente");
      limpiar();
      cargarVentas();
    } catch (error) {
      alert("❌ Error al registrar venta");
      console.error(error);
    }
  };

  // ============================
  // CÁLCULOS % ↔ COMISIÓN
  // ============================

const manejarPorcentaje = (valor) => {
  setPorcentaje(valor);

  if (valor && PrecioVenta) {
    const com = (parseFloat(PrecioVenta) * parseFloat(valor)) / 100;
    setComision(com.toFixed(2));
  } else {
    setComision("");
  }
};

const manejarComision = (valor) => {
  setComision(valor);

  if (valor && PrecioVenta) {
    const porc = (parseFloat(valor) / parseFloat(PrecioVenta)) * 100;
    setPorcentaje(porc.toFixed(2));
  } else {
    setPorcentaje("");
  }
};

  // ============================
  // RENDER
  // ============================
const ventasFiltradas = ventas.map((v) => {
  const carro = carros.find((c) => c.Id_Predio === v.Id_Predio);
  const comprador = compradores.find((c) => c.Id_Compra === v.Id_Compra);

  return {
    ...v,
    Placa: carro?.Placa || "",
    Modelo: carro?.Modelo || "",
    NombreComprador: comprador?.Nombre || "",
  };
}).filter((v) => {
  const texto = busqueda.toLowerCase();

  return (
    v.Placa.toLowerCase().includes(texto) ||
    v.Modelo.toLowerCase().includes(texto) ||
    v.NombreComprador.toLowerCase().includes(texto) ||
    v.Fecha.toLowerCase().includes(texto)
  );
});


  return (
    <div className="page-container">
      <h1>Registro de Ventas</h1>

      <div className="form-box">

        <label>Carro</label>
        <select value={Id_Predio} onChange={(e) => setIdPredio(e.target.value)}>
          <option value="">Seleccione un carro</option>
          {carros.map((c) => (
            <option key={c.Id_Predio} value={c.Id_Predio}>
              {c.Placa} — {c.Modelo}
            </option>
          ))}
        </select>

        <label>Comprador</label>
        <select value={Id_Compra} onChange={(e) => setIdCompra(e.target.value)}>
          <option value="">Seleccione comprador</option>
          {compradores.map((c) => (
            <option key={c.Id_Compra} value={c.Id_Compra}>
              {c.Nombre}
            </option>
          ))}
        </select>

        <input type="date" value={Fecha} onChange={(e) => setFecha(e.target.value)} />

        <input
          type="number"
          placeholder="Precio Venta"
          value={PrecioVenta}
          onChange={(e) => setPrecioVenta(e.target.value)}
        />
        <div>
  <label>Días para contrato (opcional)</label>
  <input
    type="number"
    value={DiasContrato}
    onChange={(e) => setDiasContrato(e.target.value)}
    placeholder="Ej: 15"
  />
</div>
        <input
          type="number"
          placeholder="Porcentaje (%)"
          value={Porcentaje}
          onChange={(e) => manejarPorcentaje(e.target.value)}
        />

        <input
          type="number"
          placeholder="Comisión"
          value={Comision}
          onChange={(e) => manejarComision(e.target.value)}
        />

        <button className="btn-primary" onClick={guardar}>
          {Id_Venta ? "Actualizar" : "Registrar Venta"}
        </button>
        
        
      </div>
        {/* 🔍 BUSCADOR ARRIBA DEL FORM */}
          <div className="search-row">
            <input
              className="search-input-inside"
              type="text"
              placeholder="Buscar ..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

      <TablaVentas ventas={ventasFiltradas} seleccionar={seleccionar} refrescar={cargarVentas} />
    </div>
  );
}

export default VentasPage;
