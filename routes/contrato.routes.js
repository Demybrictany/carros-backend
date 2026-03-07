const express = require("express");
const { generarContrato } = require("../controllers/contrato.controller");
const router = express.Router();

router.get("/:ventaId", generarContrato);

module.exports = router;
