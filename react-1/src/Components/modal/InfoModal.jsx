function InfoModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Información</h2>

        {"Foto_DPI" in data && data.Foto_DPI && (
          <img 
            src={data.Foto_DPI} 
            alt="Foto DPI"
            style={{ width: "120px", borderRadius: "10px", marginBottom: "10px" }}
          />
        )}

        <p><strong>Nombre:</strong> {data.Nombre}</p>

        {data.Apellido && <p><strong>Apellido:</strong> {data.Apellido}</p>}
        {data.Telefono && <p><strong>Teléfono:</strong> {data.Telefono}</p>}
        {data.Dpi && <p><strong>DPI:</strong> {data.Dpi}</p>}
        {data.PrecioVenta && <p><strong>Precio Venta:</strong> Q{data.PrecioVenta}</p>}

        <button className="btn-primary" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default InfoModal;
