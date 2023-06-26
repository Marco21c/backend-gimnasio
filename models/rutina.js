const mongoose = require('mongoose');
const {Schema} = mongoose;
const Ejercicio = require('./ejercicio');

const RutinaSchema = new Schema({
    nombre:            {type: String, required: true},
    descripcion:       {type: String, required: true},
    // principiante, intermedio, avanzado
    nivelDificultad:   {type: String, required: true},
    // ganancia de fuerza, pérdida de peso, tonificación, etc.
    objetivo:          {type: String, required: true},
    // entrenamiento cardiovascular, entrenamiento de fuerza, entrenamiento de flexibilidad, etc.
    tipoEntrenamiento: {type: String, required: true},
    fechaCreacion:     {type: String, required: true},
    ejercicios:        [{type: Ejercicio.schema, default: [], required: false}]
});

module.exports = mongoose.models.Rutina || mongoose.model('Rutina', RutinaSchema);