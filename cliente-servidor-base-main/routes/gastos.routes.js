// routes/gastos.routes.js
const express = require("express");
const router = express.Router();

const {
  obtenerGastos,
  crearGasto,
  actualizarGasto,
  eliminarGasto,
} = require("../controllers/gastos.controller");

router.get("/", obtenerGastos);
router.post("/", crearGasto);
router.put("/:id", actualizarGasto);
router.delete("/:id", eliminarGasto);

module.exports = router;
