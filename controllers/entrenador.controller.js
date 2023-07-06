const Entrenador = require('../models/entrenador');
const Alumno = require("../models/alumno");
const Rutina = require("../models/rutina");
const Ejercicio = require("../models/ejercicio");
const entrenadorCtrl = {};

/**
 * Permite agregarle una rutina al alumno
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
entrenadorCtrl.agregarRutinaAlAlumno = async (req, res) => {
    if (req.userRol !== 'ENTRENADOR') {
        return res.status(403).json({'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.'});
    }

    const rutina = req.body;
    const idAlumno = req.params.idalumno;
    const idEntrenador = req.params.identrenador;

    try {
        let entrenador = await Entrenador.findById(idEntrenador);
        let alumno = await Alumno.findById(idAlumno);

        if (!entrenador) {
            return res.status(404).json({'status': '0', 'msg': 'No se encontró el entrenador.'});
        }

        if (!alumno) {
            return res.status(404).json({'status': '0', 'msg': 'No se encontró el alumno.'});
        }

        rutina.entrenador = entrenador;
        let rut = new Rutina(rutina);
        await rut.save();

        await Alumno.findByIdAndUpdate(
            idAlumno,
            {$push: {rutinas: rutina}}
        );

        res.json({'status': '1', 'msg': 'Se agrego la rutina al alumno.'});

    } catch (error) {

        res.status(400).json({
            'status': '0',
            'msg': 'Error al agregar la rutina. error-' + error
        });

    }
}

/**
 * Permite agregar ejercicio a una rutina
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
entrenadorCtrl.agregarEjerciciosARutina = async (req, res) => {

    if (req.userRol !== 'ENTRENADOR') {
        return res.status(403).json({'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.'});
    }

    try {
        const id = req.params.idrutina;
        let rutina = await Rutina.findById(id);

        if (!rutina) {
            return res.status(404).json({'status': '0', 'msg': 'No se encontró la rutina.'});
        }

        let ejercicio = new Ejercicio(req.body);
        await ejercicio.save();

        await Rutina.findByIdAndUpdate(
            id,
            {$push: {ejercicios: ejercicio}}
        );
        res.json({'status': '1', 'msg': 'Se agrego el ejercicio a la rutina.'});
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al agregar el ejercicio. error-' + error
        });
    }
}

/**
 * Permite devolver la informacion de todos los entrenadores registrados.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
entrenadorCtrl.getEntrenadores = async (req, res) => {
    let entrenadores = await Entrenador.find().populate('user');
    res.json(entrenadores);
}

/**
 * Permite devolver los ejercicios registrados.
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
entrenadorCtrl.getEjercicios = async (req, res) => {

    if (req.userRol !== 'ENTRENADOR') {
        return res.status(403).json({'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.'});
    }

    try {
        let ejercicios = await Ejercicio.find();

        res.json({
            'status': '1',
            'msg': 'Ejercicios registrados',
            'ejercicios': ejercicios
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al devolver los ejercicios. Error-' + error
        });
    }
}

entrenadorCtrl.createEjercicios = async (req, res) => {
    let ejercicio = new Ejercicio(req.body);
    try {
        await ejercicio.save();
        res.json({
            'status': '1',
            'msg': 'Ejercicio creado'
        })
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'error al crear ejercicio'
        })
    }
}

module.exports = entrenadorCtrl;