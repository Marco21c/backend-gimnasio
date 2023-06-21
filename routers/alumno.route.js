//defino controlador para el manejo de CRUD
const alumnoCtrl = require('./../controllers/alumno.controller');
const authMiddleware = require('../middlewares/authMiddleware');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();
//definimos las rutas para la gestion de agente
router.post('/', alumnoCtrl.createAlumno);
router.put('/:id', alumnoCtrl.editAlumno);

//exportamos el modulo de rutas
module.exports = router;