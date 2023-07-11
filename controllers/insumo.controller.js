const Insumo = require("../models/insumo");
const mercadopago = require("mercadopago");
const insumoCtrl = {};

/**
 * Permite registrar un insumo del gym.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
insumoCtrl.createInsumo = async (req, res) => {
  let insumo = new Insumo(req.body);
  try {
    mercadopago.configure({
      access_token:
        "TEST-777962751549168-070413-5897e9829cf547145a939961f47ee9db-1407364081",
    });

    const result = await mercadopago.preferences.create({
      items: [
        {
          title: insumo.nombre,
          unit_price: parseFloat(insumo.precio),
          currency_id: "ARS",
          quantity: insumo.cantidad,
        },
      ],
    });

    res.json({
      status: "1",
      msg: "El insumo fue registrado con exito.",
      date_created: result.body.date_created,
      init_point: result.body.init_point,
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al registrar el insumo. Error-" + error,
    });
  }
};

/**
 * Permite devolver la informacion de todos los insumos registrados.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
insumoCtrl.getInsumos = async (req, res) => {
  let insumos = await Insumo.find({ cantidad: { $gt: 0 } });
  res.json(insumos);
};

insumoCtrl.deleteInsumo = async (req, res) => {
  try {
    await Insumo.deleteOne({ _id: req.params.id });
    res.json({
      status: "1",
      msg: "Insumo removed",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando la operacion",
    });
  }
};

insumoCtrl.actualizarStock = async (req, res) => {
  const insumos = req.body;
  try {
    for (const insumoParam of insumos) {
      const insumoBD = await Insumo.findById(insumoParam._id);
      if (insumoBD) {
        insumoBD.cantidad -= insumoParam.cantidad;
        await insumoBD.save();
      }
    }
    res.json({
      status: "1",
      msg: "Insumos actualizados con éxito",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando la operación. Error: " + error,
    });
  }
};
insumoCtrl.getInsumosSinStock = async (req, res) => {
  let insumos = await Insumo.find({ cantidad: { $eq: 0 } });
  res.json(insumos);
};

module.exports = insumoCtrl;
