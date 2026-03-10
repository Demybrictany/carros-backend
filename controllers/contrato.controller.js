const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Venta = require("../models/venta.model");

const buildVentaInclude = () => {
  const include = [];

  if (Venta.associations?.Carro) {
    include.push({ association: "Carro" });
  } else if (Venta.associations?.CarroVenta) {
    include.push({ association: "CarroVenta" });
  }

  if (Venta.associations?.Comprador) {
    include.push({ association: "Comprador" });
  }

  return include;
};

// Fixes common UTF-8/Latin1 mojibake sequences if data comes corrupted from DB.
const fixMojibake = (value) => {
  if (typeof value !== "string") return value;

  return value
    .replace(/Ã¡/g, "\u00E1")
    .replace(/Ã©/g, "\u00E9")
    .replace(/Ã­/g, "\u00ED")
    .replace(/Ã³/g, "\u00F3")
    .replace(/Ãº/g, "\u00FA")
    .replace(/Ã\u00B1/g, "\u00F1")
    .replace(/Ã/g, "\u00C1")
    .replace(/Ã‰/g, "\u00C9")
    .replace(/Ã/g, "\u00CD")
    .replace(/Ã“/g, "\u00D3")
    .replace(/Ãš/g, "\u00DA")
    .replace(/Ã‘/g, "\u00D1")
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€˜|â€™/g, "'");
};

exports.generarContrato = async (req, res) => {
  try {
    const { ventaId } = req.params;

    const venta = await Venta.findByPk(ventaId, {
      include: buildVentaInclude(),
    });

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const carro = venta.Carro || venta.CarroVenta || null;
    const comprador = venta.Comprador || null;

    if (!carro) {
      return res.status(400).json({
        error: "La venta no tiene carro asociado",
        detalle: "Revise relaciones/tabla de CarroPredio y llaves foraneas de ventas",
      });
    }

    if (!comprador) {
      return res.status(400).json({
        error: "La venta no tiene comprador asociado",
        detalle: "Revise relaciones/tabla de Comprador y llaves foraneas de ventas",
      });
    }

    const hoyFecha = new Date();
    const fechaIngreso = carro.Fecha_Ingreso ? new Date(carro.Fecha_Ingreso) : null;

    let diasFinales = venta.DiasContrato ?? 0;

    if (fechaIngreso && !Number.isNaN(fechaIngreso.getTime())) {
      const diasPasados = Math.floor((hoyFecha - fechaIngreso) / (1000 * 60 * 60 * 24));
      const traspaso = Number(carro.Tiempo_Traspaso || 0);
      const diasRestantes = Math.max(0, traspaso - diasPasados);
      diasFinales = venta.DiasContrato ?? diasRestantes;
    }

    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.toLocaleString("es-ES", { month: "long" });
    const anio = hoy.getFullYear();

    const doc = new PDFDocument({ margin: 60 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=contrato_${ventaId}.pdf`);

    doc.pipe(res);

    const logoPath = path.join(__dirname, "..", "imagenes", "Logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 420, 30, { width: 120 });
    }

    doc.font("Times-Bold").fontSize(16).text("", 60, 90, {
      width: 350,
      align: "center",
    });

    doc.moveDown(4);

    doc
      .font("Times-Roman")
      .fontSize(12)
      .text(`Quetzaltenango, ${dia} de ${mes} de ${anio}`, { align: "right" });

    doc.moveDown(2);

    const gerenteNombre = "Derick Isaac de Le\u00F3n R\u00EDos";
    const gerenteDpi = "3147-84071-0901";

    const modelo = fixMojibake(carro.Modelo || "");
    const placa = fixMojibake(carro.Placa || "");
    const chasis = fixMojibake(carro.Num_Chasis || "");
    const motor = fixMojibake(carro.Num_Motor || "");
    const color = fixMojibake(carro.Color || "");
    const nombreComprador = fixMojibake(comprador.Nombre || "");
    const apellidoComprador = fixMojibake(comprador.Apellido || "");

    doc
      .font("Times-Roman")
      .fontSize(12)
      .text(
        `Por medio de la presente Yo ${gerenteNombre}, con n\u00FAmero de DPI ${gerenteDpi}, ` +
          `hago entrega del veh\u00EDculo:\n\n` +
          `Marca/Modelo: ${modelo}\n` +
          `A\u00F1o: ${carro.Anio}\n` +
          `Placas: ${placa}\n` +
          `Chasis: ${chasis}\n` +
          `N\u00FAmero de motor: ${motor}\n` +
          `Color: ${color}\n\n` +
          `El cual se encuentra a nombre de ${nombreComprador} ${apellidoComprador}, ` +
          `quien se identifica con n\u00FAmero de DPI ${comprador.DPI}. Se entrega el veh\u00EDculo con todos sus accesorios, ` +
          `incluyendo tarjeta de circulaci\u00F3n, t\u00EDtulo, llave y DPI.\n\n`,
        { align: "justify" }
      );

    doc.text(
      `Yo ${nombreComprador} ${apellidoComprador}, con n\u00FAmero de DPI ${comprador.DPI}, ` +
        `acepto el veh\u00EDculo en el estado en que se encuentra. Sin hacer responsable a Puchys Imports ` +
        `ni a su gerente ${gerenteNombre}, quien se identifica con DPI ${gerenteDpi}, por fallas en motor, caja, ` +
        `suspensi\u00F3n o cualquier otra aver\u00EDa tras revisi\u00F3n mec\u00E1nica.\n\n`,
      { align: "justify" }
    );

    doc.text(
      `La presente deslinda al gerente de Puchys Imports, ${gerenteNombre}, de cualquier responsabilidad civil, ` +
        `penal o de tr\u00E1nsito, as\u00ED como cualquier alteraci\u00F3n en el veh\u00EDculo a partir de la fecha de entrega. ` +
        `Se otorga un plazo de ${diasFinales} d\u00EDas para realizar el respectivo traspaso.\n\n`,
      { align: "justify" }
    );

    doc.text("Estando ambas partes de acuerdo, firman para constancia:\n\n");

    doc.moveDown(4);

    const yFirmas = doc.y;

    doc.moveTo(80, yFirmas).lineTo(250, yFirmas).stroke();
    doc.moveTo(330, yFirmas).lineTo(500, yFirmas).stroke();

    doc.text("Cliente", 130, yFirmas + 5);
    doc.text("Gerente", 390, yFirmas + 5);

    doc.end();
  } catch (error) {
    console.error("ERROR CONTRATO:", error);
    res.status(500).json({
      error: "Error generando contrato",
      detalle: error.message,
    });
  }
};
