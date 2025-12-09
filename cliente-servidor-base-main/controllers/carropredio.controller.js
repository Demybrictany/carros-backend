const Carro = require("../models/carropredio.model");
const Vendedor = require("../models/vendedor.model");
const Comprador = require("../models/comprador.model");

// Obtener todos los carros
exports.obtenerCarros = async (req, res) => {
  try {
    const data = await Carro.findAll({
      include: [
        { model: Vendedor, as: "Vendedor" },
        { model: Comprador, as: "Comprador" }
      ]
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener carros" });
  }
};

// Obtener uno
exports.obtenerCarro = async (req, res) => {
  try {
    const data = await Carro.findByPk(req.params.id, {
      include: [
        { model: Vendedor, as: "Vendedor" },
        { model: Comprador, as: "Comprador" }
      ]
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carro" });
  }
};

// Crear carro
exports.crearCarro = async (req, res) => {
  try {
    const data = await Carro.create(req.body);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear carro" });
  }
};

// Actualizar carro
exports.actualizarCarro = async (req, res) => {
  try {
    await Carro.update(req.body, { where: { Id_Predio: req.params.id } });
    res.json({ mensaje: "Carro actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carro" });
  }
};

// Eliminar
exports.eliminarCarro = async (req, res) => {
  try {
    await Carro.destroy({ where: { Id_Predio: req.params.id } });
    res.json({ mensaje: "Carro eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar carro" });
  }
};
