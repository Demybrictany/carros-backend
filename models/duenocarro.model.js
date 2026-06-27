const { DataTypes } = require("sequelize");
const db = require("../db/db");

const DuenoCarro = db.define(
  "DuenoCarro",
  {
    Id_Dueno_Carro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    Apellido: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    DPI: {
      type: DataTypes.STRING(13),
      allowNull: true,
      unique: true,
    },

    Telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    Foto_DPI: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    Direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    Fecha_Registro: {
      type: DataTypes.DATE,
      allowNull: true,
    },

  },
  {
    tableName: "dueno_carro",
    timestamps: false,
  }
);

const CarroPredio = require("./carropredio.model");

DuenoCarro.hasMany(CarroPredio, {
  foreignKey: "Id_Dueno_Carro",
  as: "carros"
});

module.exports = DuenoCarro;
