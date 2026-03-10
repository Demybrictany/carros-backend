const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Venta = db.define(
  "venta",
  {
    Id_Venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Id_Predio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    Id_Compra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    PrecioVenta: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    Porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: { min: 0, max: 100 },
    },
    Comision: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: { min: 0 },
    },
    DiasContrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 },
    },
  },
  {
    tableName: "ventas",
    timestamps: false,
  }
);

module.exports = Venta;

