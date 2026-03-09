const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { association: "Carro" },
        { association: "Comprador" },
      ],
      order: [["Id_Venta", "DESC"]],
    });

    res.json(ventas);
  } catch (error) {
    console.error("Error en obtenerVentas:", error);
    res.status(500).json({
      error: "Error al obtener ventas",
      detalle: error.message,
    });
  }
};

exports.crearVenta = async (req, res) => {
  try {
    const data = req.body;

    if (!data.Id_Predio || !data.Id_Compra || !data.Fecha || !data.PrecioVenta) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const hoy = new Date();
    if (new Date(data.Fecha) > hoy) {
      return res.status(400).json({ error: "La fecha no puede ser futura" });
    }

    const carro = await CarroPredio.findByPk(data.Id_Predio);
    if (!carro) {
      return res.status(404).json({ error: "Carro no existe" });
    }

    if (carro.Id_Compra !== null) {
      return res.status(400).json({ error: "Este carro ya tiene comprador" });
    }

    const comprador = await Comprador.findByPk(data.Id_Compra);
    if (!comprador) {
      return res.status(404).json({ error: "Comprador no existe" });
    }

    const venta = await Venta.create(data);

    carro.Id_Compra = data.Id_Compra;
    await carro.save();

    res.status(201).json(venta);
  } catch (error) {
    console.error("Error al crear venta:", error);
    res.status(500).json({ error: "Error al crear venta" });
  }
};

exports.actualizarVenta = async (req, res) => {
  try {
    const id = req.params.id;
    const venta = await Venta.findByPk(id);

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const prevPredio = venta.Id_Predio;
    const prevCompra = venta.Id_Compra;

    const nuevoPredio = req.body.Id_Predio ?? prevPredio;
    const nuevoCompra = req.body.Id_Compra ?? prevCompra;

    if (req.body.Fecha && new Date(req.body.Fecha) > new Date()) {
      return res.status(400).json({ error: "La fecha no puede ser futura" });
    }

    const carroDestino = await CarroPredio.findByPk(nuevoPredio);
    if (!carroDestino) {
      return res.status(404).json({ error: "Carro destino no existe" });
    }

    if (nuevoPredio !== prevPredio && carroDestino.Id_Compra !== null) {
      return res.status(400).json({ error: "El carro destino ya tiene comprador" });
    }

    const comprador = await Comprador.findByPk(nuevoCompra);
    if (!comprador) {
      return res.status(404).json({ error: "Comprador no existe" });
    }

    await Venta.update(req.body, { where: { Id_Venta: id } });

    if (nuevoPredio !== prevPredio) {
      const prevCarro = await CarroPredio.findByPk(prevPredio);
      if (prevCarro) {
        prevCarro.Id_Compra = null;
        await prevCarro.save();
      }
    }

    carroDestino.Id_Compra = nuevoCompra;
    await carroDestino.save();

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

    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

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
