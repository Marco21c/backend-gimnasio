// Importa el módulo mongoose para utilizarlo en la definición del esquema
const mongoose = require("mongoose");
const {Schema} = mongoose;

// Definicion el esquema del modelo de Usuario
const UsuarioSchema = new Schema({
    username:         {type: String, required: true},
    password:         {type: String, required: true},
    rol:              {type: String, required: true}
});

// Exportar el modelo de Usuario creado a partir del esquema
module.exports = mongoose.model('Usuario', UsuarioSchema);