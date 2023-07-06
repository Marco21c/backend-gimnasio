const mongoose = require('mongoose');
const {Schema} = mongoose;
const UsuarioSchema = require('./usuario');

const EntrenadorSchema = new Schema({
    nombres:          {type: String, required: true},
    apellidos:        {type: String, required: true},
    fotoPerfil:       {type: String, required: false},
    user:             {type: Schema.Types.ObjectId, ref: UsuarioSchema, required: true},
});

module.exports = mongoose.models.Entrenador || mongoose.model('Entrenador', EntrenadorSchema);