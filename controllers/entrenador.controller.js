const Entrenador = require('../models/entrenador');
const entrenadorCtrl = {};
const bcrypt = require("bcrypt");

/**
 * Permite encriptar una contraseña pasada por parametro
 * @param password
 * @returns {Promise<void|*>}
 */
async function getPasswordEncrypted(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Permite registrar un entrenador del gym.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
entrenadorCtrl.createEntrenador = async (req, res) => {
    const { password } = req.body;
    const password_encriptada = await getPasswordEncrypted(password);
    let entrenador = new Entrenador(req.body);
    entrenador.password = password_encriptada;

    try {
        await entrenador.save();
        res.json({
            'status': '1',
            'msg': 'El entrenador fue registrado con exito.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al registrar el entrenador. Error-'+ error
        })
    }
}

/**
 * Permite devolver la informacion de todos los entrenadores registrados.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
entrenadorCtrl.getEntrenadores = async (req, res) => {
    let entrenadores = await Entrenador.find();
    res.json(entrenadores);
}

module.exports = entrenadorCtrl;