const express = require("express");
const router = express.Router();
const controller = require("../controllers/estadisticas.controller");

router.get("/ventas-hoy", controller.ventasHoy);
router.get("/ventas-mes", controller.estadisticasMensuales);
router.get("/ventas-anual", controller.estadisticasAnuales);
router.get("/ganancia-por-carro", controller.gananciaPorCarro);

module.exports = router;
