const mongoose = require('mongoose')

const {Schema} = mongoose;

const PlanSchema = new Schema ({
      nombre : {type: String,require:true},
      precio : {type:Number,require:true},
      descripcion : {type:String,require:true}
})

module.exports = mongoose.models.Plan || mongoose.model('Plan',PlanSchema);