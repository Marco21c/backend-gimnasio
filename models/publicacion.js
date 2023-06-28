const mongoose = require('mongoose');
const {Schema} = mongoose;

const PublicacionSchema = new Schema({
       
    foto : {type:String, required: true},
    descripcion : {type:String,required:true}
})

module.exports = mongoose.models.Publicacion || mongoose.model('Publicacion', PublicacionSchema);
