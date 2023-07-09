const Alumno = require("../models/alumno");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const alumnoCtrl = {};

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
      return res
        .status(404)
        .json({ status: "0", msg: "No se encontró el alumno." });
    }

    const rutinaIndex = alumno.rutinas.findIndex(
      (r) => r._id.toString() === idRutina
    );

    if (rutinaIndex === -1) {
      return res
        .status(404)
        .json({ status: "0", msg: "No se encontró la rutina en el alumno." });
    }

    alumno.rutinas[rutinaIndex].asistencia = true;

    await alumno.save();

    return res.json({
      status: "1",
      msg: "Se registró la asistencia del alumno.",
    });
  } catch (error) {
    return res.status(400).json({
      status: "0",
      msg: "Error al registrar la asistencia. Error: " + error,
    });
  }
};

/**
 * Permite devolver las rutinas asignadas a un alumno en particular
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
alumnoCtrl.getRutinasAsignadas = async (req, res) => {
  const idAlumno = req.params.idalumno;

  try {
    const alumno = await Alumno.findById(idAlumno)
        .populate({
          path: "rutinas",
          populate: {
            path: "entrenador",
            model: "Entrenador",
          },
        });

    if (!alumno) {
      return res
        .status(404)
        .json({ status: "0", msg: "No se encontró el alumno." });
    }

    if (alumno.rutinas.length === 0) {
      return res.json({
        status: "1",
        msg: "El alumno no tiene rutinas asignadas.",
      });
    }

    res.json({
      status: "1",
      msg: "Lista de rutinas asignadas al alumno.",
      rutinas: alumno.rutinas,
      total: alumno.rutinas.length,
    });
  } catch (error) {
    return res.status(400).json({
      status: "0",
      msg: "Error al devolver la lista de rutinas. Error: " + error,
    });
  }
};

/**
 * Permite devolver las asistencias de un alumno junto con detalle
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
alumnoCtrl.getRutinasConAsistencia = async (req, res) => {
  const idAlumno = req.params.idalumno;

  try {
    const alumno = await Alumno.findById(idAlumno).populate({
      path: "rutinas",
      populate: {
        path: "entrenador",
        model: "Entrenador",
      },
    });

    if (!alumno) {
      return res
        .status(404)
        .json({ status: "0", msg: "No se encontró el alumno." });
    }

    if (alumno.rutinas.length === 0) {
      return res.json({
        status: "1",
        msg: "El alumno no tiene rutinas asignadas.",
      });
    }

    const rutinasRegistradas = alumno.rutinas.filter(
      (rutina) => rutina.asistencia === true
    );

    res.json({
      status: "1",
      msg: "Rutinas que asistio el alumno.",
      rutinas: rutinasRegistradas,
      rutinasAsignadas: alumno.rutinas.length,
      rutinasAsistidas: rutinasRegistradas.length,
    });
  } catch (error) {
    return res.status(400).json({
      status: "0",
      msg: "Error al devolver la lista de rutinas. Error: " + error,
    });
  }
};

/**
 * Permite actualizar los datos personales de un alumno,
 * en caso de modificar la contraseña, se volvera a encriptar
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.updateAlumno = async (req, res) => {

  // VERIFICAR SI EXISTE EL ALUMNO
  const alumnoDB  = await Alumno.findById(req.params.idalumno);

  if (!alumnoDB) {
    return res.status(404).json({
      status: "0",
      msg: "No se encontró el alumno para actualizar.",
    });
  }

  try {
    // VERIFICAR SI EXISTE EL USUARIO ASOCIADO AL ALUMNO
    const usuarioDB = await Usuario.findById(alumnoDB.user);

    if (!usuarioDB) {
      return res.status(404).json({
        status: "0",
        msg: "No se encontró el usuario para actualizar.",
      });
    }

    // VERIFICAR SI MODIFICO SU CONTRASEÑA
    if (req.body.user.password !== usuarioDB.password) {
      usuarioDB.password = await getPasswordEncrypted(req.body.user.password);
      await usuarioDB.save();
    }

    // ACTUALIZACION DE DATOS
    await Alumno.updateOne({ _id: alumnoDB._id }, req.body);

    res.json({
      status: "1",
      msg: "Se actualizaron los datos del alumno",
    });

  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al actualizar el alumno. Error: "+error,
    });
  }
};

/**
 * Permite encriptar una contraseña pasada por parametro
 * @param password
 * @returns {Promise<void|*>}
 */
async function getPasswordEncrypted(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

alumnoCtrl.createPublicacion = async (req, res) => {
  const publicacion = req.body;
  try {
    await Alumno.findByIdAndUpdate(req.params.idalumno, {
      $push: { publicaciones: publicacion },
    });
    res.json({ status: "1", msg: "Se agrego la publicacion." });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al agregar la publicacion. error-" + error,
    });
  }
};

alumnoCtrl.getPublicaciones = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.idalumno);

    if (!alumno) {
      return res
        .status(404)
        .json({ status: "0", msg: "No se encontró el alumno." });
    }

    res.json({
      status: "1",
      publicaciones: alumno.publicaciones,
      total: alumno.publicaciones.length,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "0", msg: "Error al realizar la operacion:" + error });
  }
};

/**
 * Permite devolver la informacion de todos los alumnos registrados.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.getAlumnos = async (req, res) => {
  let alumnos = await Alumno.find()
    .populate("plan")
    .populate({
      path: "rutinas",
      populate: {
        path: "entrenador",
        model: "Entrenador",
      },
    })
    .populate("user");

  res.json(alumnos);
};

/**
 * Permite obtener los datos de un alumno
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.getAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.idalumno)
      .populate("user")
      .populate("plan");

    if (!alumno) {
      return res.status(404).json({
        status: "0",
        msg: "No se encontró el alumno.",
      });
    }

    res.status(200).json(alumno);
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al buscar el alumno.",
    });
  }
};
alumnoCtrl.verificarDni = async (req, res) => {
  try {
    const alumno = await Alumno.findOne({ dni: req.params.dni });

    if (!alumno) {
      return res.status(200).json({
        status: "1",
        disponible: true,
      });
    } else {
      return res.status(200).json({
        status: "1",
        disponible: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al verificar el alumno.",
    });
  }
};

module.exports = alumnoCtrl;
