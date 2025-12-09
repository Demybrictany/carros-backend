const Colaborador = require("../models/colaborador.model");

// Obtener todos
exports.obtenerColaboradores = async (req, res) => {
  try {
    const data = await Colaborador.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener colaboradores" });
  }
};

// Obtener por ID
exports.obtenerColaborador = async (req, res) => {
  try {
    const data = await Colaborador.findByPk(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener colaborador" });
  }
};

// Crear
exports.crearColaborador = async (req, res) => {
  try {
    const data = await Colaborador.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al crear colaborador" });
  }
};

// Actualizar
exports.actualizarColaborador = async (req, res) => {
  try {
    await Colaborador.update(req.body, {
      where: { Id_Colaborador: req.params.id }
    });
    res.json({ mensaje: "Colaborador actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar colaborador" });
  }
};

// Eliminar
exports.eliminarColaborador = async (req, res) => {
  try {
    await Colaborador.destroy({
      where: { Id_Colaborador: req.params.id }
    });
    res.json({ mensaje: "Colaborador eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar colaborador" });
  }
};
