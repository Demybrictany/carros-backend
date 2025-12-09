const express = require("express");
const router = express.Router();
const controller = require("../controllers/carropredio.controller");

router.get("/", controller.obtenerCarros);
router.get("/:id", controller.obtenerCarro);
router.post("/", controller.crearCarro);
router.put("/:id", controller.actualizarCarro);
router.delete("/:id", controller.eliminarCarro);

module.exports = router;
