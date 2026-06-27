const CarroPredio = require("./carropredio.model");
const Comprador = require("./comprador.model");
const Vendedor = require("./vendedor.model");
const DuenoCarro = require("./duenocarro.model");
const Colaborador = require("./colaborador.model");
const Venta = require("./venta.model");
const Gastos = require("./gastos.model");
const Usuario = require("./usuario.model");
const CarrosImportados = require("./carrosImportados.model");


// CarroPredio ↔ Vendedor
CarroPredio.belongsTo(Vendedor, { foreignKey: "Id_Vendedor", as: "VendedorInfo" });
Vendedor.hasMany(CarroPredio, { foreignKey: "Id_Vendedor" });

// CarroPredio ↔ Comprador
CarroPredio.belongsTo(Comprador, { foreignKey: "Id_Compra", as: "CompradorInfo" });
Comprador.hasMany(CarroPredio, { foreignKey: "Id_Compra" });

// CarroPredio <-> DuenoCarro
if (!CarroPredio.associations?.dueno) {
    CarroPredio.belongsTo(DuenoCarro, { foreignKey: "Id_Dueno_Carro", as: "dueno" });
}

if (!DuenoCarro.associations?.carros) {
    DuenoCarro.hasMany(CarroPredio, { foreignKey: "Id_Dueno_Carro", as: "carros" });
}

// Venta ↔ CarroPredio
Venta.belongsTo(CarroPredio, { foreignKey: "Id_Predio", as: "CarroPredio" });
CarroPredio.hasMany(Venta, { foreignKey: "Id_Predio" });



// Gastos ↔ CarroPredio
Gastos.belongsTo(CarroPredio, { foreignKey: "Id_Predio", as: "CarroGasto" });
CarroPredio.hasMany(Gastos, { foreignKey: "Id_Predio" });

module.exports = {
    CarroPredio,
    Comprador,
    Vendedor,
    DuenoCarro,
    Colaborador,
    Venta,
    Gastos,
    Usuario,
    CarrosImportados
};
