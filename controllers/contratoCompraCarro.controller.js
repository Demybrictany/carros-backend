const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const CarroPredio = require("../models/carropredio.model");
const Vendedor = require("../models/vendedor.model");
const DuenoCarro = require("../models/duenocarro.model");

const nombreCompleto = (persona) => {
  if (!persona) return "N/A";

  return [persona.Nombre, persona.Apellido].filter(Boolean).join(" ") || "N/A";
};

const dpiPersona = (persona) => persona?.Dpi || persona?.DPI || "N/A";
const telefonoPersona = (persona) => persona?.Telefono || "N/A";

exports.generarContratoCompraCarro = async (req, res) => {
  try {
    const { idPredio } = req.params;

    const carro = await CarroPredio.findByPk(idPredio, {
      include: [
        { model: Vendedor, as: "Vendedor", required: false },
        { model: DuenoCarro, as: "dueno", required: false }
      ]
    });

    if (!carro) {
      return res.status(404).json({ error: "Carro no encontrado" });
    }

    if (!carro.dueno) {
      return res.status(400).json({ error: "El carro no tiene dueño asignado" });
    }

    const vendedor = carro.Vendedor || null;
    const dueno = carro.dueno;
    const responsable = vendedor || dueno;
    const tipoResponsable = vendedor ? "vendedor" : "dueño";

    const hoy = new Date();
    const fechaActual = hoy.toLocaleDateString("es-GT");

    const fechaCompra = carro.Fecha_Ingreso
      ? new Date(carro.Fecha_Ingreso).toLocaleDateString("es-GT")
      : "N/A";

    const fileName = `Contrato_Compra_${idPredio}.pdf`;

    // ============================
    // 📄 CREACIÓN PDF SIN GUARDAR
    // ============================
    const doc = new PDFDocument({ margin: 60 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}`
    );

    doc.pipe(res);

    // ============================
    // 🖼 LOGO (ARRIBA DERECHA)
    // ============================
    const logoPath = path.join(__dirname, "..", "imagenes", "Logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 400, 30, { width: 140 });
    }

    // ============================
    // TÍTULO
    // ============================
    doc.moveDown(2);
    doc.font("Times-Bold")
    .fontSize(16)
    .text("DOCUMENTO DE COMPRAVENTA", 60, doc.y, {
      width: 350,
      align: "center"
      });

    doc.moveDown(2);

    doc.font("Times-Roman").fontSize(12);

    // ============================
    // ENCABEZADO
    // ============================
    doc.text(
      `Yo, Derick Isaac de León Ríos con no. de DPI: 3147-84071-0901.`,
      { align: "justify" }
    );

    doc.moveDown(0.5);

    doc.text(
      "Por este medio hago constar la compra del siguiente vehículo:",
      { align: "justify" }
    );

    doc.moveDown(1.5);

    // ============================
    // DATOS VEHÍCULO
    // ============================

    doc.font("Times-Bold").text("DATOS DEL VEHÍCULO");
    doc.moveDown(0.5);
    doc.font("Times-Roman");

    doc.text(`Modelo: ${carro.Modelo || "N/A"}`);
    doc.text(`Placa: ${carro.Placa || "N/A"}`);
    doc.text(`No. Motor: ${carro.Num_Motor || "N/A"}`);
    doc.text(`Color: ${carro.Color || "N/A"}`);
    doc.text(`No. Chasis: ${carro.Num_Chasis || "N/A"}`);
    doc.text(`Fecha de compra: ${fechaCompra}`);

    doc.moveDown(1.5);

    // ============================
    // DATOS VENDEDOR
    // ============================

    doc.font("Times-Bold").text("DATOS DEL VENDEDOR");
    doc.moveDown(0.5);
    doc.font("Times-Roman");

    doc.text(
      `Nombre: ${nombreCompleto(vendedor)}`
    );
    doc.text(
      `DPI: ${dpiPersona(vendedor)}`
    );
    doc.text(
      `Teléfono: ${telefonoPersona(vendedor)}`
    );
    doc.text(
      `Plazo de traspaso: ${carro.Tiempo_Traspaso || 0} días`
    );

    doc.moveDown(1.5);

    // ============================
    // DATOS DUEÑO
    // ============================

    doc.font("Times-Bold").text("DATOS DEL DUEÑO");
    doc.moveDown(0.5);
    doc.font("Times-Roman");

    doc.text(`Nombre: ${nombreCompleto(dueno)}`);
    doc.text(`DPI: ${dpiPersona(dueno)}`);
    doc.text(`Teléfono: ${telefonoPersona(dueno)}`);
    doc.text(`Dirección: ${dueno.Direccion || "N/A"}`);

    doc.moveDown(1.5);

    // ============================
    // CLAUSULA LEGAL
    // ============================

    doc.text(
      `A partir de esta fecha yo Derick Isaac de León Ríos quedo desligado de cualquier trámite legal, alteración o problema con documentación, ya que el señor(a) ${nombreCompleto(responsable)}, en calidad de ${tipoResponsable}, asegura que dicho vehículo está totalmente en orden y que el motor y caja se encuentran en buen estado.`,
      { align: "justify" }
    );

    doc.moveDown();

    doc.text(
      `En caso de existir alguna anomalía, se anula la compra y se solicita el reembolso absoluto en un rango máximo de 24 horas. En caso de incumplimiento, se procederá legalmente.`,
      { align: "justify" }
    );

    doc.moveDown(3);

    // ============================
    // ✍ FIRMAS EN LA MISMA LÍNEA
    // ============================

    const yFirmas = doc.y;

    doc.moveTo(80, yFirmas)
      .lineTo(250, yFirmas)
      .stroke();

    doc.moveTo(330, yFirmas)
      .lineTo(500, yFirmas)
      .stroke();

    doc.text("Comprador", 120, yFirmas + 5);
    doc.text(vendedor ? "Vendedor" : "Dueño", 380, yFirmas + 5);

    doc.moveDown(3);

    doc.text(`Fecha de emisión: ${fechaActual}`, { align: "right" });

    doc.end();

  } catch (error) {
    console.error("ERROR COMPLETO:", error);
    res.status(500).json({
      error: "Error generando contrato",
      detalle: error.message
    });
  }
};
