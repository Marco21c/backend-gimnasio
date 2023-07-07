const mongoose = require('mongoose');
const {Schema} = mongoose;
const PlanSchema = require("./plan");
const AlumnoSchema = require("./alumno");
const InsumoSchema = require("./insumo");

const PagoSchema = new Schema({
    fecha:       {type: Date, require: true},
    medioPago:   {type: String, require: true},
    total:       {type: Number, require: true},
    plan:        {type: Schema.Types.ObjectId, ref: PlanSchema, required: false},
    alumno:      {type: Schema.Types.ObjectId, ref: AlumnoSchema, required: false},
    insumos:     { type: [{ type: Schema.Types.ObjectId, ref: InsumoSchema }], required: false }

});
module.exports = mongoose.models.Pago || mongoose.model('Pago', PagoSchema);