const mongoose = require('mongoose');
const {Schema} = mongoose;
const UsuarioSchema = require('./usuario');

const EntrenadorSchema = new Schema({
    fotoPerfil:       {type: String, required: false},
    user:             {type: Schema.Types.ObjectId, ref: UsuarioSchema, required: true},
});

module.exports = mongoose.models.Entrenador || mongoose.model('Entrenador', EntrenadorSchema);