const Entrenador = require('../models/entrenador');
const Alumno = require("../models/alumno");
const Rutina = require("../models/rutina");
const Ejercicio = require("../models/ejercicio");
const entrenadorCtrl = {};

entrenadorCtrl.getRutinas = async (req, res) => {
    if (req.userRol !== 'ENTRENADOR') {
        return res.status(403).json({'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.'});
    }

    try {
        const rutinas = await Rutina.find();

        res.json({
            status: '1',
            msg: 'Ok',
            rutinas: rutinas
        });
    } catch (error) {
        res.status(400).json({
            status: '0',
            msg: error.message
        });
    }
}

entrenadorCtrl.getRutinaAsociadas = async (req, res) => {

    if (req.userRol !== 'ENTRENADOR') {
        return res.status(403).json({'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.'});
    }

    const idEntrenador = req.params.identrenador;

    try {
        const rutinasAsociadas = [];

        const alumnos = await Alumno.find().populate('rutinas');

        for (const alumno of alumnos) {
            for (const rutina of alumno.rutinas) {
                if (rutina.entrenador.toString() === idEntrenador) {
                    rutinasAsociadas.push(rutina);
                }
            }
        }

        res.json({
            'status': '1',
            'msg': 'Se obtuvieron las rutinas asociadas al entrenador.',
            rutinas: rutinasAsociadas
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': error.message
        });
    }
}

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

        // Iterar sobre los ejercicios de la rutina y guardarlos individualmente. SI tiene ejercicios para guardar
        if (rutina.ejercicios.length !== 0) {
            for (const ejercicio of rutina.ejercicios) {
                const nuevoEjercicio = new Ejercicio(ejercicio);
                await nuevoEjercicio.save();
            }
        }

        await rut.save();

        await Alumno.findByIdAndUpdate(
            idAlumno,
            {$push: {rutinas: rut}}
        );

        res.json({'status': '1', 'msg': 'Se agrego la rutina al alumno.'});

    } catch (error) {

        res.status(400).json({
            'status': '0',
            'msg':  error.message
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

        await Alumno.updateOne(
            { "rutinas._id": rutina._id },
            { $push: { "rutinas.$[rutina].ejercicios": ejercicio } },
            { arrayFilters: [{ "rutina._id": rutina._id }] }
        );

        res.json({'status': '1', 'msg': 'Se agrego el ejercicio a la rutina.'});
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': error.message
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

entrenadorCtrl.getEntrenador = async (req, res) => {
    try {
        let entrenador = await Entrenador.findById(req.params.identrenador);

        if (!entrenador) {
            return res.status(404).json({'status': '0', 'msg': 'No se encontró el entrenador.'});
        }

        res.json({'status': '1',
            'msg': 'Se encontro al entrenador.',
            'result': entrenador
        });

    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg':  error.message
        });
    }
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
            'msg': error.message
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
            'msg': error.message
        })
    }
}

module.exports = entrenadorCtrl;