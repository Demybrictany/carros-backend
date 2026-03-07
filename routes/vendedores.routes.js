const express = require("express");
const router = express.Router();

const {
  obtenerVendedores,
  crearVendedor,
  actualizarVendedor,
  eliminarVendedor,
} = require("../controllers/vendedores.controller");

router.get("/", obtenerVendedores);
router.post("/", crearVendedor);
router.put("/:id", actualizarVendedor);
router.delete("/:id", eliminarVendedor);

module.exports = router;
