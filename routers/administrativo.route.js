const alumnoCtrl = require('./../controllers/alumno.controller');
const entrenadorCtrl = require('./../controllers/entrenador.controller');
const planCtrl = require('./../controllers/plan.controller');
const insumoCtrl = require('./../controllers/insumo.controller');
const express = require('express');
const router = express.Router();
/**
 * Operaciones permitidas para el administrativo:
 * - Registrar alumnos
 * - Generar usuario y clave para alumnos
 * - Publicar anuncios
 * - Registrar insumos
 * - Registrar Pagos
 */
router.post('/alumno/registro', alumnoCtrl.createAlumno);
router.post('/entrenador/registro', entrenadorCtrl.createEntrenador);
router.put('/alumno/:id', alumnoCtrl.generarUsuarioClaveParaAlumno);
router.get('/alumnos', alumnoCtrl.getAlumnos);
router.get('/entrenadores', entrenadorCtrl.getEntrenadores);
router.post('/plan/registro', planCtrl.createPlan);
router.post('/insumo/registro', insumoCtrl.createInsumo);
router.get('/insumos', insumoCtrl.getInsumos);

module.exports = router;