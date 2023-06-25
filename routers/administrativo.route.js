const alumnoCtrl = require('./../controllers/alumno.controller');
const planCtrl = require('./../controllers/plan.controller');
const express = require('express');
const router = express.Router();

router.post('/alumno/registro', alumnoCtrl.createAlumno);
// router.get('/alumnos', alumnoCtrl.getAlumnos);
router.post('/plan/registro', planCtrl.createPlan);

module.exports = router;