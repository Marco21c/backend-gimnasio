const mongoose   = require('mongoose');
const {Schema}   = mongoose;
const Ejercicio  = require('./ejercicio');
const Entrenador = require('./entrenador');

const RutinaSchema = new Schema({
    nombre:            {type: String, required: true},
    descripcion:       {type: String, required: true},
    // principiante, intermedio, avanzado
    nivelDificultad:   {type: String, required: true},
    // ganancia de fuerza, pérdida de peso, tonificación, etc.
    objetivo:          {type: String, required: true},
    // entrenamiento cardiovascular, entrenamiento de fuerza, entrenamiento de flexibilidad, etc.
    tipoEntrenamiento: {type: String, required: true},
    fechaCreacion:     {type: Date, default: Date.now, required: false},
    ejercicios:        [{type: Ejercicio.schema, default: [], required: false}],
    entrenador:        {type: Schema.Types.ObjectId, ref: Entrenador, required: true},
    asistencia:        {type: Boolean, default: false, require: false},
});

module.exports = mongoose.models.Rutina || mongoose.model('Rutina', RutinaSchema);