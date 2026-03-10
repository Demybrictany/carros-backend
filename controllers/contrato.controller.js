const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");
const Vendedor = require("../models/vendedor.model");

exports.generarContrato = async (req, res) => {
  try {
    const { ventaId } = req.params;

    // ============================
    // ðŸ” BUSCAR DATOS DE LA VENTA
    // ============================
    const venta = await Venta.findByPk(ventaId, {
      include: [
        { model: CarroPredio, as: "Carro" },
        { model: Comprador, as: "Comprador" }
      ]
    });

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const carro = venta.Carro;
    const comprador = venta.Comprador;

    // ============================
    // CALCULAR DÃAS RESTANTES
    // ============================
    const hoyFecha = new Date();
    const fechaIngreso = new Date(carro.Fecha_Ingreso);

    const diasPasados = Math.floor(
      (hoyFecha - fechaIngreso) / (1000 * 60 * 60 * 24)
    );

    let diasRestantes = carro.Tiempo_Traspaso - diasPasados;
    if (diasRestantes < 0) diasRestantes = 0;

    let diasFinales = diasRestantes;

    if (
      venta.DiasContrato !== null &&
      venta.DiasContrato !== undefined
    ) {
      diasFinales = venta.DiasContrato;
    }

    // ============================
    // ðŸ“… FECHA DEL CONTRATO
    // ============================
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.toLocaleString("es-ES", { month: "long" });
    const anio = hoy.getFullYear();

    // ============================
    // ðŸ“„ CREACIÃ“N DE PDF (SIN GUARDAR EN DISCO)
    // ============================
    const doc = new PDFDocument({ margin: 60 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=contrato_${ventaId}.pdf`
    );

    doc.pipe(res);

    // ============================
    // ðŸ–¼ LOGO (ARRIBA DERECHA)
    // ============================
    const logoPath = path.join(__dirname, "..", "imagenes", "Logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 420, 30, { width: 120 });
    }

    // ============================
    // TÃTULO
    // ============================
    doc.font("Times-Bold")
      .fontSize(16)
      .text("", 60, 90, {
        width: 350,
        align: "center"
      });

    doc.moveDown(4);

    // ============================
    // ðŸ“Œ FECHA
    // ============================
    doc.font("Times-Roman")
      .fontSize(12)
      .text(
        `Quetzaltenango, ${dia} de ${mes} de ${anio}`,
        { align: "right" }
      );

    doc.moveDown(2);

    // ============================
    // ðŸ” DATOS FIJOS DEL GERENTE
    // ============================
    const gerenteNombre = "Derick Isaac de LeÃ³n RÃ­os";
    const gerenteDpi = "3147-84071-0901";

    // ============================
    // ðŸ“Œ TEXTO DEL CONTRATO
    // ============================
    doc.font("Times-Roman")
      .fontSize(12)
      .text(
        `Por medio de la presente Yo ${gerenteNombre}, con nÃºmero de DPI ${gerenteDpi}, ` +
        `hago entrega del vehÃ­culo:\n\n` +
        `Marca/Modelo: ${carro.Modelo}\n` +
        `AÃ±o: ${carro.Anio}\n` +
        `Placas: ${carro.Placa}\n` +
        `Chasis: ${carro.Num_Chasis}\n` +
        `NÃºmero de motor: ${carro.Num_Motor}\n` +
        `Color: ${carro.Color}\n\n` +
        `El cual se encuentra a nombre de ${comprador.Nombre} ${comprador.Apellido}, ` +
        `quien se identifica con nÃºmero de DPI ${comprador.DPI}. Se entrega el vehÃ­culo con todos sus accesorios, ` +
        `incluyendo tarjeta de circulaciÃ³n, tÃ­tulo, llave y DPI.\n\n`,
        { align: "justify" }
      );

    doc.text(
      `Yo ${comprador.Nombre} ${comprador.Apellido}, con nÃºmero de DPI ${comprador.DPI}, ` +
      `acepto el vehÃ­culo en el estado en que se encuentra. Sin hacer responsable a Puchys Imports ` +
      `ni a su gerente ${gerenteNombre}, quien se identifica con DPI ${gerenteDpi}, por fallas en motor, caja, ` +
      `suspensiÃ³n o cualquier otra averÃ­a tras revisiÃ³n mecÃ¡nica.\n\n`,
      { align: "justify" }
    );

    doc.text(
      `La presente deslinda al gerente de Puchys Imports, ${gerenteNombre}, de cualquier responsabilidad civil, ` +
      `penal o de trÃ¡nsito, asÃ­ como cualquier alteraciÃ³n en el vehÃ­culo a partir de la fecha de entrega. ` +
      `Se otorga un plazo de ${diasFinales} dÃ­as para realizar el respectivo traspaso.\n\n`,
      { align: "justify" }
    );

    doc.text(
      `Estando ambas partes de acuerdo, firman para constancia:\n\n`
    );

    // ============================
    // âœ FIRMAS AL MISMO NIVEL
    // ============================
    doc.moveDown(4);

    const yFirmas = doc.y;

    doc.moveTo(80, yFirmas)
      .lineTo(250, yFirmas)
      .stroke();

    doc.moveTo(330, yFirmas)
      .lineTo(500, yFirmas)
      .stroke();

    doc.text("Cliente", 130, yFirmas + 5);
    doc.text("Gerente", 390, yFirmas + 5);

    doc.end();

  } catch (error) {
    console.error("ERROR CONTRATO:", error);
    res.status(500).json({
      error: "Error generando contrato"
    });
  }
};
