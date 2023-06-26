const mongoose = require('mongoose');
const {Schema} = mongoose;

const EjercicioSchema = new Schema({
    nombre:           {type: String, required: true},
    descripcion:      {type: String, required: true},
    musculoTrabajado: {type: String, required: true},
    nivelRequerido:   {type: String, required: true},
    repeticiones:     {type: Number, required: true},
    imagen:           {type: String, required: false},
    video:            {type: String, required: false},
    series:           {type: Number, required: false}
});

module.exports = mongoose.models.Ejercicio || mongoose.model('Ejercicio', EjercicioSchema);