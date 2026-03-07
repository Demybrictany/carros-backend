const sequelize = require("../db/db");

module.exports = {

  // ===============================
  // VENTAS HOY
  // ===============================
  async ventasHoy(req, res) {
    try {
      const [result] = await sequelize.query(`
        SELECT 
          IFNULL(SUM(PrecioVenta), 0) AS TotalVendido
        FROM ventas
        WHERE DATE(Fecha) = CURDATE();
      `);

      res.json(result);
    } catch (error) {
      console.error("ventasHoy:", error);
      res.status(500).json({ error: "Error ventas hoy" });
    }
  },

  // ===============================
  // ESTADÍSTICAS MENSUALES (CORREGIDO)
  // ===============================
  async estadisticasMensuales(req, res) {
    try {
      const [result] = await sequelize.query(`
        SELECT
          DATE_FORMAT(v.Fecha, '%Y-%m') AS Mes,
          SUM(v.PrecioVenta) AS TotalVendido,
          SUM(c.Precio_Compra) AS TotalComprado,
          (SUM(v.PrecioVenta) - SUM(c.Precio_Compra)) AS GananciaBruta,
          IFNULL(SUM(g.Monto), 0) AS TotalGastos
        FROM ventas v
        JOIN carropredio c 
          ON c.Id_Predio = v.Id_Predio
        LEFT JOIN gastos g
          ON g.Id_Predio = c.Id_Predio
         AND DATE_FORMAT(g.Fecha, '%Y-%m') = DATE_FORMAT(v.Fecha, '%Y-%m')
        GROUP BY Mes
        ORDER BY Mes DESC;
      `);

      res.json(result);
    } catch (error) {
      console.error("estadisticasMensuales:", error);
      res.status(500).json({ error: "Error estadísticas mensuales" });
    }
  },

  // ===============================
  // ESTADÍSTICAS ANUALES (OK)
  // ===============================
  async estadisticasAnuales(req, res) {
    try {
      const [result] = await sequelize.query(`
        SELECT
          YEAR(v.Fecha) AS Anio,
          SUM(v.PrecioVenta) AS TotalVendido,
          SUM(c.Precio_Compra) AS TotalComprado,
          (SUM(v.PrecioVenta) - SUM(c.Precio_Compra)) AS GananciaBruta,
          IFNULL(SUM(g.Monto), 0) AS TotalGastos
        FROM ventas v
        JOIN carropredio c
          ON c.Id_Predio = v.Id_Predio
        LEFT JOIN gastos g
          ON g.Id_Predio = c.Id_Predio
         AND YEAR(g.Fecha) = YEAR(v.Fecha)
        GROUP BY YEAR(v.Fecha)
        ORDER BY Anio DESC;
      `);

      res.json(result);
    } catch (error) {
      console.error("estadisticasAnuales:", error);
      res.status(500).json({ error: "Error estadísticas anuales" });
    }
  },

  // ===============================
  // GANANCIA POR CARRO (OK)
  // ===============================
  async gananciaPorCarro(req, res) {
    try {
      const [result] = await sequelize.query(`
        SELECT 
          c.Placa,
          c.Precio_Compra AS TotalComprado,
          IFNULL(SUM(v.PrecioVenta), 0) AS TotalVendido,
          IFNULL(SUM(g.Monto), 0) AS Gastos,
          (
            IFNULL(SUM(v.PrecioVenta), 0)
            - c.Precio_Compra
            - IFNULL(SUM(g.Monto), 0)
          ) AS Ganancia
        FROM carropredio c
        LEFT JOIN ventas v 
          ON c.Id_Predio = v.Id_Predio
        LEFT JOIN gastos g 
          ON c.Id_Predio = g.Id_Predio
        GROUP BY 
          c.Id_Predio, c.Placa, c.Precio_Compra;
      `);

      res.json(result);
    } catch (error) {
      console.error("gananciaPorCarro:", error);
      res.status(500).json({ error: "Error ganancia por carro" });
    }
  }

};
