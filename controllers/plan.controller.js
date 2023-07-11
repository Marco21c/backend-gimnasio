const Plan = require("../models/plan");
const HistoricoPlan = require("../models/historicoplan");
const planCtrl = {};

planCtrl.getPlanes = async (req, res) => {
  var planes = await Plan.find();
  res.json(planes);
};
planCtrl.getPlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  res.json(plan);
};
planCtrl.getPlanesActivos = async (req, res) => {
  console.log("getPlanesActivos");
  var planes = await Plan.find({ estado: "A" });
  res.json(planes);
};
/**
 * Permite registrar un plan
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
planCtrl.createPlan = async (req, res) => {
  var plan = await Plan(req.body);
  try {
    await plan.save();

    //Guardo en el historico
    var historico = new HistoricoPlan();
    historico.plan = plan;
    historico.fechaModificacion = new Date();
    historico.nuevoPrecio = plan.precio;
    await historico.save();

    res.status(200).json({
      status: "1",
      msg: "El plan se registro correctamente.",
    });
  } catch (error) {
    res.status(200).json({
      status: "0",
      msg: "Error al registrar el plan. Error-" + error,
    });
  }
};
planCtrl.editPlan = async (req, res) => {
  const plan = new Plan(req.body);
  try {
    const planDB = await Plan.findById(plan._id);

    await Plan.updateOne({ _id: req.body._id }, plan);

    //Guardo en el historico cuando se modifica el precio
    if (planDB.precio != plan.precio) {
      var historico = new HistoricoPlan();
      historico.plan = plan;
      historico.fechaModificacion = new Date();
      historico.nuevoPrecio = plan.precio;
      await historico.save();
    }
    res.json({
      status: "1",
      msg: "Plan updated",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando la operacion",
    });
  }
};
planCtrl.getHistoricoPlanes = async (req, res) => {
  var historico = await HistoricoPlan.find().populate("plan");
  res.json(historico);
};

planCtrl.deletePlan = async (req, res) => {
  try {
    await Plan.deleteOne({ _id: req.params.id });
    res.json({
      status: "1",
      msg: "Plan removed",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando la operacion",
    });
  }
};

module.exports = planCtrl;
