import React, { useState } from "react";
import { updateVenta } from "../../services/api";

export default function ModalEditarVenta({ venta, compradores, cerrar, refrescar }) {

  const [form, setForm] = useState({ ...venta });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevo = { ...form, [name]: value };

    if (name === "Porcentaje" && value !== "") {
      nuevo.Comision = ((nuevo.PrecioVenta * value) / 100).toFixed(2);
    }

    if (name === "Comision" && value !== "") {
      nuevo.Porcentaje = ((value / nuevo.PrecioVenta) * 100).toFixed(2);
    }

    setForm(nuevo);
  };

  const actualizar = async () => {
    try {

      await updateVenta(venta.Id_Venta, form);

      alert("Venta actualizada.");

      refrescar();
      cerrar();

    } catch (err) {
      console.error(err);
      alert("Error al actualizar.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-4 shadow">

        <h4>Editar Venta #{venta.Id_Venta}</h4>

        <label>Comprador</label>
        <select
          name="Id_Compra"
          className="form-control"
          value={form.Id_Compra}
          onChange={handleChange}
        >
          {compradores.map((c) => (
            <option key={c.Id_Compra} value={c.Id_Compra}>
              {c.Nombre}
            </option>
          ))}
        </select>

        <label className="mt-3">Fecha</label>
        <input
          type="date"
          name="Fecha"
          className="form-control"
          value={form.Fecha}
          onChange={handleChange}
        />

        <label className="mt-3">Precio Venta</label>
        <input
          name="PrecioVenta"
          className="form-control"
          value={form.PrecioVenta}
          onChange={handleChange}
        />

        <label className="mt-3">Porcentaje</label>
        <input
          name="Porcentaje"
          className="form-control"
          value={form.Porcentaje}
          onChange={handleChange}
        />

        <label className="mt-3">Comisión</label>
        <input
          name="Comision"
          className="form-control"
          value={form.Comision}
          onChange={handleChange}
        />

        <div className="mt-4 d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={cerrar}>
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={actualizar}>
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}