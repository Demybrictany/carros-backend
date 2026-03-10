// controllers/gastos.controller.js
const Gasto = require("../models/gastos.model");
const CarroPredio = require("../models/carropredio.model");

exports.obtenerGastos = async (req, res) => {
  try {
    const gastos = await Gasto.findAll({
      include: [
        {
          model: CarroPredio,
          as: "Carro",
        },
      ],
    });

    res.json(gastos);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    res.status(500).json({ error: "Error al obtener gastos" });
  }
};

exports.crearGasto = async (req, res) => {
  try {
    const nuevo = await Gasto.create(req.body);
    res.json(nuevo);
  } catch (error) {
    console.error("Error al crear gasto:", error);
    res.status(500).json({ error: "Error al crear gasto" });
  }
};

exports.actualizarGasto = async (req, res) => {
  try {
    const { id } = req.params;

    await Gasto.update(req.body, {
      where: { Id_Gastos: id },
    });

    res.json({ mensaje: "Gasto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    res.status(500).json({ error: "Error al actualizar gasto" });
  }
};

exports.eliminarGasto = async (req, res) => {
  try {
    const { id } = req.params;

    await Gasto.destroy({
      where: { Id_Gastos: id },
    });

    res.json({ mensaje: "Gasto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    res.status(500).json({ error: "Error al eliminar gasto" });
  }
};
