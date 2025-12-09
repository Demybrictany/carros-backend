const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Vendedor = db.define(
  "Vendedor",
  {
    Id_Vendedor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    Telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    Dpi: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true,
    },

    Foto_DPI: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    Direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    Relacion_Dueño: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    Tiempo_Traspaso: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "Vendedor",
    timestamps: false,
  }
);

module.exports = Vendedor;
