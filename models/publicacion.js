const mongoose = require('mongoose');
const {Schema} = mongoose;

const PublicacionSchema = new Schema({      
    fecha : {type:String, required: true},
    descripcion : {type:String,required:true},
    imagen: {type:String,required:true}
})

module.exports = mongoose.models.Publicacion || mongoose.model('Publicacion', PublicacionSchema);
