const Vendedor = require("../models/vendedor.model");

exports.obtenerVendedores = async (req, res) => {
  try {
    const vendedores = await Vendedor.findAll();
    res.json(vendedores);
  } catch (error) {
    console.error("Error obteniendo vendedores:", error);
    res.status(500).json({ error: "Error al obtener vendedores" });
  }
};

exports.crearVendedor = async (req, res) => {
  try {
    const body = req.body;

    if (!body.Nombre || !body.Telefono || !body.Dpi) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const nuevo = await Vendedor.create(body);
    res.json(nuevo);

  } catch (error) {
    console.error("Error creando vendedor:", error);
    res.status(500).json({ error: "Error al crear vendedor" });
  }
};

exports.actualizarVendedor = async (req, res) => {
  try {
    const id = req.params.id;

    const vendedor = await Vendedor.findByPk(id);
    if (!vendedor) {
      return res.status(404).json({ error: "No existe el vendedor" });
    }

    await vendedor.update(req.body);

    res.json({ mensaje: "Vendedor actualizado" });
  } catch (error) {
    console.error("Error actualizando vendedor:", error);
    res.status(500).json({ error: "Error al actualizar vendedor" });
  }
};

exports.eliminarVendedor = async (req, res) => {
  try {
    const id = req.params.id;

    const vendedor = await Vendedor.findByPk(id);
    if (!vendedor) {
      return res.status(404).json({ error: "No existe el vendedor" });
    }

    await vendedor.destroy();
    res.json({ mensaje: "Vendedor eliminado" });

  } catch (error) {
    console.error("Error eliminando vendedor:", error);
    res.status(500).json({ error: "Error al eliminar vendedor" });
  }
};
