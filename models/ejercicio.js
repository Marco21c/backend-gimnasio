const mongoose = require ('mongoose');
const {Schema} = mongoose;
const EjercicioSchema = new Schema({
descripcion: {type: String, required: true},
series: {type: Number, required: true},
repeticiones: {type: Number, required: true},
nombre: {type: String, required: true},
musculoTrabajado: {type: String, required: true},
video: {type: String, required: true}
})
module.exports = mongoose.models.Ejercicio || mongoose.model('Ejercicio', EjercicioSchema);