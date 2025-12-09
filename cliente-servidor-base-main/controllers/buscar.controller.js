const Carro = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");
const Vendedor = require("../models/vendedor.model");
const Venta = require("../models/venta.model");
const Gastos = require("../models/gastos.model");

exports.buscar = async (req, res) => {
  try {
    const { query, tipo } = req.query;

    if (!query) return res.json([]);

    const filtro = { [require("sequelize").Op.like]: `%${query}%` };

    let resultados = [];

    switch (tipo) {
      case "carros":
        resultados = await Carro.findAll({
          where: {
            Modelo: filtro,
          }
        });
        break;

      case "compradores":
        resultados = await Comprador.findAll({
          where: {
            Nombre: filtro
          }
        });
        break;

      case "vendedores":
        resultados = await Vendedor.findAll({
          where: {
            Nombre: filtro
          }
        });
        break;

      case "ventas":
        resultados = await Venta.findAll({
          where: {
            Fecha: filtro
          }
        });
        break;

      case "gastos":
        resultados = await Gastos.findAll({
          where: {
            Descripcion: filtro
          }
        });
        break;

      default:
        resultados = [
          ...(await Carro.findAll({ where: { Modelo: filtro } })),
          ...(await Comprador.findAll({ where: { Nombre: filtro } })),
          ...(await Vendedor.findAll({ where: { Nombre: filtro } })),
          ...(await Venta.findAll({ where: { Fecha: filtro } })),
          ...(await Gastos.findAll({ where: { Descripcion: filtro } })),
        ];
        break;
    }

    res.json(resultados);
  } catch (error) {
    console.log("Error búsqueda:", error);
    res.status(500).json({ error: "Error en búsqueda" });
  }
};
