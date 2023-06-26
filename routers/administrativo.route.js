const alumnoCtrl = require('./../controllers/alumno.controller');
const planCtrl = require('./../controllers/plan.controller');
const express = require('express');
const router = express.Router();
/**
 * Operaciones permitidas para el administrativo:
 * - Registrar alumnos
 * - Generar usuario y clave para alumnos
 * - Publicar anuncios
 * - Registrar Ventas
 * - Registrar Pagos
 */
router.post('/alumno/registro', alumnoCtrl.createAlumno);
router.put('/alumno/:id', alumnoCtrl.generarUsuarioClaveParaAlumno);
router.get('/alumnos', alumnoCtrl.getAlumnos);
router.post('/plan/registro', planCtrl.createPlan);

module.exports = router;