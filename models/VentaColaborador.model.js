const { DataTypes } = require("sequelize");
const db = require("../db/db");
const Colaborador = require("./colaborador.model");
const Venta = require("./venta.model");

const VentaColaborador = db.define("VentaColaborador", {

  Id_Venta: { type: DataTypes.INTEGER, primaryKey: true },

  Id_Colaborador: { type: DataTypes.INTEGER, primaryKey: true },

  Rol: { type: DataTypes.STRING(30), allowNull: false }

},{
  tableName: "venta_colaborador",
  timestamps: false
});

VentaColaborador.belongsTo(Colaborador, {
  foreignKey: "Id_Colaborador",
  as: "Colaborador"
});
VentaColaborador.belongsTo(Venta, {
  foreignKey: "Id_Venta",
  as: "Venta"
});

module.exports = VentaColaborador;
