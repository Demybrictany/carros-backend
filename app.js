const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./db/db");

const app = express();

// ✅ CORS CORREGIDO (acepta localhost y frontend desplegado)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://carros-backend.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Cargar modelos
require("./models/vendedor.model");
require("./models/comprador.model");
require("./models/carropredio.model");
require("./models/gastos.model");
require("./models/venta.model");
require("./models/usuario.model");

// Cargar relaciones (AL FINAL)
require("./models/relations");

sequelize.authenticate()
  .then(() => console.log("✅ Conexión a la base de datos correcta"))
  .catch(err => console.log("❌ Error al conectar", err));

app.use("/vendedores", require("./routes/vendedores.routes"));
app.use("/compradores", require("./routes/compradores.routes"));
app.use("/colaboradores", require("./routes/colaboradores.routes"));
app.use("/carros-predio", require("./routes/carropredio.routes"));
app.use("/gastos", require("./routes/gastos.routes"));
app.use("/ventas", require("./routes/ventas.routes"));
app.use("/contrato", require("./routes/contrato.routes"));
app.use("/usuarios", require("./routes/usuarios.routes"));
app.use("/estadisticas", require("./routes/estadisticas.routes"));
app.use("/contrato-compra-carro", require("./routes/contratoCompraCarro.routes"));

// rutas de busqueda 
app.use("/", require("./routes/buscar.routes"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
