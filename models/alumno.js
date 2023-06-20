const mongoose = require('mongoose');
const Rutina = require ('./rutina');
const Persona = require ('./persona');

const {Schema} = mongoose;
const AlumnoSchema = new Schema({
 
 fotoPerfil: {type:String, required:true},
 peso: {type:String ,required:true},
 nivel: {type:String ,required:true},
 fechaIncripcion: {type:String ,required:true},
 rutinas: {type: Schema.Types.Schema, ref: Rutina, required: true},
 datosPersonales: {type: Schema.Types.ObjectId , ref: Persona, required: true}

})
module.exports = mongoose.models.Alumno || mongoose.model('Alumno', AlumnoSchema);