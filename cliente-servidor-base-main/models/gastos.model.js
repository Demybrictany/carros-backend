const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Gasto = db.define("Gasto", {
  Id_Gastos: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  Descripcion: { type: DataTypes.STRING(200), allowNull: false },
  Monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  Fecha: { type: DataTypes.DATE, allowNull: false },

  Id_Predio: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: "Gastos",
  timestamps: false,
});

module.exports = Gasto;
