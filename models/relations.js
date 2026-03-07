const CarroPredio = require("./carropredio.model");
const Vendedor = require("./vendedor.model");
const Comprador = require("./comprador.model");
const Gasto = require("./gastos.model");
const Venta = require("./venta.model");

/* ==========================================
   RELACIÓN: CARRO → VENDEDOR
========================================== */
CarroPredio.belongsTo(Vendedor, {
  foreignKey: "Id_Vendedor",
  as: "Vendedor",
});

/* ==========================================
   RELACIÓN: CARRO → COMPRADOR
========================================== */
CarroPredio.belongsTo(Comprador, {
  foreignKey: "Id_Compra",
  as: "Comprador",
});

/* ==========================================
   RELACIÓN: CARRO → GASTOS
========================================== */
CarroPredio.hasMany(Gasto, {
  foreignKey: "Id_Predio",
  as: "Gastos",
});

/* ==========================================
   RELACIÓN: GASTO → CARRO  (🔥 LA QUE FALTABA)
========================================== */
Gasto.belongsTo(CarroPredio, {
  foreignKey: "Id_Predio",
  as: "Carro",
});

/* ==========================================
   RELACIÓN: CARRO → VENTA (1 a 1)
========================================== */
CarroPredio.hasOne(Venta, {
  foreignKey: "Id_Predio",
  as: "Venta",
});

/* ==========================================
   RELACIÓN: VENTA → CARRO
========================================== */
Venta.belongsTo(CarroPredio, {
  foreignKey: "Id_Predio",
  as: "Carro",
});

/* ==========================================
   RELACIÓN: VENTA → COMPRADOR
========================================== */
Venta.belongsTo(Comprador, {
  foreignKey: "Id_Compra",
  as: "Comprador",
});

module.exports = { CarroPredio, Vendedor, Comprador, Gasto, Venta };
