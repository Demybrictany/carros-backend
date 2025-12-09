const express = require("express");
const router = express.Router();
const controller = require("../controllers/carrosimportados.controller");

router.get("/", controller.obtenerCarrosImportados);
router.get("/:id", controller.obtenerCarroImportado);
router.post("/", controller.crearCarroImportado);
router.put("/:id", controller.actualizarCarroImportado);
router.delete("/:id", controller.eliminarCarroImportado);

module.exports = router;
