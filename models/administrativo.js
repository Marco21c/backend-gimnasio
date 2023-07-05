const mongoose = require('mongoose');
const {Schema} = mongoose;
const UsuarioSchema = require('./usuario');

const AdministrativoSchema = new Schema({
    fotoPerfil:       {type: String, required: false},
    user:             {type: Schema.Types.ObjectId, ref: UsuarioSchema, required: true},
});

module.exports = mongoose.models.Administrativo || mongoose.model('Administrativo', AdministrativoSchema);