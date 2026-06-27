const DuenoCarro = require("../models/duenocarro.model");

exports.obtenerDuenosCarro = async (req, res) => {
  try {
    const duenos = await DuenoCarro.findAll();
    res.json(duenos);
  } catch (error) {
    console.error("Error obteniendo dueños:", error);
    res.status(500).json({ error: "Error al obtener dueños" });
  }
};

exports.crearDuenoCarro = async (req, res) => {
  try {
    const body = req.body;

    if (!body.Nombre) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const nuevo = await DuenoCarro.create(body);
    res.json(nuevo);

  } catch (error) {
    console.error("Error creando dueño:", error);
    res.status(500).json({ error: "Error al crear dueño" });
  }
};

exports.actualizarDuenoCarro = async (req, res) => {
  try {
    const id = req.params.id;

    const dueno = await DuenoCarro.findByPk(id);
    if (!dueno) {
      return res.status(404).json({ error: "No existe el dueño" });
    }

    await dueno.update(req.body);

    res.json({ mensaje: "Dueño actualizado" });
  } catch (error) {
    console.error("Error actualizando dueño:", error);
    res.status(500).json({ error: "Error al actualizar dueño" });
  }
};

exports.eliminarDuenoCarro = async (req, res) => {
  try {
    const id = req.params.id;

    const dueno = await DuenoCarro.findByPk(id);
    if (!dueno) {
      return res.status(404).json({ error: "No existe el dueño" });
    }

    await dueno.destroy();
    res.json({ mensaje: "Dueño eliminado" });

  } catch (error) {
    console.error("Error eliminando dueño:", error);
    res.status(500).json({ error: "Error al eliminar dueño" });
  }
};