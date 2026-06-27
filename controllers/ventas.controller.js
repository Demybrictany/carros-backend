const sequelize = require("../db/db");
const Venta = require("../models/venta.model");
const CarroPredio = require("../models/carropredio.model");
const Comprador = require("../models/comprador.model");
const VentaColaborador = require("../models/VentaColaborador.model");

const parseFechaISO = (value) => {
  if (!value || typeof value !== "string") return null;

  if (value.match(/^\d{4}-\d{2}-\d{2}$/)) return value;

  const local = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (local) {
    const [, dd, mm, yyyy] = local;
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
};
const calcularTotalComision = (colaboradores = []) => {
  if (!Array.isArray(colaboradores)) return 0;

  return colaboradores.reduce((total, c) => {
    return total + Number(c.Comision || c.comision || 0);
  }, 0);
};

const normalizeVentaPayload = (body) => {
  const Fecha = parseFechaISO(body.Fecha);

  return {
    Id_Predio: Number.parseInt(body.Id_Predio, 10),
    Id_Compra: Number.parseInt(body.Id_Compra, 10),
    Fecha,
    PrecioVenta: Number.parseFloat(body.PrecioVenta),
    Comision: calcularTotalComision(body.Colaboradores),
    DiasContrato:
      body.DiasContrato === "" ||
      body.DiasContrato === null ||
      body.DiasContrato === undefined
        ? null
        : Number.parseInt(body.DiasContrato, 10),
  };
};

const validatePayload = (data) => {
  if (!Number.isInteger(data.Id_Predio) || data.Id_Predio <= 0) {
    return "Id_Predio invalido";
  }

  if (!Number.isInteger(data.Id_Compra) || data.Id_Compra <= 0) {
    return "Id_Compra invalido";
  }

  if (!data.Fecha) return "Fecha invalida";

  if (new Date(data.Fecha) > new Date()) {
    return "La fecha no puede ser futura";
  }

  if (!Number.isFinite(data.PrecioVenta) || data.PrecioVenta <= 0) {
    return "PrecioVenta invalido";
  }

  if (!Number.isFinite(data.Comision) || data.Comision < 0) {
    return "Comision invalida";
  }

  if (data.DiasContrato !== null && data.DiasContrato !== undefined) {
    if (!Number.isInteger(data.DiasContrato) || data.DiasContrato < 0) {
      return "DiasContrato invalido";
    }
  }

  return null;
};

const guardarColaboradores = async (Id_Venta, colaboradores, tx) => {
  console.log("COLABORADORES RECIBIDOS:", colaboradores);

  if (!Array.isArray(colaboradores)) return;

  for (const c of colaboradores) {
    const idColaborador = c.Id_Colaborador || c.id_colaborador;
    const comision = c.Comision || c.comision;
    const rol = c.Rol || c.rol || "Vendedor";

    if (!idColaborador) continue;

    await VentaColaborador.create(
      {
        Id_Venta: Number.parseInt(Id_Venta, 10),
        Id_Colaborador: Number.parseInt(idColaborador, 10),
        Rol: rol,
        Comision: Number.parseFloat(comision || 0),
      },
      { transaction: tx }
    );
  }
};

const buildVentasInclude = () => {
  const include = [];
  if (Venta.associations?.Carro) include.push({ association: "Carro" });
  if (Venta.associations?.Comprador) include.push({ association: "Comprador" });
  if (Venta.associations?.venta_colaborador) {
    include.push({
      association: "venta_colaborador",
      attributes: ["Id_Colaborador", "Rol", "Comision"],
    });
  }
  return include;
};

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: buildVentasInclude(),
      order: [["Id_Venta", "DESC"]],
    });

    res.json(ventas);
  } catch (error) {
    console.error("Error en obtenerVentas:", error);
    res.status(500).json({
      error: "Error al obtener ventas",
      detalle: error.message,
    });
  }
};

exports.crearVenta = async (req, res) => {
  const tx = await sequelize.transaction();

  try {
    console.log("========== BODY RECIBIDO ==========");
    console.log(JSON.stringify(req.body, null, 2));

    const data = normalizeVentaPayload(req.body);

    const validationError = validatePayload(data);
    if (validationError) {
      await tx.rollback();
      return res.status(400).json({ error: validationError });
    }

    const carro = await CarroPredio.findByPk(data.Id_Predio, {
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    if (!carro) {
      await tx.rollback();
      return res.status(404).json({ error: "Carro no existe" });
    }

    if (carro.Id_Compra !== null) {
      await tx.rollback();
      return res.status(400).json({ error: "Este carro ya tiene comprador" });
    }

    const comprador = await Comprador.findByPk(data.Id_Compra, {
      transaction: tx,
    });

    if (!comprador) {
      await tx.rollback();
      return res.status(404).json({ error: "Comprador no existe" });
    }

    const venta = await Venta.create(data, { transaction: tx });

    await guardarColaboradores(
      venta.Id_Venta,
      req.body.Colaboradores,
      tx
    );

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

    const venta = await Venta.findByPk(id, {
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    if (!venta) {
      await tx.rollback();
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const payload = normalizeVentaPayload({
      Id_Predio: req.body.Id_Predio ?? venta.Id_Predio,
      Id_Compra: req.body.Id_Compra ?? venta.Id_Compra,
      Fecha: req.body.Fecha ?? venta.Fecha,
      PrecioVenta: req.body.PrecioVenta ?? venta.PrecioVenta,
      Colaboradores: req.body.Colaboradores || [],
      DiasContrato: req.body.DiasContrato ?? venta.DiasContrato,
    });

    const validationError = validatePayload(payload);
    if (validationError) {
      await tx.rollback();
      return res.status(400).json({ error: validationError });
    }

    const prevPredio = venta.Id_Predio;
    const nuevoPredio = payload.Id_Predio;

    const carroDestino = await CarroPredio.findByPk(nuevoPredio, {
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    if (!carroDestino) {
      await tx.rollback();
      return res.status(404).json({ error: "Carro destino no existe" });
    }

    if (nuevoPredio !== prevPredio && carroDestino.Id_Compra !== null) {
      await tx.rollback();
      return res.status(400).json({
        error: "El carro destino ya tiene comprador",
      });
    }

    const comprador = await Comprador.findByPk(payload.Id_Compra, {
      transaction: tx,
    });

    if (!comprador) {
      await tx.rollback();
      return res.status(404).json({ error: "Comprador no existe" });
    }

    await Venta.update(payload, {
      where: { Id_Venta: id },
      transaction: tx,
    });

    await VentaColaborador.destroy({
      where: { Id_Venta: id },
      transaction: tx,
    });

    await guardarColaboradores(id, req.body.Colaboradores, tx);

    if (nuevoPredio !== prevPredio) {
      const carroAnterior = await CarroPredio.findByPk(prevPredio, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

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

    const venta = await Venta.findByPk(id, {
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    if (!venta) {
      await tx.rollback();
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const carro = await CarroPredio.findByPk(venta.Id_Predio, {
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    if (carro) {
      carro.Id_Compra = null;
      await carro.save({ transaction: tx });
    }

    await VentaColaborador.destroy({
      where: { Id_Venta: id },
      transaction: tx,
    });

    await Venta.destroy({
      where: { Id_Venta: id },
      transaction: tx,
    });

    await tx.commit();
    res.json({ mensaje: "Venta eliminada" });
  } catch (error) {
    await tx.rollback();
    console.error("Error al eliminar venta:", error);

    res.status(500).json({
      error: "Error al eliminar venta",
      detalle: error.message,
    });
  }
};