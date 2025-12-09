const express = require("express");
const router = express.Router();
const controller = require("../controllers/colaboradores.controller");

router.get("/", controller.obtenerColaboradores);
router.get("/:id", controller.obtenerColaborador);
router.post("/", controller.crearColaborador);
router.put("/:id", controller.actualizarColaborador);
router.delete("/:id", controller.eliminarColaborador);

module.exports = router;
