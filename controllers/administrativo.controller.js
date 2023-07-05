const nodemailer = require("nodemailer");
const Alumno = require('../models/alumno');
const administrativoCtrl = {};

administrativoCtrl.createAlumno = async (req, res) => {
    // TODO:
    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }

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

administrativoCtrl.enviarUsuarioClaveParaAlumno = async (req, res) => {
    // TODO:

    if (req.userRol !== 'ADMINISTRATIVO') {
        return res.status(403).json({ 'status': '0', 'msg': 'Acceso denegado. No tienes permisos suficientes.' });
    }

    try {
        const alumno = await Alumno.findById(req.params.id).populate('user');;

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

        const correoBienvenida = generarCorreoBienvenida(alumno, alumno.user.username, alumno.user.password);
        const infoCorreoEnviado = await transporter.sendMail(correoBienvenida);
        console.log("Message sent: %s", infoCorreoEnviado.messageId);
        res.json({
            'status': '1',
            'msg': 'Se enviaron las credenciales de acceso al alumno.'
        });
    } catch (error) {
        res.status(400).json({
            'status': '0',
            'msg': 'Error al enviar las credenciales. Error-' + error
        });
    }
}

const generarCorreoBienvenida = (usuario, username, password) => {
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
    <p>¡Hola <span class="highlight">${usuario.nombres} ${usuario.apellidos}</span>!</p>
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
        from: "fetchdata03@gmail.com",
        to: usuario.email,
        subject: "¡Bienvenido(a)!",
        text: "¡Hola! Te damos la bienvenida.",
        html: html,
    };
};


module.exports = administrativoCtrl;