const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");

exports.obtenerVentas = async (req, res) => {
  try {

    let ventas;

    try {
      ventas = await Venta.findAll({
        include: [
          { model: CarroPredio, as: "Carro" },
          { model: Comprador, as: "Comprador" }
        ]
      });
    } catch (includeError) {

      console.warn("Include falló, cargando ventas sin relaciones:", includeError);

      ventas = await Venta.findAll();
    }

    res.json(ventas);

  } catch (error) {

    console.error("Error al obtener ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });

  }
};

exports.crearVenta = async (req, res) => {
  try {

    const data = req.body;

    // validar fecha
    const hoy = new Date();
    if (new Date(data.Fecha) > hoy) {
      return res.status(400).json({ error: "La fecha no puede ser futura" });
    }

    // validar carro
    const carro = await CarroPredio.findByPk(data.Id_Predio);

    if (!carro) {
      return res.status(404).json({ error: "Carro no existe" });
    }

    if (carro.Id_Compra !== null) {
      return res.status(400).json({ error: "Este carro ya tiene comprador" });
    }

    // crear venta
    const venta = await Venta.create(data);

    // actualizar carro
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

    await Venta.update(req.body, {
      where: { Id_Venta: id }
    });

    res.json({ mensaje: "Venta actualizada" });

  } catch (error) {

    console.error("Error al actualizar venta:", error);
    res.status(500).json({ error: "Error al actualizar venta" });

  }
};

exports.eliminarVenta = async (req, res) => {
  try {

    const id = req.params.id;

    await Venta.destroy({
      where: { Id_Venta: id }
    });

    res.json({ mensaje: "Venta eliminada" });

  } catch (error) {

    console.error("Error al eliminar venta:", error);
    res.status(500).json({ error: "Error al eliminar venta" });

  }
};