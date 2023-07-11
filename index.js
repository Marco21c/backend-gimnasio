/**
 Se importa el framework express y el módulo cors para el manejo de solicitudes HTTP.
 Se importa el módulo mongoose para la conexión a la base de datos.
 Se crea una instancia de la aplicación express.
 Se configuran los middlewares: express.json() para el manejo de datos en formato JSON y cors() para permitir el acceso desde http://localhost:4200.
 Se cargan los módulos de direccionamiento de rutas correspondientes a los diferentes recursos: usuario, alumno, plan, administrativo y entrenador.
 Se configura el puerto en el que se ejecutará el servidor.
 Se inicia el servidor y se muestra un mensaje en la consola indicando el puerto en el que se está ejecutando.
 @module app
 */
const express = require('express');
const cors = require('cors');
const {mongoose} = require('./database');
var app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:4200'}));

app.use('/api/user', require('./routers/usuario.route.js'));
app.use('/api/alumno', require('./routers/alumno.route.js'));
app.use('/api/admin', require('./routers/administrativo.route'));
app.use('/api/entrenador', require('./routers/entrenador.route'));
app.use('/api/pago', require('./routers/pago.route'));
app.use('/api/encargado', require('./routers/encargado.route'));

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
console.log(`Server started on port`, app.get('port'));
});