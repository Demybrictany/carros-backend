import { useState, useEffect } from "react";
import TablaGastos from "../Components/tablas/TablaGastos";
import { BASE_URL } from "../config";

function GastosPage() {
  const [gastos, setGastos] = useState([]);
  const [carros, setCarros] = useState([]);

  const [Id_Gastos, setId] = useState(null);
  const [Descripcion, setDescripcion] = useState("");
  const [Monto, setMonto] = useState("");
  const [Fecha, setFecha] = useState("");
  const [Id_Predio, setIdPredio] = useState("");

  
  useEffect(() => {
    cargarGastos();
    cargarCarros();
  }, []);

  const cargarGastos = () => {
    fetch(`${BASE_URL}/gastos`)
      .then((res) => res.json())
      .then((data) => setGastos(data));
  };

  const cargarCarros = () => {
    fetch(`${BASE_URL}/carros-predio`)
      .then((res) => res.json())
      .then((data) => setCarros(data));
  };

  const limpiar = () => {
    setId(null);
    setDescripcion("");
    setMonto("");
    setFecha("");
    setIdPredio("");
  };

  const guardar = async () => {
    if (!Descripcion.trim()) return alert("La descripción es obligatoria");
    if (!Monto) return alert("El monto es obligatorio");
    if (!Fecha) return alert("La fecha es obligatoria");

    const body = {
      Descripcion,
      Monto: parseFloat(Monto),
      Fecha,
      Id_Predio: Id_Predio ? parseInt(Id_Predio) : null
    };

    const url = Id_Gastos
      ? `${BASE_URL}/gastos/${Id_Gastos}`
      : `${BASE_URL}/gastos`;

    await fetch(url, {
      method: Id_Gastos ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    limpiar();
    cargarGastos();
  };

  const seleccionar = (g) => {
    setId(g.Id_Gastos);
    setDescripcion(g.Descripcion);
    setMonto(g.Monto);
    setFecha(g.Fecha);
    setIdPredio(g.Id_Predio || "");
  };

  return (
    <div className="page-container">
      <h1>Gestión de Gastos</h1>

      <div className="form-box">

        <input
          placeholder="Descripción"
          value={Descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="number"
          placeholder="Monto"
          value={Monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <input
          type="date"
          value={Fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <label>Carro (opcional)</label>
        <select value={Id_Predio} onChange={(e) => setIdPredio(e.target.value)}>
          <option value="">Gasto general</option>
          {carros.map((c) => (
            <option key={c.Id_Predio} value={c.Id_Predio}>
              {c.Placa} - {c.Modelo}
            </option>
          ))}
        </select>

        <button className="btn-primary" onClick={guardar}>
          {Id_Gastos ? "Actualizar" : "Agregar"}
        </button>

      </div>

      <TablaGastos gastos={gastos} seleccionar={seleccionar} refrescar={cargarGastos} />
    </div>
  );
}

export default GastosPage;
