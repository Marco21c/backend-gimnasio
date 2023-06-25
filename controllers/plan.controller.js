const Plan = require('../models/plan')
const planCtrl = {}

planCtrl.getPlanes = async(req,res) => {
     var planes = await Plan.find();
     res.json(planes);
}

planCtrl.createPlan = async(req,res) => {
     var plan = await Plan(req.body);
     try{
        await plan.save(); 
        res.status(200).json({
            'status':'1',
            'msg':'Se creo un plan correctamente.'
        })
     }catch(error){
        res.status(200).json({
            'status':'0',
            'msg':'Error al crear un plan.'
        }) 
     }
}

module.exports = planCtrl;