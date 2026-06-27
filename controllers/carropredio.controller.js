const Carro = require("../models/carropredio.model");
const Vendedor = require("../models/vendedor.model");
const Comprador = require("../models/comprador.model");
const DuenoCarro = require("../models/duenocarro.model");

// =========================
// Obtener todos los carros
// =========================
exports.obtenerCarros = async (req, res) => {
  try {
    const data = await Carro.findAll({
      include: [
        { model: Vendedor, as: "Vendedor" },
        { model: Comprador, as: "Comprador" },
        { model: DuenoCarro, as: "dueno" }
      ]
    });

    const hoy = new Date();

    const dataConDias = data.map(carro => {

      const fechaIngreso = new Date(carro.Fecha_Ingreso);

      const diasPasados = Math.floor(
        (hoy - fechaIngreso) / (1000 * 60 * 60 * 24)
      );

      const diasRestantes = carro.Tiempo_Traspaso - diasPasados;

      return {
        ...carro.toJSON(),
        dias_restantes: diasRestantes,
        vencido: diasRestantes <= 0
      };
    });

    res.json(dataConDias);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener carros" });
  }
};


// =========================
// Obtener uno
// =========================
exports.obtenerCarro = async (req, res) => {
  try {
    const carro = await Carro.findByPk(req.params.id, {
      include: [
        { model: Vendedor, as: "Vendedor" },
        { model: Comprador, as: "Comprador" },
        { model: DuenoCarro, as: "dueno" }
      ]
    });

    const hoy = new Date();
    const fechaIngreso = new Date(carro.Fecha_Ingreso);

    const diasPasados = Math.floor(
      (hoy - fechaIngreso) / (1000 * 60 * 60 * 24)
    );

    const diasRestantes = carro.Tiempo_Traspaso - diasPasados;

    res.json({
      ...carro.toJSON(),
      dias_restantes: diasRestantes,
      vencido: diasRestantes <= 0
    });

  } catch (error) {
    res.status(500).json({ error: "Error al obtener carro" });
  }
};


// =========================
// Crear carro
// =========================
exports.crearCarro = async (req, res) => {
  try {

    const {
      Placa,
      Modelo,
      Anio,
      FotoCarro,
      Precio_Compra,
      Vin,
      Num_Motor,
      Num_Chasis,
      Color,
      Id_Vendedor,
      Id_Dueno_Carro,
      Id_Compra,
      Tiempo_Traspaso
    } = req.body;

    const data = await Carro.create({
      Placa,
      Modelo,
      Anio,
      FotoCarro,
      Precio_Compra,
      Vin,
      Num_Motor,
      Num_Chasis,
      Color,
      Id_Vendedor,
      Id_Dueno_Carro,
      Id_Compra,
      Tiempo_Traspaso,
      Fecha_Ingreso: new Date() // 🔥 se guarda automático
    });

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear carro" });
  }
};


// =========================
// Actualizar carro
// =========================
exports.actualizarCarro = async (req, res) => {
  try {
    const datosActualizados = {
      ...req.body,
      Id_Dueno_Carro: req.body.Id_Dueno_Carro
    };

    await Carro.update(datosActualizados, { where: { Id_Predio: req.params.id } });
    res.json({ mensaje: "Carro actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carro" });
  }
};


// =========================
// Eliminar
// =========================
exports.eliminarCarro = async (req, res) => {
  try {
    await Carro.destroy({ where: { Id_Predio: req.params.id } });
    res.json({ mensaje: "Carro eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar carro" });
  }
};
