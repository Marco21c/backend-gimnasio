const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const {Schema} = mongoose;
const UsuarioSchema = new Schema({
username: {type: String, required: true},
password: {type:String, required:true},
role:{
    type:String, enum: ['alumno','administrativo','entrenador'],
    default: 'alumno'    
}

});


//exporto objeto para que pueda ser usado en otros lugares
module.exports = mongoose.model('Usuario', UsuarioSchema);