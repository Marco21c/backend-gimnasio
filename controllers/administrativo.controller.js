const nodemailer = require("nodemailer");
const Alumno = require('../models/alumno');
const Insumo = require("../models/insumo");
const Usuario = require('../models/usuario');
const mercadopago = require("mercadopago");
const administrativoCtrl = {};

/**
 * Permite registrar un insumo del gym.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
administrativoCtrl.createInsumo = async (req, res) => {

    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.'});
    }

    try {
        let insumo = new Insumo(req.body);
        mercadopago.configure({
            access_token: 'TEST-777962751549168-070413-5897e9829cf547145a939961f47ee9db-1407364081'
        });

        const result = await mercadopago.preferences.create({
            items: [{
                title: insumo.nombre,
                unit_price: parseFloat(insumo.precio),
                currency_id: "ARS",
                quantity: insumo.cantidad
            }]
        });

        await insumo.save();

        res.json({
            'status': '1',
            'msg': 'El insumo fue registrado con exito.',
            'date_created': result.body.date_created,
            'init_point': result.body.init_point,
        });

    } catch (error) {
        res.status(400).json({
            'status': '0', 'msg': 'Error al registrar el insumo. Error-' + error
        })
    }
}

/**
 * Enviar usuario y clave al alumno
 *
 * @route POST /ruta/:id/enviar-credenciales
 * @param {string} id.path.required - ID del alumno
 * @group Administrativo - Operaciones administrativas
 * @returns {object} 200 - Respuesta de éxito
 * @returns {Error} 400 - Error al enviar las credenciales
 * @returns {Error} 403 - Acceso denegado
 */
administrativoCtrl.enviarUsuarioClaveParaAlumno = async (req, res) => {

    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }

    try {
        const alumno = await Alumno.findById(req.params.id).populate('user');

        // Envia por el correo del usuario las credenciales de acceso
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'fetchdata03@gmail.com',
                pass: 'ugvoexamfmdmldoi'
            }
        });

        const correoBienvenida = generarCorreoBienvenida(alumno);
        const infoCorreoEnviado = await transporter.sendMail(correoBienvenida);
        console.log("Message sent: %s", infoCorreoEnviado.messageId);
        res.json({
            'status': '1', 'msg': 'Se enviaron las credenciales de acceso al alumno.'
        });
    } catch (error) {
        res.status(400).json({
            'status': '0', 'msg': 'Error al enviar las credenciales. Error-' + error
        });
    }
}

/**
 * Generar correo de bienvenida para el alumno
 *
 * @param {object} usuario - Objeto de modelo de alumno
 * @returns {object} - Objeto de correo de bienvenida
 */
const generarCorreoBienvenida = (usuario) => {
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
    <p>¡Hola <span class="highlight">${usuario.user.nombres} ${usuario.user.apellidos}</span>!</p>
    <p>Tu cuenta ha sido creada exitosamente. A continuación, te proporcionamos tus credenciales de acceso:</p>
    <p><strong>Nombre de usuario:</strong> ${usuario.user.username}</p>
    <p><strong>Contraseña:</strong> ${usuario.user.password}</p>
    <p>Por favor, guarda esta información de forma segura.</p>
    <p>Te esperamos en nuestro gimnasio para que puedas comenzar a entrenar y alcanzar tus metas.</p>
    <p>¡Nos vemos pronto!</p>
    <p style="text-align: center;">
      <a href="http://localhost:4200/" target="_blank" class="button">Iniciar sesión</a>
    </p>
  </div>
  `;

    return correo = {
        from: "fetchdata03@gmail.com",
        to: usuario.user.email,
        subject: "¡Bienvenido(a)!",
        text: "¡Hola! Te damos la bienvenida.",
        html: html,
    };
};

administrativoCtrl.eliminarAlumno = async (req, res) => {
    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }
    try {
        const alumno = await Alumno.findById(req.params.id);
        await Usuario.deleteOne({_id: alumno.user});
        await Alumno.deleteOne(alumno._id);       

        res.json({
            status: '1',
            msg: 'Alumno eliminado correctamente.'
        });

    } catch (error) {
        res.status(400).json({'status': '0', 'msg': 'Error processing operation.'})
    }
}

administrativoCtrl.eliminarEntrenador = async (req, res) => {
    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }
    // TODO
}

administrativoCtrl.eliminarPlan = async (req, res) => {
    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }
    // TODO
}

administrativoCtrl.eliminarInsumo = async (req, res) => {
    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }
    // TODO
}


module.exports = administrativoCtrl;