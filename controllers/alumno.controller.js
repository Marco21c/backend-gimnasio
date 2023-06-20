const Alumno = require('../models/alumno');
const alumnoCtrl = {}

alumnoCtrl.createAlumno = async (req, res) => {
    var alumno = new Alumno(req.body);
    try {
    await alumno.save();
    res.json({
    'status': '1',
    'msg': 'Alumno guardado.'})
    } catch (error) {
    res.status(400).json({
    'status': '0',
    'msg': 'Error procesando operacion.'})
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
