import { useState } from "react";
import { BASE_URL } from "../../config";


const BotonContrato = ({ idVenta }) => {
  const API = "${BASE_URL}/contrato";

  const [urlContrato, setUrlContrato] = useState(null);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  // ============================
  //   GENERAR O REEMPLAZAR PDF
  // ============================
  const generarContrato = async () => {
    const res = await fetch(`${API}/${idVenta}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    setUrlContrato(url);

    // Descargar automáticamente
    const link = document.createElement("a");
    link.href = url;
    link.download = `contrato_${idVenta}.pdf`;
    link.click();

    alert("Contrato generado correctamente");
    setMostrarOpciones(false);
  };

  // ============================
  //   CLICK AL BOTÓN PRINCIPAL
  // ============================
  const handleClick = () => {
    if (!urlContrato) {
      generarContrato(); // primera vez
    } else {
      setMostrarOpciones(true); // ya existe → abrir menú
    }
  };

  // ============================
  //   DESCARGAR ARCHIVO EXISTENTE
  // ============================
  const descargar = () => {
    if (!urlContrato) return;
    const link = document.createElement("a");
    link.href = urlContrato;
    link.download = `contrato_${idVenta}.pdf`;
    link.click();
  };

  // ============================
  //   IMPRIMIR ARCHIVO EXISTENTE
  // ============================
  const imprimir = () => {
    if (!urlContrato) return;
    window.open(urlContrato, "_blank");
  };

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={handleClick}
        style={{ marginLeft: "5px" }}
      >
        Contrato
      </button>

      {mostrarOpciones && (
        <div className="modal-contrato">
          <div className="modal-content">
            <h3>Contrato ya generado</h3>

            <button onClick={generarContrato}>🔄 Reemplazar contrato</button>
            <button onClick={descargar}>📥 Descargar nuevamente</button>
            <button onClick={imprimir}>🖨 Imprimir</button>

            <button onClick={() => setMostrarOpciones(false)}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BotonContrato;
