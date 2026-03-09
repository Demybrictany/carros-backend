import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

// ✅ PUERTO REAL DEL BACKEND
const API = `${BASE_URL}/estadisticas`;

function EstadisticasPage() {
  const [hoy, setHoy] = useState(0);
  const [mes, setMes] = useState(0);
  const [anio, setAnio] = useState(0);
  const [gananciasCarro, setGananciasCarro] = useState([]);

  useEffect(() => {
    // TOTAL HOY
    fetch(`${API}/ventas-hoy`)
      .then(res => res.json())
      .then(data => setHoy(data[0]?.TotalVendido || 0))
      .catch(console.error);

    // TOTAL MES
    fetch(`${API}/ventas-mes`)
      .then(res => res.json())
      .then(data => setMes(data[0]?.TotalVendido || 0))
      .catch(console.error);

    // TOTAL ANUAL
    fetch(`${API}/ventas-anual`)
      .then(res => res.json())
      .then(data => setAnio(data[0]?.TotalVendido || 0))
      .catch(console.error);

    // GANANCIA POR CARRO
    fetch(`${API}/ganancia-por-carro`)
      .then(res => res.json())
      .then(setGananciasCarro)
      .catch(console.error);
  }, []);

  // carros con pérdida
  const carrosPerdida = gananciasCarro.filter(
    c => Number(c.Ganancia) < 0
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Estadísticas</h2>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <Card title="Total vendido hoy" value={`Q ${Number(hoy).toFixed(2)}`} />
        <Card title="Total vendido este mes" value={`Q ${Number(mes).toFixed(2)}`} />
        <Card title="Total vendido anual" value={`Q ${Number(anio).toFixed(2)}`} />
      </div>

      <h3>🚗 Ganancias por carro</h3>
      <table border="1" cellPadding="6" width="100%">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Compra</th>
            <th>Venta</th>
            <th>Gastos</th>
            <th>Ganancia</th>
          </tr>
        </thead>
        <tbody>
          {gananciasCarro.map((c, i) => (
            <tr key={i}>
              <td>{c.Placa}</td>
              <td>Q {Number(c.TotalComprado).toFixed(2)}</td>
              <td>Q {Number(c.TotalVendido).toFixed(2)}</td>
              <td>Q {Number(c.Gastos).toFixed(2)}</td>
              <td style={{ color: c.Ganancia < 0 ? "red" : "green" }}>
                Q {Number(c.Ganancia).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "25px", color: "red" }}>❌ Carros con pérdida</h3>
      <table border="1" cellPadding="6" width="100%">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Ganancia</th>
          </tr>
        </thead>
        <tbody>
          {carrosPerdida.map((c, i) => (
            <tr key={i} style={{ color: "red" }}>
              <td>{c.Placa}</td>
              <td>Q {Number(c.Ganancia).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ffffff",
        padding: "15px",
        minWidth: "200px",
        borderRadius: "8px"
      }}
    >
      <h4>{title}</h4>
      <strong>{value}</strong>
    </div>
  );
}

export default EstadisticasPage;
