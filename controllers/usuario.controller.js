/**
 Importa los modelos de usuario y los diferentes roles (Administrativo, Entrenador, Encargado, Alumno).
 Importa los módulos bcrypt y jwt para el manejo de contraseñas y generación de tokens.
 Crea un objeto vacío llamado usuarioCtrl que se utilizará para almacenar las funciones del controlador.
 @module usuarioCtrl
 */
const Usuario = require('./../models/usuario')
const Administrativo = require('../models/administrativo');
const Entrenador = require('../models/entrenador');
const Encargado = require('../models/encargado');
const Alumno = require('../models/alumno');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioCtrl = {};

/**
 Encripta la contraseña proporcionada utilizando bcrypt.
 @param {string} password - Contraseña a encriptar.
 @returns {Promise<string>} - Promesa que resuelve en la contraseña encriptada.
 */
async function getPasswordEncrypted(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 Crea un nuevo usuario con los datos proporcionados.
 Requiere que el rol del usuario actual sea 'ADMINISTRATIVO' para acceder a este endpoint.
 @param {Object} req - Objeto de solicitud.
 @param {Object} res - Objeto de respuesta.
 @returns {Object} - Objeto JSON que indica el estado de la operación y un mensaje descriptivo.
 @throws {Object} - Objeto JSON que indica un error en caso de que ocurra algún problema durante el registro.
 */
usuarioCtrl.createUsuario = async (req, res) => {

   
    const {username, password, rol } = req.body;

    let usuarioBD = await Usuario.findOne({ username: username });
    if (usuarioBD !== null) {
      return res.status(400).json({ 'status': '0', 'msg': 'Ya existe ese username.' });
    }

    const password_encriptada = await getPasswordEncrypted(password);
    let usuario = new Usuario(req.body);
    usuario.password = password_encriptada;

    if (rol !== "ADMINISTRATIVO" && rol !== "ENTRENADOR" && rol !== "ENCARGADO" && rol !== "ALUMNO") {
        return res.status(400).json({
            status: '0',
            msg: 'El rol especificado es incorrecto.'
        });
    }

    try {
        let usuarioGuardado = await usuario.save();
        let model;
        let successMessage;

        switch (rol) {
            case "ADMINISTRATIVO":
                model = Administrativo;
                successMessage = "El administrativo fue registrado con éxito.";
                break;
            case "ENTRENADOR":
                model = Entrenador;
                successMessage = "El entrenador fue registrado con éxito.";
                break;
            case "ENCARGADO":
                model = Encargado;
                successMessage = "El encargado fue registrado con éxito.";
                break;
            case "ALUMNO":
                model = Alumno;
                successMessage = "El alumno fue registrado con éxito.";
                break;
        }

        if (model) {
            let registro;
            if(rol == "ALUMNO"){
              registro = new model({  user: usuarioGuardado._id , nombres: req.body.nombres, apellidos: req.body.apellidos, 
                                      dni: req.body.dni, fechaNacimiento: req.body.fechaNacimiento,
                                      celular: req.body.celular, domicilio: req.body.domicilio,
                                      email: req.body.email,
                                      fechaInscripcion:req.body.fechaInscripcion,
                                      fotoPerfil: req.body.fotoPerfil,
                                      pesoInicial: req.body.pesoInicial,
                                      pesoActual: req.body.pesoActual,
                                      nivelFisico: req.body.nivelFisico,
                                      plan: req.body.plan});
            }else
              registro = new model({ user: usuarioGuardado._id , nombres: req.body.nombres, apellidos: req.body.apellidos});
            var reg = await registro.save();
            return res.json({ status: '1', msg: successMessage, userId: reg._id});
        } else {
            return res.status(400).json({
                status: '0',
                msg: 'Error al registrar el usuario. Rol no válido.'
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: '0',
            msg: 'Error al registrar el usuario. Error-' + error
        });
    }
}

/**
 Realiza el inicio de sesión del usuario con las credenciales proporcionadas.
 @param {Object} req - Objeto de solicitud.
 @param {Object} res - Objeto de respuesta.
 @returns {Object} - Objeto JSON que contiene el estado del inicio de sesión, información del usuario y un token de acceso.
 @throws {Object} - Objeto JSON que indica un error en caso de que ocurra algún problema durante el inicio de sesión.
 */
usuarioCtrl.loginUsuario = async (req, res) => {
    const { username, password } = req.body;
    let userid;
    let model;

    try {
        const user = await Usuario.findOne({ username });

        if (!user) {
            return res.status(401).json({status: 0, error: 'No se encontró ningún registro con el nombre de usuario especificado.' });
        }

        const passwordCorrecta = await bcrypt.compare(password, user.password);

        if (!passwordCorrecta) {
            return res.status(401).json({status: 0, error: 'Credenciales de inicio de sesión inválidas' });
        }

        switch (user.rol) {
            case "ADMINISTRATIVO":
                model = Administrativo;
                break;
            case "ENTRENADOR":
                model = Entrenador;
                break;
            case "ENCARGADO":
                model = Encargado;
                break;
            case "ALUMNO":
                model = Alumno;
                break;
        }

        const usuarioRegistrado = await model.findOne({user: user._id}).populate('user');

        if (usuarioRegistrado) {
            userid = usuarioRegistrado._id;
        } else {
            console.log(`No se encontró ningún ${user.rol.toLowerCase()} con el nombre de usuario especificado.`);
        }

        const tokenEnviado = jwt.sign({ id: userid, rol: user.rol }, "secretkey");

        res.status(200).json({
            status: 1,
            message: 'Inicio de sesión exitoso',
            username: user.username,
            rol: user.rol,
            userid: userid,
            token: tokenEnviado
        });

    } catch (error) {
        res.status(500).json({
            status: 0,
            error: error.message
        });
    }
};

/**
 * Obtener usuario por ID
 *
 * @route GET /ruta/:id
 * @param {string} id.path.required - ID del usuario a obtener
 * @group Usuario - Operaciones relacionadas con usuarios
 * @returns {Usuario.model} 200 - Usuario encontrado
 * @returns {Error} 404 - No se encontró el usuario
 * @returns {Error} 400 - Error al buscar el usuario
 */
usuarioCtrl.getUsuario = async(req,res) => {
    try{
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                'status': '0',
                'msg': 'No se encontró el usuario.'
            });
        }

        res.status(200).json(usuario);
    }catch(error){
        res.status(400).json({
            'status': '0',
            'msg': 'Error al buscar el usuario.'
        });
    }
}

usuarioCtrl.verificarUsername = async(req,res) => {
    try{
        
        const usuario = await Usuario.findOne({ username: req.params.username});

        if (!usuario) {
            return res.status(200).json({
                'status': '1',
                'disponible': true
            });
        }else{
            return res.status(200).json({
                'status': '1',
                'disponible': false
            });
        }
    }catch(error){
        res.status(400).json({
            'status': '0',
            'msg': 'Error al verificar el usuario.'
        });
    }
}

module.exports = usuarioCtrl;
   