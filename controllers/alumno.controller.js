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
  const dia = req.query.dia;
  const mes = req.query.mes;
  console.log(req.url)

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

    var rutinasFiltradas = alumno.rutinas;

    // Filtrar rutinas por días si se proporciona el parámetro "dia"
    if (dia) {
      const diasSemana = {
        domingo: 0,
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6
      };
      const diaNumerico = diasSemana[dia]; // Utiliza la variable "dia" en lugar de "req.query.dia"
      rutinasFiltradas = rutinasFiltradas.filter((rutina) => {
        const fechaCreacion = new Date(rutina.fechaCreacion);
        return fechaCreacion.getDay() === diaNumerico;
      });
    }

    // Filtrar rutinas por meses si se proporciona el parámetro "mes"
    if (mes) {
      const mesesAnio = {
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11
      };
      const mesNumerico = mesesAnio[mes];
      rutinasFiltradas = rutinasFiltradas.filter((rutina) => {
        const fechaCreacion = new Date(rutina.fechaCreacion);
        return fechaCreacion.getMonth() === mesNumerico;
      });
    }

    const rutinasRegistradas = rutinasFiltradas.filter(
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
      msg: error.message,
    });
  }
};

// Módulo para verificar la existencia del alumno
async function verificarExistenciaAlumno(alumnoId) {
  const alumnoDB = await Alumno.findById(alumnoId);

  if (!alumnoDB) {
    throw new Error("No se encontró el alumno para actualizar.");
  }

  return alumnoDB;
}

// Módulo para verificar la existencia del usuario asociado al alumno
async function verificarExistenciaUsuario(alumnoDB) {
  const usuarioDB = await Usuario.findById(alumnoDB.user);

  if (!usuarioDB) {
    throw new Error("No se encontró el usuario para actualizar.");
  }

  return usuarioDB;
}

// Módulo para verificar y actualizar la contraseña
async function verificarYActualizarPassword(reqBodyUser, usuarioDB) {
  if (reqBodyUser.password !== usuarioDB.password) {
    usuarioDB.password = await getPasswordEncrypted(reqBodyUser.password);
    await usuarioDB.save();
  }
}

// Módulo para verificar y actualizar el DNI
async function verificarYActualizarDNI(reqBodyDNI, alumnoDB) {
  if (reqBodyDNI !== alumnoDB.dni) {
    const existeAlumnoConDNI = await Alumno.exists({ dni: reqBodyDNI });

    if (existeAlumnoConDNI) {
      throw new Error("El DNI especificado ya existe.");
    }
  }
}

// Módulo para verificar y actualizar el nombre de usuario
async function verificarYActualizarUsername(reqBodyUsername, usuarioDB) {
  if (reqBodyUsername !== usuarioDB.username) {
    const existeUsuarioConUsername = await Usuario.exists({ username: reqBodyUsername });

    if (existeUsuarioConUsername) {
      throw new Error("El username especificado ya existe.");
    } else {
      usuarioDB.username = reqBodyUsername;
      await usuarioDB.save();
    }
  }
}

// Módulo para actualizar los datos del alumno
async function actualizarDatosAlumno(alumnoId, reqBody) {
  await Alumno.updateOne({ _id: alumnoId }, reqBody);
}

/**
 * Permite actualizar los datos personales de un alumno,
 * en caso de modificar la contraseña, se volvera a encriptar
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
alumnoCtrl.updateAlumno = async (req, res) => {
  try {
    const alumnoDB = await verificarExistenciaAlumno(req.params.idalumno);
    const usuarioDB = await verificarExistenciaUsuario(alumnoDB);

    await verificarYActualizarPassword(req.body.user, usuarioDB);
    await verificarYActualizarDNI(req.body.dni, alumnoDB);
    await verificarYActualizarUsername(req.body.user.username, usuarioDB);

    await actualizarDatosAlumno(alumnoDB._id, req.body);

    res.json({
      status: "1",
      msg: "Se actualizaron los datos del alumno",
    });

  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: error.message,
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
  console.log(`Fecha de consulta: ${new Date().toISOString()} - URL: ${req.url}`);
  const { dni, plan, apellidos, nombres, email } = req.query;
  console.log('Filtros recibidos:', dni, plan, apellidos, nombres, email);

  const criteria = {};

  if (dni) {
    criteria.dni = dni;
  }

  if (plan) {
    criteria.plan = plan;
  }

  if (apellidos) {
    criteria.apellidos = { $regex: `.*${apellidos}.*`, $options: "i" };
  }

  if (nombres) {
    criteria.nombres = { $regex: `.*${nombres}.*`, $options: "i" };
  }

  if (email) {
    criteria.email = email;
  }

  console.log('Criteria:', criteria);

  let alumnos = await Alumno.find(criteria)
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
      msg: error.message
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
alumnoCtrl.getIngresosPorMes = async (req, res) => {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1

  let ingresosPorMes = [];
  
  for (let mes = 1; mes <= mesActual; mes++) {
    const fechaInicioMes = new Date(anioActual, mes - 1, 1, 0, 0, 0); // Fecha de inicio del mes a las 00:00:00
    const ultimoDiaMes = new Date(anioActual, mes, 0); // Último día del mes
    const fechaFinMes = new Date(anioActual, mes - 1, ultimoDiaMes.getDate(), 23, 59, 59, 999); // Fecha de fin del mes a las 23:59:59
    
    const alumnosInscritos = await Alumno.find({
      fechaInscripcion: { $gte: fechaInicioMes, $lte: fechaFinMes },
    });
    
    ingresosPorMes.push({
      mes: mes,
      mesNombre: new Date(0, mes-1).toLocaleString('default', { month: 'long' }),
      anio: anioActual,
      alumnosInscritos: alumnosInscritos.length,
    });
  }
  
  res.json(ingresosPorMes);
};

module.exports = alumnoCtrl;
