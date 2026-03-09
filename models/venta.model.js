const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Venta = db.define(
  "venta",
  {
    Id_Venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    Id_Predio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    Id_Compra: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    PrecioVenta: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },

    Porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },

    Comision: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },

    DiasContrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "ventas", // 🔥 ESTE ES EL NOMBRE REAL DE TU TABLA
    timestamps: false
  }
);

const CarroPredio = require("./carropredio.model");
const Comprador = require("./comprador.model");

Venta.belongsTo(CarroPredio, {
  foreignKey: "Id_Predio",
  as: "Carro"
});

Venta.belongsTo(Comprador, {
  foreignKey: "Id_Compra",
  as: "Comprador"
});

module.exports = Venta;