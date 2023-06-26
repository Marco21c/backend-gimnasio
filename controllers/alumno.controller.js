const Alumno = require('../models/alumno');
const bcrypt = require("bcrypt");
const alumnoCtrl = {}

/**
 * Permite registrar un alumno, teniendo en cuenta un plan.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.createAlumno = async (req, res) => {
    var alumno = new Alumno(req.body);
    try {
        await alumno.save();
        res.json({
            'status': '1',
            'msg': 'El alumno fue registrado con exito.'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al registrar el alumno. Error-'+ error
        })
    }
}

/**
 * Permite devolver la informacion de todos los alumnos registrados.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.getAlumnos = async (req, res) => {
    let alumnos = await Alumno.find().populate('plan');
    res.json(alumnos);
}

/**
 * Permite darle un usuario y clave (encriptada) al alumno.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.generarUsuarioClaveParaAlumno = async (req, res) => {
    const { username, password } = req.body;
    try {
        const password_encriptada = await bcrypt.hash(password, 10);
        await Alumno.findByIdAndUpdate(
            req.params.id,
            { $set: { username: username, password: password_encriptada } }
        );
        res.json({'status': '1', 'msg': 'Se genero usuario y clave para el alumno.'})
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al generar usuario y clave. error-' + error
        })
    }
}

alumnoCtrl.editAlumno = async (req, res) => {
    const valumno = new Alumno(req.body);
    try {
    await Alumno.updateOne({_id: req.body._id}, valumno);
    res.json({
    'status': '1',
    'msg': 'Alumno modificado.'
    })
    } catch (error) {
    res.status(400).json({
    'status': '0',
    'msg': 'Error procesando la operacion'
    })

}
    }

module.exports = alumnoCtrl;
