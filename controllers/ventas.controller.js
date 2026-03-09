const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");

exports.obtenerVentas = async (req, res) => {
  try {
    const include = [];

    // Usa solo asociaciones realmente registradas para evitar fallos por alias.
    if (Venta.associations?.Carro) {
      include.push({ association: "CarroVenta" });
    }
    if (Venta.associations?.Comprador) {
      include.push({ association: "Comprador" });
    }

    const ventas = await Venta.findAll({
      include
    });

    res.json(ventas);
  } catch (error) {
    console.error("Error en obtenerVentas:", error);
    res.status(500).json({ error: "Error al obtener ventas", detalle: error.message });
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
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    const prevPredio = venta.Id_Predio;
    const prevCompra = venta.Id_Compra;

    await Venta.update(req.body, { where: { Id_Venta: id } });

    // Si cambia el carro/compra, actualizar el estado del carro
    const nuevoPredio = req.body.Id_Predio ?? prevPredio;
    const nuevoCompra = req.body.Id_Compra ?? prevCompra;

    if (nuevoPredio !== prevPredio) {
      const prevCarro = await CarroPredio.findByPk(prevPredio);
      if (prevCarro) {
        prevCarro.Id_Compra = null;
        await prevCarro.save();
      }
    }

    const nuevoCarro = await CarroPredio.findByPk(nuevoPredio);
    if (nuevoCarro) {
      nuevoCarro.Id_Compra = nuevoCompra;
      await nuevoCarro.save();
    }

    res.json({ mensaje: "Venta actualizada" });
  } catch (error) {
    console.error("Error al actualizar venta:", error);
    res.status(500).json({ error: "Error al actualizar venta" });
  }
};

exports.eliminarVenta = async (req, res) => {
  try {
    const id = req.params.id;
    const venta = await Venta.findByPk(id);
    if (!venta) return res.status(404).json({ error: "Venta no encontrada" });

    const carro = await CarroPredio.findByPk(venta.Id_Predio);
    if (carro) {
      carro.Id_Compra = null;
      await carro.save();
    }

    await Venta.destroy({ where: { Id_Venta: id } });
    res.json({ mensaje: "Venta eliminada" });
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    res.status(500).json({ error: "Error al eliminar venta" });
  }
};
