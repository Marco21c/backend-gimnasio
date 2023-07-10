const Pago = require("../models/pago");
const Alumno = require("../models/alumno");
const Plan = require("../models/plan");
const mercadopago = require("mercadopago");
const pago = require("../models/pago");
const plan = require("../models/plan");
const pagoCtrl = {};

pagoCtrl.getPagos = async (req, res) => {
  var pagos = await Pago.find().populate("alumno").populate("plan").populate("insumos");
  res.json(pagos);
};

pagoCtrl.getPagosTipo = async (req, res) => {
  const tipo = req.params.tipo;
  if (tipo == "plan") {
    var pagos = await Pago.find({ plan: { $exists: true } }).populate("alumno").populate("plan");
  } else {
    if (tipo == "insumo") {
      var pagos = await Pago.find({ insumos: { $ne: [] } }).populate("insumos");
    } else {
      res.json({
        status: "0",
        msg: "Parametro incorrecto",
      });
    }
  }
  res.json(pagos);
};
//TODO
pagoCtrl.getPagoPlanesActivos = async (req, res) => {
  const fechaActual = new Date();
  const ultimoMes = new Date();
  ultimoMes.setDate(fechaActual.getDate() - 30);
  try {
    const pagos = await Pago.find({ fecha: { $gte: ultimoMes }, plan: { $exists: true, $ne: null } })
  .populate("plan")
  .populate("alumno");
    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos con planes activos. ", error);
    res.status(500).json({ message: "Error al obtener los pagos con planes activos" });
  }
  
};

pagoCtrl.getPago = async (req, res) => {
  const pago = await Pago.findById(req.params.id).populate("alumno").populate("plan").populate("insumos");
  res.json(pago);
};

pagoCtrl.createPago = async (req, res) => {
  var pago = new Pago(req.body);
  const { plan, alumno } = req.body;

  if (pago.plan != null && pago.alumno == null)
    return res.json({
      status: "0",
      msg: "Un pago de plan debe estar asociado a un alumno",
    });
  try {
    let pagoDB = await pago.save();
    if(plan!=null){
      // Asignar plan a Alumno
      const alumnoId = alumno._id;
      const nuevoPlan = new Plan(plan);

      await Alumno.updateOne({ _id: alumnoId }, { $set: { plan: nuevoPlan } });
    }
    res.json({
      status: "1",
      msg: "Pago guardado.",
      idPago: pagoDB._id
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando operacion." + error,
    });
  }
};

pagoCtrl.editPago = async (req, res) => {
  const pago = new Pago(req.body);
  try {
    await Pago.updateOne({ _id: req.body._id }, pago);
    res.json({
      status: "1",
      msg: "Pago updated",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando la operacion",
    });
  }
};

pagoCtrl.deletePago = async (req, res) => {
  try {
    await Pago.deleteOne({ _id: req.params.id });
    res.json({
      status: "1",
      msg: "Pago removed",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando la operacion",
    });
  }
};

pagoCtrl.checkoutPlan = async (req, res) => {
  /*
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }
  */
  const { plan, alumno } = req.body;
  try {
    mercadopago.configure({
      access_token:
        "TEST-777962751549168-070413-5897e9829cf547145a939961f47ee9db-1407364081",
    });

    const result = await mercadopago.preferences.create({
      items: [
        {
          title: plan.nombre,
          unit_price: parseFloat(plan.precio),
          currency_id: "ARS",
          quantity: 1,
        },
      ],
    });

    res.json({
      status: "1",
      msg: "El pago del plan fue registrado con exito.",
      date_created: result.body.date_created,
      init_point: result.body.init_point,
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al registrar el plan. Error-" + error,
    });
  }
};
pagoCtrl.getPagosFecha = async (req, res) => {
  const fechaDesde = new Date(req.params.desde);
  const fechaHasta = new Date(req.params.hasta);
  fechaDesde.setHours(0, 0, 0, 0);
  fechaHasta.setHours(23, 59, 59, 999);
  console.log(fechaDesde);
  console.log(fechaHasta);
  try{
    const pagos = await Pago.find({ fecha: { $gte: fechaDesde, $lte: fechaHasta } })
    .populate("alumno")
    .populate("plan")
    .populate("insumos");
    res.json(pagos);
  }catch{
    res.status(500).json({ message: "Error al obtener los pagos filtrados por fecha" });
  }
};
pagoCtrl.getCuotasFiltradas = async (req, res) => {
  console.log("getCuotasFiltradas");
  const fechaDesde = new Date(req.query.desde);
  const fechaHasta = new Date(req.query.hasta);
  fechaDesde.setHours(0, 0, 0, 0);
  fechaHasta.setHours(23, 59, 59, 999);
  try {
    const pagos = await Pago.find({
      plan: { $exists: true },
      fecha: { $gte: fechaDesde, $lte: fechaHasta }
    }).populate("alumno").populate("plan");
    console.log(pagos)
    res.json(pagos);
  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = pagoCtrl;
