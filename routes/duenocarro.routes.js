const express = require("express");
const router = express.Router();

const {
  obtenerDuenosCarro,
  crearDuenoCarro,
  actualizarDuenoCarro,
  eliminarDuenoCarro,
} = require("../controllers/duenocarro.controller");

router.get("/", obtenerDuenosCarro);
router.post("/", crearDuenoCarro);
router.put("/:id", actualizarDuenoCarro);
router.delete("/:id", eliminarDuenoCarro);

module.exports = router;