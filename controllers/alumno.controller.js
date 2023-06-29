const Alumno = require('../models/alumno');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
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
        const alumnoActualizado = await Alumno.findByIdAndUpdate(
            req.params.id,
            { $set: { username: username, password: password_encriptada } },
            { new: true }
        );

        // Envia por el correo del usuario las credenciales de acceso
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: 'victor.wyman@ethereal.email',
                pass: 'hQ7u6Ee2wkY88zV8et'
            }
        });
        const correoBienvenida = generarCorreoBienvenida(alumnoActualizado, username, password);
        const info = await transporter.sendMail(correoBienvenida);
        console.log("Message sent: %s", info.messageId);

        res.json({'status': '1', 'msg': 'Se genero usuario y clave para el alumno.'})
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al generar usuario y clave. error-' + error
        })
    }
}

const generarCorreoBienvenida = (alumno, username, password) => {
    const html = `
    <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
      font-size: 30px;
      margin-bottom: 20px;
      text-align: center;
    }
    p {
      color: #555;
      font-size: 18px;
      line-height: 1.5;
    }
    .highlight {
      color: #ff6f00;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #ff6f00;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #ff8f00;
    }
  </style>

  <div class="container">
    <h1>Bienvenido(a) al gimnasio</h1>
    <p>¡Hola <span class="highlight">${alumno.nombres} ${alumno.apellidos}</span>!</p>
    <p>Tu cuenta ha sido creada exitosamente. A continuación, te proporcionamos tus credenciales de acceso:</p>
    <p><strong>Nombre de usuario:</strong> ${username}</p>
    <p><strong>Contraseña:</strong> ${password}</p>
    <p>Por favor, guarda esta información de forma segura.</p>
    <p>Te esperamos en nuestro gimnasio para que puedas comenzar a entrenar y alcanzar tus metas.</p>
    <p>¡Nos vemos pronto!</p>
    <p style="text-align: center;">
      <a href="http://localhost:4200/" target="_blank" class="button">Iniciar sesión</a>
    </p>
  </div>
  `;

    return correo = {
        from: '"Gym App 👻" <gimnasio_juy@backendG7.com>',
        to: alumno.email,
        subject: "¡Bienvenido(a)!",
        text: "¡Hola! Te damos la bienvenida.",
        html: html,
    };

};

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

/**
 * Permite obtener los datos de un alumno
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.getAlumno = async(req,res) => {
    try{
    const alumno = await Alumno.findById( req.params.idalumno);
    
    if (!alumno) {
        return res.status(404).json({
            'status': '0',
            'msg': 'No se encontró el alumno.'
        });
    }
     
    res.status(200).json(alumno);
    }catch(error){
        res.status(400).json({
            'status': '0',
            'msg': 'Error al buscar el alumno.'
        });
    }

}

alumnoCtrl.getPublicaciones = async(req,res) => {
    try {
        const alumno = await Alumno.findById(req.params.idalumno);

        if (!alumno) {
            return res.status(404).json({ 'status': '0', 'msg': 'No se encontró el alumno.' });
        }

        res.json({
            'status': '1',
            'publicaciones':  alumno.publicaciones,
            'total': alumno.publicaciones.length
        });

    } catch (error) {
        return res.status(400).json({'status': '0', 'msg': 'Error al realizar la operacion:' + error});
    }
}
alumnoCtrl.createPublicacion = async(req,res) => {
    
    const publicacion = req.body;
    try{ 
        await Alumno.findByIdAndUpdate( req.params.idalumno,{ $push: { publicaciones: publicacion} });
        res.json({'status': '1', 'msg': 'Se agrego la publicacion.'})
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al agregar la rutina. error-' + error
        })
    }
}

module.exports = alumnoCtrl;
