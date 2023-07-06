const mongoose = require('mongoose')
const {Schema} = mongoose;

const InsumoSchema = new Schema({
    nombre:      {type: String, require: true},
    descripcion: {type: String, require: true},
    precio:      {type: Number, require: true},
    imagen:      {type: String, require: true},
    categoria:   {type: String, require: true},
    cantidad:    {type: Number, require: true}
});

module.exports = mongoose.models.Insumo || mongoose.model('Insumo', InsumoSchema);