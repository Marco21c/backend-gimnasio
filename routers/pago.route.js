//defino controlador para el manejo de CRUD
const pagoCtrl = require('./../controllers/pago.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();
//definimos las rutas para la gestion de agente
router.get('/', pagoCtrl.getPagos);
router.post('/', pagoCtrl.createPago);
router.get('/:id', pagoCtrl.getPago);
router.put('/:id', pagoCtrl.editPago);
router.delete('/:id', pagoCtrl.deletePago);
router.get('/filtro/:tipo', pagoCtrl.getPagosTipo);
router.post('/checkout/plan', pagoCtrl.checkoutPlan);
router.get('/plan/activo/alumno', pagoCtrl.getPagoPlanesActivos);
router.get('/fecha/:desde/:hasta', pagoCtrl.getPagosFecha);
router.get('/plan/filtros', pagoCtrl.getCuotasFiltradas);
//exportamos el modulo de rutas
module.exports = router;