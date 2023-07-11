//defino controlador para el manejo de CRUD
const alumnoCtrl = require('./../controllers/alumno.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();

router.get('/', alumnoCtrl.getAlumnos);
router.get('/:idalumno', alumnoCtrl.getAlumno);
router.put('/:idalumno/rutinas/:idrutina/asistencia', alumnoCtrl.registrarAsistencia);
router.get('/:idalumno/rutinas', alumnoCtrl.getRutinasAsignadas);
router.get('/:idalumno/asistencias', alumnoCtrl.getRutinasConAsistencia);
router.put('/:idalumno', alumnoCtrl.updateAlumno);
router.get('/:idalumno/publicaciones', alumnoCtrl.getPublicaciones);
router.put('/:idalumno/publicacion/registrar', alumnoCtrl.createPublicacion);
router.get('/dni/:dni', alumnoCtrl.verificarDni);
router.get('/ingresos/mes', alumnoCtrl.getIngresosPorMes);

// TODO: FALTA VER EL MODIFICAR NOMBRE_USUARIO

//exportamos el modulo de rutas
module.exports = router;