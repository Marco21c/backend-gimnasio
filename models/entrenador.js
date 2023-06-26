const mongoose = require('mongoose');
const {Schema} = mongoose;

const EntrenadorSchema = new Schema({
    nombres:          {type: String, required: true},
    apellidos:        {type: String, required: true},
    dni:              {type: String, required: true},
    fechaNacimiento:  {type: String, required: true},
    celular:          {type: String, required: true},
    domicilio:        {type: String, required: true},
    email:            {type: String, required: true},
    fotoPerfil:       {type: String, required: false},
    username:         {type: String, required: true},
    password:         {type: String, required: true}
});

module.exports = mongoose.models.Entrenador || mongoose.model('Entrenador', EntrenadorSchema);