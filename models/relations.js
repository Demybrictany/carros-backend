const CarroPredio = require("./carropredio.model");
const Vendedor = require("./vendedor.model");
const Comprador = require("./comprador.model");
const Gasto = require("./gastos.model");
const Venta = require("./venta.model");

/* ==========================================
   RELACION: CARRO -> VENDEDOR
========================================== */
CarroPredio.belongsTo(Vendedor, {
  foreignKey: "Id_Vendedor",
  as: "Vendedor",
});

/* ==========================================
   RELACION: CARRO -> COMPRADOR
========================================== */
CarroPredio.belongsTo(Comprador, {
  foreignKey: "Id_Compra",
  as: "Comprador",
});

/* ==========================================
   RELACION: CARRO -> GASTOS
========================================== */
CarroPredio.hasMany(Gasto, {
  foreignKey: "Id_Predio",
  as: "Gastos",
});

/* ==========================================
   RELACION: GASTO -> CARRO
========================================== */
Gasto.belongsTo(CarroPredio, {
  foreignKey: "Id_Predio",
  as: "Carro",
});

/* ==========================================
   RELACION: CARRO -> VENTA (1 a 1)
========================================== */
CarroPredio.hasOne(Venta, {
  foreignKey: "Id_Predio",
  as: "Venta",
});

/* ==========================================
   RELACION: VENTA -> CARRO
========================================== */
Venta.belongsTo(CarroPredio, {
  foreignKey: "Id_Predio",
  as: "Carro",
});

/* ==========================================
   RELACION: VENTA -> COMPRADOR
========================================== */
Venta.belongsTo(Comprador, {
  foreignKey: "Id_Compra",
  as: "Comprador",
});

module.exports = { CarroPredio, Vendedor, Comprador, Gasto, Venta };
