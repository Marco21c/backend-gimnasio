const mongoose = require('mongoose');
const {Schema} = mongoose;
const PersonaSchema = new Schema({
 
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    fechaNacimiento: {type:String, required: true},
    telefono: {type:String, required:true},
    domicilio: {type: String, required: true},
    correo: {type:String, required: true}

})
module.exports = mongoose.models.Persona || mongoose.model('Persona', PersonaSchema);