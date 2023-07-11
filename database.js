const mongoose = require('mongoose');
//const URI = 'mongodb://0.0.0.0/tpfinal';
const URI = "mongodb+srv://admin:admin@cluster0.j6ub11k.mongodb.net/";
mongoose.connect(URI)
.then(db=>console.log('DB is connected'))
.catch(err=>console.error(err))
module.exports = mongoose;