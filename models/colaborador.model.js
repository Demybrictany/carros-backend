const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Colaborador = db.define(
  "Colaborador",
  {
    Id_Colaborador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    DPI: {
      type: DataTypes.STRING(13),
      allowNull: false
    }
  },
  {
    tableName: "Colaborador",
    timestamps: false
  }
);

module.exports = Colaborador;
