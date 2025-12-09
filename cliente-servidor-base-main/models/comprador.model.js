const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Comprador = db.define("Comprador", {
  Id_Compra: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Nombre: { type: DataTypes.STRING(100), allowNull: false },
  Apellido: { type: DataTypes.STRING(100), allowNull: false },
  DPI: { type: DataTypes.STRING(13), allowNull: false },
  Telefono: { type: DataTypes.STRING(20), allowNull: true },
  Foto_DPI: { type: DataTypes.TEXT("long"), allowNull: true },
  PrecioVenta: { type: DataTypes.DECIMAL(10,2), allowNull: true },
}, {
  tableName: "Comprador",
  timestamps: false
});

module.exports = Comprador;
