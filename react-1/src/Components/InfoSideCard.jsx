import "./InfoSideCard.css";

function InfoSideCard({ data, titulo }) {
  if (!data) {
    return (
      <div className="info-sidecard">
        <p className="info-empty">No hay datos seleccionados</p>
      </div>
    );
  }

  return (
    <div className="info-sidecard">

      {/* Encabezado con icono */}
      <div className="info-header">
        <div className="info-icon">🗒️</div>
        <h3 className="info-title">{titulo}</h3>
      </div>

      {/* Nombre */}
      <div className="info-block">
        <p className="info-label">Nombre</p>
        <p className="info-value">{data.Nombre}</p>
      </div>

      {/* Apellido */}
      <div className="info-block">
        <p className="info-label">Apellido</p>
        <p className="info-value">{data.Apellido}</p>
      </div>

      {/* DPI */}
      <div className="info-block">
        <p className="info-label">DPI</p>
        <p className="info-value">{data.Dpi || data.DPI}</p>
      </div>

      {/* Telefono si existe */}
      {data.Telefono && (
        <div className="info-block">
          <p className="info-label">Teléfono</p>
          <p className="info-value">{data.Telefono}</p>
        </div>
      )}

    </div>
  );
}

export default InfoSideCard;
