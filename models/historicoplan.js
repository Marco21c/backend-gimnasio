const mongoose = require('mongoose')
const {Schema} = mongoose;
const PlanSchema = require('./plan');

const HistoricoPlanSchema = new Schema({

    plan:                {type: Schema.Types.ObjectId, ref: PlanSchema, required: true},
    fechaModificacion:   {type: Date, required: true},
    nuevoPrecio:         {type: Number, require: true}
});

module.exports = mongoose.models.HistoricoPlan || mongoose.model('HistoricoPlan', HistoricoPlanSchema);