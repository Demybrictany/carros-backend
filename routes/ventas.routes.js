const express = require("express");
const router = express.Router();

const {
  obtenerVentas,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
} = require("../controllers/ventas.controller");

router.route("/").get(obtenerVentas).post(crearVenta);
router.route("/:id").put(actualizarVenta).delete(eliminarVenta);

module.exports = router;
