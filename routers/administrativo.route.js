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
 * Operaciones permitidas para el administrativo:
 * - Registrar alumnos
 * - Generar usuario y clave para alumnos
 * - Publicar anuncios
 * - Registrar insumos
 * - Registrar Pagos
 */
// router.post('/alumno/registro', alumnoCtrl.createAlumno);
// router.post('/entrenador/registro', entrenadorCtrl.createEntrenador);
router.post('/alumno/registro',autCtrl.verifyToken,  administrativoCtrl.createAlumno);
router.post('/alumno/:id', autCtrl.verifyToken, administrativoCtrl.enviarUsuarioClaveParaAlumno);
router.get('/alumnos', alumnoCtrl.getAlumnos);
router.get('/entrenadores', entrenadorCtrl.getEntrenadores);
router.post('/plan/registro', planCtrl.createPlan);
router.post('/insumo/registro', insumoCtrl.createInsumo);
router.get('/insumos', insumoCtrl.getInsumos);

module.exports = router;