/**
 * Primero se importa el framework express.
 * Se utiliza de express un modulo llamado Router.
 * Router permite el manejo de las rutas.
 * Se define las rutas.
 * Se importalas rutas para que pueda ser utilizado.
 * @type {{}|{}}
 */
const express = require('express');
const router = express.Router();
const alumnoCtrl = require('./../controllers/alumno.controller');
const administrativoCtrl = require('./../controllers/administrativo.controller');
const entrenadorCtrl = require('./../controllers/entrenador.controller');
const planCtrl = require('./../controllers/plan.controller');
const insumoCtrl = require('./../controllers/insumo.controller');
const autCtrl = require("../controllers/auth.controller");

/**
 * Enviar usuario y clave al alumno
 *
 * @route POST /alumno/:id
 * @group Administrativo
 * @param {string} id.path.required - ID del alumno
 */
router.post('/alumno/:id', autCtrl.verifyToken, administrativoCtrl.enviarUsuarioClaveParaAlumno);

/**
 * Registrar un nuevo insumo
 *
 * @route POST /insumo/registro
 * @group Administrativo
 */
router.post('/insumo/registro', autCtrl.verifyToken, administrativoCtrl.createInsumo);

/**
 * Crear un nuevo plan
 *
 * @route POST /plan/registro
 * @group Plan
 */
router.post('/plan/registro', planCtrl.createPlan);


router.delete('/alumnos/:id', autCtrl.verifyToken, administrativoCtrl.eliminarAlumno);
// TODO: FALTA TERMINAR (borrados)
// router.delete('/entrenadores/:id', autCtrl.verifyToken, administrativoCtrl.eliminarEntrenador);
// router.delete('/insumos/:id', autCtrl.verifyToken, administrativoCtrl.eliminarInsumo);
// router.delete('/planes/:id', autCtrl.verifyToken, administrativoCtrl.eliminarPlan);

// TODO: VER..
router.get('/alumnos', alumnoCtrl.getAlumnos);
router.get('/entrenadores', entrenadorCtrl.getEntrenadores);
router.get('/insumos', insumoCtrl.getInsumos);

module.exports = router;