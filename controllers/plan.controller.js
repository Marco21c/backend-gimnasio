const Plan = require('../models/plan')
const planCtrl = {}

planCtrl.getPlanes = async(req,res) => {
     var planes = await Plan.find();
     res.json(planes);
}

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
        res.status(200).json({
            'status': '1',
            'msg': 'El plan se registro correctamente.'
        });
    } catch (error) {
        res.status(200).json({
            'status': '0',
            'msg': 'Error al registrar el plan. Error-'+ error
        });
    }
}

module.exports = planCtrl;