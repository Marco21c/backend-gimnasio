
const planCtrl = require('../controllers/plan.controller');

const express = require('express');
const router = express.Router();

router.get('/',planCtrl.getPlanes);
router.post('/',planCtrl.createPlan);

module.exports = router;
