//defino controlador para el manejo de CRUD
const alumnoCtrl = require('./../controllers/alumno.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();

router.post('/login', alumnoCtrl.loginAlumno);
router.put('/:idalumno/rutinas/:idrutina/asistencia', alumnoCtrl.registrarAsistencia);

//exportamos el modulo de rutas
module.exports = router;