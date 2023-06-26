const mongoose = require('mongoose')
const {Schema} = mongoose;
// A = activo (tiene un plan), I = inactivo (se le vencio el plan)
const estadosDelPlan = ['A', 'I'];

const PlanSchema = new Schema({
    nombre:          {type: String, require: true},
    descripcion:     {type: String, require: true},
    imagen:          {type: String, require: false},
    precio:          {type: Number, require: true},
    diasDisponibles: {type: Number, require: true},
    estado:          {type: String, enum: estadosDelPlan, default: 'A', require: false}
});

module.exports = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);