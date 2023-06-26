const Entrenador = require('../models/entrenador');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const entrenadorCtrl = {};

/**
 * Permite encriptar una contraseña pasada por parametro
 * @param password
 * @returns {Promise<void|*>}
 */
async function getPasswordEncrypted(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

entrenadorCtrl.loginEntrenador = async (req, res)=>{
    try {
        const { username, password } = req.body;
        const entrenador = await Entrenador.findOne({ username });

        if (!entrenador) {
            return res.status(401).json({ error: 'No se encontró ningún entrenador con el nombre de usuario especificado.' });
        }

        const validarPassword = await bcrypt.compare(password, entrenador.password);

        if (!validarPassword) {
            return res.status(401).json({ error: 'Credenciales de inicio de sesión inválidas' });
        }

        const unToken = jwt.sign({id: entrenador._id, rol: entrenador.rol}, "secretkey");

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            username: entrenador.username,
            rol: entrenador.rol,
            userid: entrenador._id,
            token: unToken
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el proceso.' });
    }
};


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