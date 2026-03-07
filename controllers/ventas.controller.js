const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: CarroPredio, as: "Carro" },
        { model: Comprador, as: "Comprador" }
      ]
    });

    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

exports.crearVenta = async (req, res) => {
  try {
    const data = req.body;

    // ❗ Validar fecha (NO futura)
    const hoy = new Date();
    if (new Date(data.Fecha) > hoy) {
      return res.status(400).json({ error: "La fecha no puede ser futura" });
    }

    // ❗ Validar que el carro NO esté ya vendido
    const carro = await CarroPredio.findByPk(data.Id_Predio);
    if (!carro) return res.status(404).json({ error: "Carro no existe" });

    if (carro.Id_Compra !== null) {
      return res.status(400).json({ error: "Este carro ya tiene comprador" });
    }

    // Crear venta
    const venta = await Venta.create(data);

    // Actualizar comprador en CarroPredio
    carro.Id_Compra = data.Id_Compra;
    await carro.save();

    res.json(venta);

  } catch (error) {
    console.error("Error al crear venta:", error);
    res.status(500).json({ error: "Error al crear venta" });
  }
};

exports.actualizarVenta = async (req, res) => {
  try {
    const id = req.params.id;
    await Venta.update(req.body, { where: { Id_Venta: id } });
    res.json({ mensaje: "Venta actualizada" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar venta" });
  }
};

exports.eliminarVenta = async (req, res) => {
  try {
    const id = req.params.id;
    await Venta.destroy({ where: { Id_Venta: id } });
    res.json({ mensaje: "Venta eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar venta" });
  }
};
