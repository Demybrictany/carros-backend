import React from "react";

const GenericForm = ({ vendedor, onChange, onSubmit, modo }) => {
  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>{modo === "crear" ? "Agregar Vendedor" : "Editar Vendedor"}</h2>

      <div>
        <label>Id_Vendedor</label>
        <input type="text" value={vendedor.Id_Vendedor || ""} readOnly disabled />
      </div>

      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="Nombre"
          value={vendedor.Nombre || ""}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <label>Telefono</label>
        <input
          type="text"
          name="Telefono"
          value={vendedor.Telefono || ""}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <label>DPI</label>
        <input
          type="text"
          name="Dpi"
          value={vendedor.Dpi || ""}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <label>Foto DPI</label>
        <input type="file" name="Foto_DPI" onChange={onChange} />

        {vendedor.Foto_DPI_Url && (
          <img
            src={vendedor.Foto_DPI_Url}
            alt="Foto DPI"
            width={100}
            style={{ marginTop: "10px" }}
          />
        )}
      </div>

      <div>
        <label>Direccion</label>
        <input
          type="text"
          name="Direccion"
          value={vendedor.Direccion || ""}
          onChange={onChange}
        />
      </div>

      <div>
        <label>Relacion Dueño</label>
        <input
          type="text"
          name="Relacion_Dueño"
          value={vendedor.Relacion_Dueño || ""}
          onChange={onChange}
        />
      </div>

      <div>
        <label>Tiempo Traspaso</label>
        <input
          type="text"
          name="Tiempo_Traspaso"
          value={vendedor.Tiempo_Traspaso || ""}
          onChange={onChange}
        />
      </div>

      <button type="submit">
        {modo === "crear" ? "Guardar" : "Actualizar"}
      </button>
    </form>
  );
};

export default GenericForm;
