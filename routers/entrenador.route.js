const alumnoCtrl = require('./../controllers/alumno.controller');
const express = require('express');
const router = express.Router();

/**
 * El entrenador  puede
 * - generar rutinas para alumnos
 */
router.put('/alumnos/:id/rutina', alumnoCtrl.agregarRutina);

//exportamos el modulo de rutas
module.exports = router;