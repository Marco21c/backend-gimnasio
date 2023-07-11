const entrenadorCtrl = require('./../controllers/entrenador.controller');
const autCtrl = require('./../controllers/auth.controller');
const express = require('express');
const router = express.Router();

/**
 * Agregar rutina a un alumno
 *
 * @route PUT /:identrenador/alumnos/:idalumno/rutina
 * @group Entrenador
 * @param {string} identrenador.path.required - ID del entrenador
 * @param {string} idalumno.path.required - ID del alumno
 */
router.put('/:identrenador/alumnos/:idalumno/rutina', autCtrl.verifyToken, entrenadorCtrl.agregarRutinaAlAlumno);

/**
 * Permite devolver las rutinas que tiene asociado un entrenador.
 */
router.get('/:identrenador/rutinas', autCtrl.verifyToken, entrenadorCtrl.getRutinaAsociadas);

router.get('/rutinas', autCtrl.verifyToken, entrenadorCtrl.getRutinas);

/**
 * Permite devolver los datos de un entrenador.
 */
router.get('/:identrenador', autCtrl.verifyToken, entrenadorCtrl.getEntrenador);

/**
 * Agregar ejercicios a una rutina
 *
 * @route PUT /rutinas/:idrutina/ejercicio/registrar
 * @group Entrenador
 * @param {string} idrutina.path.required - ID de la rutina
 */
router.put('/rutinas/:idrutina/ejercicio/registrar', autCtrl.verifyToken, entrenadorCtrl.agregarEjerciciosARutina);

/**
 * Obtener la lista de ejercicios
 *
 * @route GET /ejercicios
 * @group Entrenador - Operaciones del entrenador
 * @returns {object} 200 - Lista de ejercicios
 * @security JWT
 * @returns {Error} 401 - Acceso no autorizado
 */
router.get('/ejercicios', autCtrl.verifyToken, entrenadorCtrl.getEjercicios);

/**
 * Registrar un ejercicio
 * 
 */
router.post('/ejercicios', autCtrl.verifyToken, entrenadorCtrl.createEjercicios);

//exportamos el modulo de rutas
module.exports = router;