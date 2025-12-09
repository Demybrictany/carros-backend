const { DataTypes } = require("sequelize");
const db = require("../db/db");

const Usuario = db.define("Usuario", {
    Id_Usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nombre: { type: DataTypes.STRING(100), allowNull: false },
    Correo: { type: DataTypes.STRING(150), allowNull: false },
    Contrasena: { type: DataTypes.STRING(255), allowNull: false },
    Rol: { type: DataTypes.STRING(50), allowNull: false }
}, {
    tableName: "Usuario",
    timestamps: false
});

module.exports = Usuario;
