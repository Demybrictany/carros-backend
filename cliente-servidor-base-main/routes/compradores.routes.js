const express = require("express");
const router = express.Router();
const controller = require("../controllers/compradores.controller");

router.get("/", controller.obtenerCompradores);
router.get("/:id", controller.obtenerComprador);
router.post("/", controller.crearComprador);
router.put("/:id", controller.actualizarComprador);
router.delete("/:id", controller.eliminarComprador);

module.exports = router;
