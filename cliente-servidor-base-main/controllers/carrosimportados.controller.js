const CarrosImportados = require("../models/carrosImportados.model");

// Obtener todos
exports.obtenerCarrosImportados = async (req, res) => {
  try {
    const data = await CarrosImportados.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carros importados" });
  }
};

// Obtener por ID
exports.obtenerCarroImportado = async (req, res) => {
  try {
    const data = await CarrosImportados.findByPk(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carro importado" });
  }
};

// Crear
exports.crearCarroImportado = async (req, res) => {
  try {
    const data = await CarrosImportados.create(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al crear carro importado" });
  }
};

// Actualizar
exports.actualizarCarroImportado = async (req, res) => {
  try {
    await CarrosImportados.update(req.body, {
      where: { Id_Importacion: req.params.id },
    });
    res.json({ mensaje: "Carro importado actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carro importado" });
  }
};

// Eliminar
exports.eliminarCarroImportado = async (req, res) => {
  try {
    await CarrosImportados.destroy({
      where: { Id_Importacion: req.params.id },
    });
    res.json({ mensaje: "Carro importado eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar carro importado" });
  }
};
