const { DataTypes } = require("sequelize");
const db = require("../db/db");
const Colaborador = require("./colaborador.model");
const Venta = require("./venta.model");

const VentaColaborador = db.define(
  "VentaColaborador",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },

    Id_Venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_venta",
    },

    Id_Colaborador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_colaborador",
    },

    Rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Vendedor",
      field: "rol",
    },

    Comision: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      field: "comision",
    },
  },
  {
    tableName: "venta_colaborador",
    timestamps: false,
  }
);

VentaColaborador.belongsTo(Colaborador, {
  foreignKey: "Id_Colaborador",
  as: "Colaborador",
});

VentaColaborador.belongsTo(Venta, {
  foreignKey: "Id_Venta",
  as: "Venta",
});

module.exports = VentaColaborador;