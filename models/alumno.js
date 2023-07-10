const mongoose = require('mongoose');
const PlanSchema = require('./plan');
const RutinaSchema = require('./rutina');
const UsuarioSchema = require('./usuario');
const PublicacionSchema = require('./publicacion');

const {Schema} = mongoose;

const AlumnoSchema = new Schema({
    nombres:          {type: String, required: true},
    apellidos:        {type: String, required: true},
    dni:              {type: String, required: true},
    fechaInscripcion: {type: Date, required: true},
    fechaNacimiento:  {type: String, required: false},
    celular:          {type: String, required: false},
    domicilio:        {type: String, required: false},
    email:            {type: String, required: true},
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