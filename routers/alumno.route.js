//defino controlador para el manejo de CRUD
const alumnoCtrl = require('./../controllers/alumno.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();

router.post('/login', alumnoCtrl.loginAlumno);
router.put('/:idalumno/rutinas/:idrutina/asistencia', alumnoCtrl.registrarAsistencia);
router.get('/:idalumno/rutinas', alumnoCtrl.getRutinasAsignadas);
router.get('/:idalumno/asistencias', alumnoCtrl.getRutinasConAsistencia);
router.put('/:idalumno', alumnoCtrl.updateAlumno);
router.get('/:idalumno',alumnoCtrl.getAlumno);

//exportamos el modulo de rutas
module.exports = router;