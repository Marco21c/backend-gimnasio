const mongoose = require('mongoose');
const PlanSchema = require('./plan');
const RutinaSchema = require('./rutina');
const PublicacionSchema = require('./publicacion');

const {Schema} = mongoose;

const AlumnoSchema = new Schema({
 nombres:          {type: String, required: true},
 apellidos:        {type: String, required: true},
 dni:              {type: String, required: true},
 fechaNacimiento:  {type: String, required: true},
 celular:          {type: String, required: true},
 domicilio:        {type: String, required: true},
 email:            {type: String, required: true},
 fechaInscripcion: {type: Date, default: Date.now, required: false},
 fotoPerfil:       {type: String, required: false},
 pesoInicial:      {type: String, required: false},
 pesoActual:       {type: String, required: false},
 nivelFisico:      {type: String, required: false},
 username:         {type: String, default: "", required: false},
 password:         {type: String, default: "", required: false},
 rol:              {type: String, default: "ALUMNO", required: false},
 plan:             {type: Schema.Types.ObjectId, ref: PlanSchema, required: true},
 rutinas:          [{type: RutinaSchema.schema, default: [], required: false}],
 publicaciones:    [{type: PublicacionSchema.schema,default: [],required:false}]
});

module.exports = mongoose.models.Alumno || mongoose.model('Alumno', AlumnoSchema);