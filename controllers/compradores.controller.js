const Comprador = require("../models/comprador.model");

// Obtener todos
exports.obtenerCompradores = async (req, res) => {
  try {
    const datos = await Comprador.findAll();
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener compradores" });
  }
};

// Obtener por ID
exports.obtenerComprador = async (req, res) => {
  try {
    const c = await Comprador.findByPk(req.params.id);
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener comprador" });
  }
};

// Crear
exports.crearComprador = async (req, res) => {
  try {
    const nuevo = await Comprador.create(req.body);
    res.json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear comprador" });
  }
};

// Actualizar
exports.actualizarComprador = async (req, res) => {
  try {
    await Comprador.update(req.body, { where: { Id_Compra: req.params.id } });
    res.json({ mensaje: "Comprador actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar comprador" });
  }
};

// Eliminar
exports.eliminarComprador = async (req, res) => {
  try {
    await Comprador.destroy({ where: { Id_Compra: req.params.id } });
    res.json({ mensaje: "Comprador eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar comprador" });
  }
};
