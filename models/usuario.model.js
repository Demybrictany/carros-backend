const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Usuario = sequelize.define(
  "usuario",
  {
    Id_Usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Rol: {
      type: DataTypes.ENUM("gerente", "colaborador", "cliente", "programador"),
      allowNull: false,
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
  }
);

module.exports = Usuario;
