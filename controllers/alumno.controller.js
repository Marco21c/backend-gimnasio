const Alumno = require('../models/alumno');
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
