// Importa el módulo mongoose para utilizarlo en la definición del esquema
const mongoose = require("mongoose");
const {Schema} = mongoose;

// Definicion el esquema del modelo de Usuario
const UsuarioSchema = new Schema({
    nombres:          {type: String, required: true},
    apellidos:        {type: String, required: true},
    dni:              {type: String, required: true},
    fechaNacimiento:  {type: String, required: true},
    celular:          {type: String, required: true},
    domicilio:        {type: String, required: true},
    email:            {type: String, required: true},
    username:         {type: String, required: true},
    password:         {type: String, required: true},
    rol:              {type: String, required: true}
});

// Exportar el modelo de Usuario creado a partir del esquema
module.exports = mongoose.model('Usuario', UsuarioSchema);