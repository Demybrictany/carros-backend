const CarroPredio = require("./carropredio.model");
const Vendedor = require("./vendedor.model");
const Comprador = require("./comprador.model");
const Gasto = require("./gastos.model");
const Venta = require("./venta.model");

const ensureBelongsTo = (source, target, options) => {
  if (!source.associations?.[options.as]) {
    source.belongsTo(target, options);
  }
};

const ensureHasMany = (source, target, options) => {
  if (!source.associations?.[options.as]) {
    source.hasMany(target, options);
  }
};

const ensureHasOne = (source, target, options) => {
  if (!source.associations?.[options.as]) {
    source.hasOne(target, options);
  }
};

/* CARRO -> VENDEDOR */
ensureBelongsTo(CarroPredio, Vendedor, {
  foreignKey: "Id_Vendedor",
  as: "Vendedor",
});

/* CARRO -> COMPRADOR */
ensureBelongsTo(CarroPredio, Comprador, {
  foreignKey: "Id_Compra",
  as: "Comprador",
});

/* CARRO -> GASTOS */
ensureHasMany(CarroPredio, Gasto, {
  foreignKey: "Id_Predio",
  as: "Gastos",
});

/* GASTO -> CARRO */
ensureBelongsTo(Gasto, CarroPredio, {
  foreignKey: "Id_Predio",
  as: "Carro",
});

/* CARRO -> VENTA (1 a 1) */
ensureHasOne(CarroPredio, Venta, {
  foreignKey: "Id_Predio",
  as: "Venta",
});

/* VENTA -> CARRO */
ensureBelongsTo(Venta, CarroPredio, {
  foreignKey: "Id_Predio",
  as: "Carro",
});

/* VENTA -> COMPRADOR */
ensureBelongsTo(Venta, Comprador, {
  foreignKey: "Id_Compra",
  as: "Comprador",
});

module.exports = { CarroPredio, Vendedor, Comprador, Gasto, Venta };
