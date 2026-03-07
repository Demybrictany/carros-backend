const { DataTypes } = require("sequelize");
const db = require("../db/db");

const CarroPredio = db.define(
  "CarroPredio",
  {
    Id_Predio: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    Placa: { type: DataTypes.STRING(20), allowNull: false },
    Modelo: { type: DataTypes.STRING(100), allowNull: false },
    Anio: { type: DataTypes.INTEGER, allowNull: false },

    FotoCarro: { type: DataTypes.TEXT("long"), allowNull: true },

    Precio_Compra: { type: DataTypes.DECIMAL(12, 2), allowNull: false },

    Vin: { type: DataTypes.STRING(100), allowNull: false },
    Num_Motor: { type: DataTypes.STRING(100), allowNull: false },
    Num_Chasis: { type: DataTypes.STRING(100), allowNull: false },

    Color: { type: DataTypes.STRING(50), allowNull: false },

    Id_Vendedor: { type: DataTypes.INTEGER, allowNull: false },
    Id_Compra: { type: DataTypes.INTEGER, allowNull: true }
  },
  {
    tableName: "CarroPredio",
    timestamps: false,
  }
);

module.exports = CarroPredio;
