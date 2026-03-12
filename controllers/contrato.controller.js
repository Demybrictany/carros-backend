const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Venta = require("../models/venta.model");

const buildVentaInclude = () => {
  const include = [];

  const addCarroInclude = (associationName) => {
    const includeItem = { association: associationName };

    // Si el modelo tiene una asociación con Vendedor, la incluimos para poder usarla en el contrato
    const assoc = Venta.associations?.[associationName];
    if (assoc?.target?.associations?.Vendedor) {
      includeItem.include = [{ association: "Vendedor" }];
    }

    return includeItem;
  };

  if (Venta.associations?.Carro) {
    include.push(addCarroInclude("Carro"));
  } else if (Venta.associations?.CarroVenta) {
    include.push(addCarroInclude("CarroVenta"));
  }

  if (Venta.associations?.Comprador) {
    include.push({ association: "Comprador" });
  }

  return include;
};

// Corrige caracteres raros
const fixMojibake = (text) => {
  if (!text || typeof text !== "string") return text;

  return text
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã/g, "Á")
    .replace(/Ã‰/g, "É")
    .replace(/Ã/g, "Í")
    .replace(/Ã“/g, "Ó")
    .replace(/Ãš/g, "Ú")
    .replace(/Ã‘/g, "Ñ")
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€˜/g, "'")
    .replace(/â€™/g, "'");
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
    const vendedor = carro?.Vendedor || null;

    if (!carro) {
      return res.status(400).json({
        error: "La venta no tiene carro asociado",
      });
    }

    if (!comprador) {
      return res.status(400).json({
        error: "La venta no tiene comprador asociado",
      });
    }

    if (!vendedor) {
      return res.status(400).json({
        error: "La venta no tiene vendedor asociado",
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
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contrato_${ventaId}.pdf`
    );

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

    const gerenteNombre = "Derick Isaac de León Ríos";
    const gerenteDpi = "3147-84071-0901";

    const modelo = fixMojibake(carro.Modelo ?? "");
    const placa = fixMojibake(carro.Placa ?? "");
    const chasis = fixMojibake(carro.Num_Chasis ?? "");
    const motor = fixMojibake(carro.Num_Motor ?? "");
    const color = fixMojibake(carro.Color ?? "");

    const nombreComprador = fixMojibake(comprador.Nombre ?? "");
    const apellidoComprador = fixMojibake(comprador.Apellido ?? "");
    const dpiComprador = fixMojibake(comprador.DPI ?? "");

    const nombreVendedor = fixMojibake(vendedor.Nombre ?? "");
    const apellidoVendedor = fixMojibake(vendedor.Apellido ?? "");
    const dpiVendedor = fixMojibake(vendedor.Dpi ?? "");

    doc
      .font("Times-Roman")
      .fontSize(12)
      .text(
        `Por medio de la presente Yo ${gerenteNombre}, con número de DPI ${gerenteDpi}, hago entrega del vehículo:\n\n` +
          `Marca/Modelo: ${modelo}\n` +
          `Año: ${carro.Anio}\n` +
          `Placas: ${placa}\n` +
          `Chasis: ${chasis}\n` +
          `Número de motor: ${motor}\n` +
          `Color: ${color}\n\n` +
          `El cual se encuentra a nombre de ${nombreVendedor} ${apellidoVendedor}, quien se identifica con número de DPI ${dpiVendedor}. ` +
          `Se entrega el vehículo con todos sus accesorios, incluyendo tarjeta de circulación, título, llave y DPI.\n\n`,
        { align: "justify" }
        
      );

    doc.text(
      `Yo ${nombreComprador} ${apellidoComprador}, con número de DPI ${dpiComprador}, acepto el vehículo en el estado en que se encuentra. ` +
        `Sin hacer responsable a Puchys Imports ni a su gerente ${gerenteNombre}, quien se identifica con DPI ${gerenteDpi}, ` +
        `por fallas en motor, caja, suspensión o cualquier otra avería tras revisión mecánica.\n\n`,
      { align: "justify" }
    );

    doc.text(
      `La presente deslinda al gerente de Puchys Imports, ${gerenteNombre}, de cualquier responsabilidad civil, penal o de tránsito, ` +
        `así como cualquier alteración en el vehículo a partir de la fecha de entrega. Se otorga un plazo de ${diasFinales} días ` +
        `para realizar el respectivo traspaso.\n\n`,
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