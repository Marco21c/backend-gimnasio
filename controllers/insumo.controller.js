const Insumo = require('../models/insumo');
const insumoCtrl = {};

/**
 * Permite registrar un insumo del gym.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
insumoCtrl.createInsumo = async (req, res) => {
    let insumo = new Insumo(req.body);
    try {
        await insumo.save();
        res.json({
            'status': '1',
            'msg': 'El insumo fue registrado con exito.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al registrar el insumo. Error-'+ error
        })
    }
}

/**
 * Permite devolver la informacion de todos los insumos registrados.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
insumoCtrl.getInsumos = async (req, res) => {
    let insumos = await Insumo.find();
    res.json(insumos);
}

module.exports = insumoCtrl;