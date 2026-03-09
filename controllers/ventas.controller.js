const sequelize = require("../db/db");
const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");

const parseFechaISO = (value) => {
  if (!value || typeof value !== "string") return null;

  const iso = value.match(/^\d{4}-\d{2}-\d{2}$/);
  if (iso) return value;

  const local = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (local) {
    const [, dd, mm, yyyy] = local;
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
};

const normalizeVentaPayload = (body) => {
  const Fecha = parseFechaISO(body.Fecha);

  return {
    Id_Predio: Number.parseInt(body.Id_Predio, 10),
    Id_Compra: Number.parseInt(body.Id_Compra, 10),
    Fecha,
    PrecioVenta: Number.parseFloat(body.PrecioVenta),
    Porcentaje:
      body.Porcentaje === "" || body.Porcentaje === null || body.Porcentaje === undefined
        ? null
        : Number.parseFloat(body.Porcentaje),
    Comision:
      body.Comision === "" || body.Comision === null || body.Comision === undefined
        ? null
        : Number.parseFloat(body.Comision),
    DiasContrato:
      body.DiasContrato === "" || body.DiasContrato === null || body.DiasContrato === undefined
        ? null
        : Number.parseInt(body.DiasContrato, 10),
  };
};

const validatePayload = (data, { partial = false } = {}) => {
  if (!partial || data.Id_Predio !== undefined) {
    if (!Number.isInteger(data.Id_Predio) || data.Id_Predio <= 0) {
      return "Id_Predio invalido";
    }
  }

  if (!partial || data.Id_Compra !== undefined) {
    if (!Number.isInteger(data.Id_Compra) || data.Id_Compra <= 0) {
      return "Id_Compra invalido";
    }
  }

  if (!partial || data.Fecha !== undefined) {
    if (!data.Fecha) return "Fecha invalida (use YYYY-MM-DD o DD/MM/YYYY)";
    if (new Date(data.Fecha) > new Date()) return "La fecha no puede ser futura";
  }

  if (!partial || data.PrecioVenta !== undefined) {
    if (!Number.isFinite(data.PrecioVenta) || data.PrecioVenta <= 0) {
      return "PrecioVenta invalido";
    }
  }

  if (data.Porcentaje !== null && data.Porcentaje !== undefined) {
    if (!Number.isFinite(data.Porcentaje) || data.Porcentaje < 0 || data.Porcentaje > 100) {
      return "Porcentaje invalido";
    }
  }

  if (data.Comision !== null && data.Comision !== undefined) {
    if (!Number.isFinite(data.Comision) || data.Comision < 0) {
      return "Comision invalida";
    }
  }

  if (data.DiasContrato !== null && data.DiasContrato !== undefined) {
    if (!Number.isInteger(data.DiasContrato) || data.DiasContrato < 0) {
      return "DiasContrato invalido";
    }
  }

  return null;
};

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [{ association: "Carro" }, { association: "Comprador" }],
      order: [["Id_Venta", "DESC"]],
    });

    res.json(ventas);
  } catch (error) {
    console.error("Error en obtenerVentas:", error);
    res.status(500).json({ error: "Error al obtener ventas", detalle: error.message });
  }
};

exports.crearVenta = async (req, res) => {
  const tx = await sequelize.transaction();

  try {
    const data = normalizeVentaPayload(req.body);

    const validationError = validatePayload(data);
    if (validationError) {
      await tx.rollback();
      return res.status(400).json({ error: validationError });
    }

    const carro = await CarroPredio.findByPk(data.Id_Predio, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (!carro) {
      await tx.rollback();
      return res.status(404).json({ error: "Carro no existe" });
    }

    if (carro.Id_Compra !== null) {
      await tx.rollback();
      return res.status(400).json({ error: "Este carro ya tiene comprador" });
    }

    const comprador = await Comprador.findByPk(data.Id_Compra, { transaction: tx });
    if (!comprador) {
      await tx.rollback();
      return res.status(404).json({ error: "Comprador no existe" });
    }

    const venta = await Venta.create(data, { transaction: tx });

    carro.Id_Compra = data.Id_Compra;
    await carro.save({ transaction: tx });

    await tx.commit();
    res.status(201).json(venta);
  } catch (error) {
    await tx.rollback();
    console.error("Error al crear venta:", error);
    res.status(500).json({
      error: "Error al crear venta",
      detalle: error.message,
    });
  }
};

exports.actualizarVenta = async (req, res) => {
  const tx = await sequelize.transaction();

  try {
    const id = req.params.id;
    const venta = await Venta.findByPk(id, { transaction: tx, lock: tx.LOCK.UPDATE });

    if (!venta) {
      await tx.rollback();
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const payload = normalizeVentaPayload({
      Id_Predio: req.body.Id_Predio ?? venta.Id_Predio,
      Id_Compra: req.body.Id_Compra ?? venta.Id_Compra,
      Fecha: req.body.Fecha ?? venta.Fecha,
      PrecioVenta: req.body.PrecioVenta ?? venta.PrecioVenta,
      Porcentaje: req.body.Porcentaje ?? venta.Porcentaje,
      Comision: req.body.Comision ?? venta.Comision,
      DiasContrato: req.body.DiasContrato ?? venta.DiasContrato,
    });

    const validationError = validatePayload(payload, { partial: true });
    if (validationError) {
      await tx.rollback();
      return res.status(400).json({ error: validationError });
    }

    const prevPredio = venta.Id_Predio;
    const nuevoPredio = payload.Id_Predio;

    const carroDestino = await CarroPredio.findByPk(nuevoPredio, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (!carroDestino) {
      await tx.rollback();
      return res.status(404).json({ error: "Carro destino no existe" });
    }

    if (nuevoPredio !== prevPredio && carroDestino.Id_Compra !== null) {
      await tx.rollback();
      return res.status(400).json({ error: "El carro destino ya tiene comprador" });
    }

    const comprador = await Comprador.findByPk(payload.Id_Compra, { transaction: tx });
    if (!comprador) {
      await tx.rollback();
      return res.status(404).json({ error: "Comprador no existe" });
    }

    await Venta.update(payload, { where: { Id_Venta: id }, transaction: tx });

    if (nuevoPredio !== prevPredio) {
      const carroAnterior = await CarroPredio.findByPk(prevPredio, { transaction: tx, lock: tx.LOCK.UPDATE });
      if (carroAnterior) {
        carroAnterior.Id_Compra = null;
        await carroAnterior.save({ transaction: tx });
      }
    }

    carroDestino.Id_Compra = payload.Id_Compra;
    await carroDestino.save({ transaction: tx });

    await tx.commit();
    res.json({ mensaje: "Venta actualizada" });
  } catch (error) {
    await tx.rollback();
    console.error("Error al actualizar venta:", error);
    res.status(500).json({
      error: "Error al actualizar venta",
      detalle: error.message,
    });
  }
};

exports.eliminarVenta = async (req, res) => {
  const tx = await sequelize.transaction();

  try {
    const id = req.params.id;
    const venta = await Venta.findByPk(id, { transaction: tx, lock: tx.LOCK.UPDATE });

    if (!venta) {
      await tx.rollback();
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const carro = await CarroPredio.findByPk(venta.Id_Predio, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (carro) {
      carro.Id_Compra = null;
      await carro.save({ transaction: tx });
    }

    await Venta.destroy({ where: { Id_Venta: id }, transaction: tx });

    await tx.commit();
    res.json({ mensaje: "Venta eliminada" });
  } catch (error) {
    await tx.rollback();
    console.error("Error al eliminar venta:", error);
    res.status(500).json({ error: "Error al eliminar venta", detalle: error.message });
  }
};
