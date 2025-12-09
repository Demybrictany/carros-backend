const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");
const Vendedor = require("../models/vendedor.model");
const Venta = require("../models/venta.model");

router.get("/", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") {
      return res.json({
        carros: [],
        compradores: [],
        vendedores: [],
        ventas: []
      });
    }

    const texto = `%${q}%`;

    const carros = await CarroPredio.findAll({
      where: {
        [Op.or]: [
          { Placa: { [Op.like]: texto } },
          { Modelo: { [Op.like]: texto } },
          { Color: { [Op.like]: texto } },
          { Vin: { [Op.like]: texto } },
        ]
      }
    });

    const compradores = await Comprador.findAll({
      where: {
        [Op.or]: [
          { Nombre: { [Op.like]: texto } },
          { Apellido: { [Op.like]: texto } },
          { DPI: { [Op.like]: texto } },
        ]
      }
    });

    const vendedores = await Vendedor.findAll({
      where: {
        [Op.or]: [
          { Nombre: { [Op.like]: texto } },
          { Dpi: { [Op.like]: texto } },
        ]
      }
    });

    const ventas = await Venta.findAll({
      where: {
        Id_Venta: q
      }
    });

    res.json({ carros, compradores, vendedores, ventas });

  } catch (error) {
    console.error("❌ Error búsqueda:", error);
    res.status(500).json({ error: "Error interno en la búsqueda" });
  }
});

module.exports = router;
