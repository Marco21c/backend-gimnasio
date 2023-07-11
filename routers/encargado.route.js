//defino controlador para el manejo de CRUD
const planCtrl = require('./../controllers/plan.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();
//definimos las rutas para la gestion de agente
router.get('/plan', planCtrl.getPlanes);
router.get('/plan/:id', planCtrl.getPlan);
router.put('/plan/:id', planCtrl.editPlan);
router.delete('/plan/:id', planCtrl.deletePlan);
router.post('/plan', planCtrl.createPlan);
router.get('/plan/filtro/activo', planCtrl.getPlanesActivos);
router.get('/planhistorico', planCtrl.getHistoricoPlanes);

//exportamos el modulo de rutas
module.exports = router;