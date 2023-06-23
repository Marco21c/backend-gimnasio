const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const {Schema} = mongoose;
const UsuarioSchema = new Schema({
username: {type: String, required: true},
password: {type:String, required:true},
rol:{type:String,required:true}
});

module.exports = mongoose.model('Usuario', UsuarioSchema);