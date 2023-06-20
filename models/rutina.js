const mongoose = require ('mongoose');
const {Schema} = mongoose;
const Ejercicio = require ('./ejercicio');
const RutinaSchema = new Schema({
nivelRequerido: {type: String, required: true},
caloriasTotal: {type: String, required: true},
objetivo: {type: String, required: true},
cantidadDeHoras: {type: Number, required:true},
ejercicios: {type: Schema.Types.Schema , ref: Ejercicio, required: true},
fecha: {type: String,required:true}
})
module.exports = mongoose.models.Rutina || mongoose.model('Rutina', RutinaSchema);