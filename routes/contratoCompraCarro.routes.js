const express = require("express");
const { generarContratoCompraCarro } = require("../controllers/contratoCompraCarro.controller");

const router = express.Router();

router.get("/:idPredio", generarContratoCompraCarro);

module.exports = router;