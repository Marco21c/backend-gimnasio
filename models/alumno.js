const mongoose = require('mongoose');
const PlanSchema = require('./plan');
const RutinaSchema = require('./rutina');
const UsuarioSchema = require('./usuario');
const PublicacionSchema = require('./publicacion');

const {Schema} = mongoose;

const AlumnoSchema = new Schema({
    fechaInscripcion: {type: Date, default: Date.now, required: false},
    fotoPerfil:       {type: String, required: false},
    pesoInicial:      {type: String, required: false},
    pesoActual:       {type: String, required: false},
    nivelFisico:      {type: String, required: false},
    user:             {type: Schema.Types.ObjectId, ref: UsuarioSchema, required: true},
    plan:             {type: Schema.Types.ObjectId, ref: PlanSchema, required: false},
    rutinas:          [{type: RutinaSchema.schema, default: [], required: false}],
    publicaciones:    [{type: PublicacionSchema.schema,default: [],required:false}]
});

module.exports = mongoose.models.Alumno || mongoose.model('Alumno', AlumnoSchema);