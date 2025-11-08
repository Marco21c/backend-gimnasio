const mongoose = require('mongoose');
//const URI = 'mongodb://0.0.0.0/tpfinal';
const URI = "mongodb+srv://marcosecondori_db_user:IVci3XRNrXXtM6CO@cluster0.4qhneau.mongodb.net/?appName=Cluster0";
mongoose.connect(URI)
.then(db=>console.log('DB is connected'))
.catch(err=>console.error(err))
module.exports = mongoose;