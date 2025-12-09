const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Venta = db.define("Venta", {
  Id_Venta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  Id_Predio: { type: DataTypes.INTEGER, allowNull: false },
  Id_Compra: { type: DataTypes.INTEGER, allowNull: false },

  Fecha: { type: DataTypes.DATEONLY, allowNull: false },
  PrecioVenta: { type: DataTypes.DECIMAL(12, 2), allowNull: false },

  Porcentaje: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  Comision: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
}, {
  tableName: "Ventas",
  timestamps: false,
});

module.exports = Venta;
