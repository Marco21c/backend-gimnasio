const alumnoCtrl = require('./../controllers/alumno.controller');
const entrenadorCtrl = require('./../controllers/entrenador.controller');
const autCtrl = require('./../controllers/auth.controller');
const express = require('express');
const router = express.Router();

/**
 * El entrenador  puede
 * - generar rutinas para alumnos
 */
router.post('/login', entrenadorCtrl.loginEntrenador);
router.put('/alumnos/:id/rutina', autCtrl.verifyToken, alumnoCtrl.agregarRutina);

//exportamos el modulo de rutas
module.exports = router;