const express = require("express");
const router = express.Router();
const buscarGlobal = require("../controllers/buscar.controller");

router.get("/buscar", buscarGlobal);

module.exports = router;
