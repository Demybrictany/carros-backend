const { DataTypes } = require("sequelize");
const db = require("../db/db");

const VentaColaborador = db.define("VentaColaborador", {

  Id_Venta: { type: DataTypes.INTEGER, primaryKey: true },

  Id_Colaborador: { type: DataTypes.INTEGER, primaryKey: true },

  Rol: { type: DataTypes.STRING(30), allowNull: false }

},{
  tableName: "VentaColaborador",
  timestamps: false
});
VentaColaborador.belongsTo(Colaborador, {
  foreignKey: "Id_Colaborador",
  as: "Colaborador"
});
Venta.hasMany(VentaColaborador, {
  foreignKey: "Id_Venta",
  as: "Colaboradores"
});

module.exports = VentaColaborador;
