const Carro = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");
const Vendedor = require("../models/vendedor.model");
const Venta = require("../models/venta.model");
const Gasto = require("../models/gastos.model");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  const { tipo, query } = req.query;

  if (!query) return res.json([]);

  // Buscar por cualquier caracter
  const texto = `%${query}%`;

  try {
    switch (tipo) {
      case "carros":
        return res.json(
          await Carro.findAll({
            where: {
              [Op.or]: [
                { Placa: { [Op.like]: texto } },
                { Modelo: { [Op.like]: texto } },
                { Vin: { [Op.like]: texto } }
              ]
            }
          })
        );

      case "compradores":
        return res.json(
          await Comprador.findAll({
            where: {
              [Op.or]: [
                { Nombre: { [Op.like]: texto } },
                { Apellido: { [Op.like]: texto } },
                { DPI: { [Op.like]: texto } }
              ]
            }
          })
        );

      case "vendedores":
        return res.json(
          await Vendedor.findAll({
            where: {
              [Op.or]: [
                { Nombre: { [Op.like]: texto } },
                { Dpi: { [Op.like]: texto } },
                { Direccion: { [Op.like]: texto } }
              ]
            }
          })
        );

      case "ventas":
        return res.json(
          await Venta.findAll({
            where: {
              [Op.or]: [
                { Fecha: { [Op.like]: texto } },
                { PrecioVenta: { [Op.like]: texto } }
              ]
            }
          })
        );

      case "gastos":
        return res.json(
          await Gasto.findAll({
            where: {
              [Op.or]: [
                { Descripcion: { [Op.like]: texto } },
                { Fecha: { [Op.like]: texto } }
              ]
            }
          })
        );

      // 🔥 BUSCAR EN TODO
case "todos":
default:
  const [carros, compradores, vendedores, ventas, gastos] =
    await Promise.all([
      Carro.findAll({
        where: {
          [Op.or]: [
            { Placa: { [Op.like]: texto } },
            { Modelo: { [Op.like]: texto } }
          ]
        }
      }),

      Comprador.findAll({
        where: {
          [Op.or]: [
            { Nombre: { [Op.like]: texto } },
            { Apellido: { [Op.like]: texto } },
            { DPI: { [Op.like]: texto } }
          ]
        }
      }),

      Vendedor.findAll({
        where: {
          [Op.or]: [
            { Nombre: { [Op.like]: texto } },
            { Dpi: { [Op.like]: texto } }
          ]
        }
      }),

      Venta.findAll({
        where: {
          [Op.or]: [
            { Fecha: { [Op.like]: texto } },
            { PrecioVenta: { [Op.like]: texto } }
          ]
        }
      }),

      Gasto.findAll({
        where: {
          [Op.or]: [
            { Descripcion: { [Op.like]: texto } },
            { Fecha: { [Op.like]: texto } }
          ]
        }
      }),
    ]);

  // 🔥 UNIFICAR TODO EN UN SOLO ARREGLO
  return res.json([
    ...carros,
    ...compradores,
    ...vendedores,
    ...ventas,
    ...gastos
  ]);


        return res.json({
          carros,
          compradores,
          vendedores,
          ventas,
          gastos
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};
