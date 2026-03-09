import { useState } from "react";
import { BASE_URL } from "../config";

function BuscadorPage() {
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [resultados, setResultados] = useState([]);

  const API = `${BASE_URL}`;

  const buscar = async () => {
    if (!query.trim()) return alert("Escriba algo para buscar");

    try {

      const res = await fetch(
        `${API}/buscar?tipo=${tipo}&query=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        console.error("Error del servidor");
        setResultados([]);
        return;
      }

      const data = await res.json();

      setResultados(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Error en búsqueda:", error);
      setResultados([]);

    }
  };

  return (
    <div className="page-container">
      <h2>Buscador Global</h2>

      <div className="form-box">
        <input
          placeholder="Escriba para buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="todos">Buscar en todo</option>
          <option value="carros">Carros</option>
          <option value="compradores">Compradores</option>
          <option value="vendedores">Vendedores</option>
          <option value="ventas">Ventas</option>
          <option value="gastos">Gastos</option>
        </select>

        <button className="btn-primary" onClick={buscar}>
          Buscar
        </button>
      </div>

      <div className="results-box">
        {resultados.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          resultados.map((r, i) => (
            <div key={i} className="result-card">

              {/* CARROS */}
              {r.Placa && (
                <>
                  <h4>🚗 Carro</h4>
                  <p><strong>Placa:</strong> {r.Placa}</p>
                  <p><strong>Modelo:</strong> {r.Modelo}</p>
                  <p><strong>Color:</strong> {r.Color}</p>
                  <p><strong>VIN:</strong> {r.Vin}</p>
                </>
              )}

              {/* COMPRADORES */}
              {r.Id_Compra && r.DPI && (
                <>
                  <h4>👤 Comprador</h4>
                  <p><strong>Nombre:</strong> {r.Nombre}</p>
                  <p><strong>Apellido:</strong> {r.Apellido}</p>
                  <p><strong>DPI:</strong> {r.DPI}</p>
                  <p><strong>Teléfono:</strong> {r.Telefono}</p>
                  <p><strong>Precio Venta:</strong> Q{r.PrecioVenta}</p>

                  {r.Foto_DPI && (
                    <img
                      src={r.Foto_DPI}
                      alt="Foto DPI"
                      style={{ width: "120px", borderRadius: "6px", marginTop: "5px" }}
                    />
                  )}
                </>
              )}

              {/* VENDEDORES */}
              {r.Dpi && r.Relacion_Dueno !== undefined && (
                <>
                  <h4>🧑‍💼 Vendedor</h4>
                  <p><strong>Nombre:</strong> {r.Nombre}</p>
                  <p><strong>Teléfono:</strong> {r.Telefono}</p>
                  <p><strong>DPI:</strong> {r.Dpi}</p>
                  <p><strong>Dirección:</strong> {r.Direccion}</p>
                  <p><strong>Relación Dueño:</strong> {r.Relacion_Dueno}</p>
                </>
              )}

              {/* VENTAS */}
              {r.Id_Venta && (
                <>
                  <h4>💵 Venta</h4>
                  <p><strong>ID Venta:</strong> {r.Id_Venta}</p>
                  <p><strong>Fecha:</strong> {r.Fecha}</p>
                  <p><strong>Precio:</strong> Q{r.PrecioVenta}</p>
                  <p><strong>Comisión:</strong> Q{r.Comision}</p>
                </>
              )}

              {/* GASTOS */}
              {(r.Id_Gasto || r.id_gasto) && (
                <>
                  <h4>📄 Gasto</h4>
                  <p><strong>Descripción:</strong> {r.Descripcion}</p>
                  <p><strong>Fecha:</strong> {r.Fecha}</p>
                  <p><strong>Monto:</strong> Q{r.Monto}</p>
                </>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BuscadorPage;