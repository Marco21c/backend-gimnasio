const Alumno = require('../models/alumno');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const alumnoCtrl = {}

/**
 * Permite encriptar una contraseña pasada por parametro
 * @param password
 * @returns {Promise<void|*>}
 */
async function getPasswordEncrypted(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

alumnoCtrl.loginAlumno = async (req, res)=>{
    try {
        const { username, password } = req.body;
        const alumno = await Alumno.findOne({ username });

        if (!alumno) {
            return res.status(401).json({ error: 'No se encontró ningún alumno con el nombre de usuario especificado.' });
        }

        const validarPassword = await bcrypt.compare(password, alumno.password);

        if (!validarPassword) {
            return res.status(401).json({ error: 'Credenciales de inicio de sesión inválidas' });
        }

        const unToken = jwt.sign({id: alumno._id, rol: alumno.rol}, "secretkey");
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            username: alumno.username,
            rol: alumno.rol,
            userid: alumno._id,
            token: unToken
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el proceso.' });
    }
};

/**
 * Permite registrar un alumno, teniendo en cuenta un plan.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.createAlumno = async (req, res) => {
    let alumno = new Alumno(req.body);
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
    let alumnos = await Alumno.find().populate('plan').populate({
        path: 'rutinas',
        populate: {
            path: 'entrenador',
            model: 'Entrenador',
        },
    });
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
        const password_encriptada = await getPasswordEncrypted(password);
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

/**
 * Permite agregarle una rutina al alumno
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.agregarRutina = async (req, res) => {
    if (req.userRol !== 'ENTRENADOR') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }

    const rutina = req.body;
    try {
        await Alumno.findByIdAndUpdate(
            req.params.id,
            { $push: { rutinas: rutina } }
        );
        res.json({'status': '1', 'msg': 'Se agrego la rutina al alumno.'})
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al agregar la rutina. error-' + error
        })
    }
}

/**
 * Permite registrar la asistencia de una rutina
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.registrarAsistencia = async (req, res) => {
    const idAlumno = req.params.idalumno;
    const idRutina = req.params.idrutina;
    try {
        let alumno = await Alumno.findById(idAlumno);
        if (!alumno) {
            return res.status(404).json({'status': '0', 'msg': 'No se encontró el alumno.'});
        }

        const rutinaIndex = alumno.rutinas.findIndex(r => r._id.toString() === idRutina);

        if (rutinaIndex === -1) {
            return res.status(404).json({'status': '0', 'msg': 'No se encontró la rutina en el alumno.'});
        }

        alumno.rutinas[rutinaIndex].asistencia = true;
        await alumno.save();
        return res.json({'status': '1', 'msg': 'Se registró la asistencia del alumno.'});
    } catch (error) {
        return res.status(400).json({'status': '0', 'msg': 'Error al registrar la asistencia. Error: ' + error});
    }
}

/**
 * Permite devolver las rutinas asignadas a un alumno en particular
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
alumnoCtrl.getRutinasAsignadas = async (req, res) => {
    const idAlumno = req.params.idalumno;

    try {
        const alumno = await Alumno.findById(idAlumno);

        if (!alumno) {
            return res.status(404).json({ 'status': '0', 'msg': 'No se encontró el alumno.' });
        }

        if (alumno.rutinas.length === 0) {
            return res.json({ 'status': '1', 'msg': 'El alumno no tiene rutinas asignadas.' });
        }

        res.json({
            'status': '1',
            'msg': 'Lista de rutinas asignadas al alumno.',
            'rutinas':  alumno.rutinas,
            'total': alumno.rutinas.length
        });

    } catch (error) {
        return res.status(400).json({'status': '0', 'msg': 'Error al devolver la lista de rutinas. Error: ' + error});
    }
}

/**
 * Permite devolver las asistencias de un alumno junto con detalle
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
alumnoCtrl.getRutinasConAsistencia = async (req, res) => {
    const idAlumno = req.params.idalumno;

    try {
        const alumno = await Alumno.findById(idAlumno);

        if (!alumno) {
            return res.status(404).json({'status': '0', 'msg': 'No se encontró el alumno.'});
        }

        if (alumno.rutinas.length === 0) {
            return res.json({'status': '1', 'msg': 'El alumno no tiene rutinas asignadas.'});
        }

        const rutinasRegistradas = alumno.rutinas.filter(rutina => rutina.asistencia === true);

        res.json({
            'status': '1',
            'msg': 'Rutinas que asistio el alumno.',
            'rutinas': rutinasRegistradas,
            'rutinasAsignadas': alumno.rutinas.length,
            'rutinasAsistidas': rutinasRegistradas.length
        });

    } catch (error) {
        return res.status(400).json({'status': '0', 'msg': 'Error al devolver la lista de rutinas. Error: ' + error});
    }
}

/**
 * Permite actualizar los datos personales de un alumno,
 * en caso de modificar la contraseña, se volvera a encriptar
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.updateAlumno = async (req, res) => {
    const alumnoId = req.params.idalumno;

    try {
        const alumno = await Alumno.findById(alumnoId);

        if (!alumno) {
            return res.status(404).json({
                'status': '0',
                'msg': 'No se encontró el alumno para actualizar.'
            });
        }

        // Verificar si modifico la contraseña
        req.body.password = req.body.password ? await getPasswordEncrypted(req.body.password) : alumno.password;

        await Alumno.findByIdAndUpdate(alumnoId, req.body);

        res.json({
            'status': '1',
            'msg': 'Datos personales actualizados.'
        });

    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al actualizar los datos personales.'
        });
    }
}

module.exports = alumnoCtrl;
