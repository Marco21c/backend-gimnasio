const nodemailer = require("nodemailer");
const Alumno = require("../models/alumno");
const Insumo = require("../models/insumo");
const Usuario = require("../models/usuario");
const Pago = require("../models/pago");
const mercadopago = require("mercadopago");
const { checkout } = require("../routers/alumno.route");
const administrativoCtrl = {};

/**
 * Permite registrar un insumo del gym.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
administrativoCtrl.createInsumo = async (req, res) => {
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }

  var insumo = new Insumo(req.body);
  console.log(insumo);
  try {
    await insumo.save();
    res.json({
      status: "1",
      msg: "Insumo guardado.",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando operacion.",
    });
  }
};

administrativoCtrl.checkout = async (req, res) => {
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }

  try {
    const insumos = req.body; // Array de Insumo

    const items = insumos.map((insumo) => {
      return {
        title: insumo.nombre,
        unit_price: parseFloat(insumo.precio),
        currency_id: "ARS",
        quantity: 1,
      };
    });

    mercadopago.configure({
      access_token:
        "TEST-777962751549168-070413-5897e9829cf547145a939961f47ee9db-1407364081",
    });

    const result = await mercadopago.preferences.create({
      items: items,
    });

    res.json({
      status: "1",
      date_created: result.body.date_created,
      init_point: result.body.init_point,
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error procesando operacion.",
    });
  }
};

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
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }

  try {
    const alumno = await Alumno.findById(req.params.id).populate("user");

    // Envia por el correo del usuario las credenciales de acceso
    const pass = req.body.pass;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "fetchdata03@gmail.com",
        pass: "ugvoexamfmdmldoi",
      },
    });

    const correoBienvenida = generarCorreoBienvenida(alumno, pass);
    const infoCorreoEnviado = await transporter.sendMail(correoBienvenida);
    console.log("Message sent: %s", infoCorreoEnviado.messageId);
    res.json({
      status: "1",
      msg: "Se enviaron las credenciales de acceso al alumno.",
    });
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al enviar las credenciales. Error-" + error,
    });
  }
};

/**
 * Generar correo de bienvenida para el alumno
 *
 * @param {object} usuario - Objeto de modelo de alumno
 * @returns {object} - Objeto de correo de bienvenida
 */
const generarCorreoBienvenida = (usuario, pass) => {
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
    <p><strong>Nombre de usuario:</strong> ${usuario.user.username}</p>
    <p><strong>Contraseña:</strong> ${pass}</p>
    <p>Por favor, guarda esta información de forma segura.</p>
    <p>Te esperamos en nuestro gimnasio para que puedas comenzar a entrenar y alcanzar tus metas.</p>
    <p>¡Nos vemos pronto!</p>
    <p style="text-align: center;">
      <a href="http://localhost:4200/" target="_blank" class="button">Iniciar sesión</a>
    </p>
  </div>
  `;

  return (correo = {
    from: "fetchdata03@gmail.com",
    to: usuario.email,
    subject: "¡Bienvenido(a)!",
    text: "¡Hola! Te damos la bienvenida.",
    html: html,
  });
};
administrativoCtrl.enviarFacutura = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id).populate("plan").populate("alumno").populate("insumos");
    // Envia por el correo del usuario las credenciales de acceso
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "fetchdata03@gmail.com",
        pass: "ugvoexamfmdmldoi",
      },
    });

    const correo = generarCorreoFactura(pago);
    const infoCorreoEnviado = await transporter.sendMail(correo);
    console.log("Message sent: %s", infoCorreoEnviado.messageId);
    res.json({
      status: "1",
      msg: "Se envió la factura al cliente.",
    });
    
  } catch (error) {
    res.status(400).json({
      status: "0",
      msg: "Error al enviar la factura. Error-" + error,
    });
  }
  
};

//TODO: no funciona row
const generarCorreoFactura = (pago) => {
  let nroFact = Math.floor(Math.random() * 9000) + 1000;
  let fechaFormateada = pago.fecha.toLocaleDateString();
  let row;
  if (pago.plan == null) {
    row = pago.insumos.map(function(insumo) {
      return `<tr class="item"><td>${insumo.nombre}</td><td>$ ${insumo.precio}</td></tr>`;
    }).join('');
  }else{
    row = `
    <tr class="item">
      <td>Plan: ${pago.plan.nombre}</td>
      <td>$ ${pago.plan.precio}</td>
    </tr>
  `
  }
  const html = `
  <head><style>.invoice-box{max-width:800px;margin:auto;padding:30px;border:1px solid #eee;box-shadow:0 0 10px rgba(0,0,0,.15);font-size:16px;line-height:24px;font-family:'Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;color:#555}.invoice-box table{width:100%;line-height:inherit;text-align:left}.invoice-box table td{padding:5px;vertical-align:top}.invoice-box table tr td:nth-child(2){text-align:right}.invoice-box table tr.top table td{padding-bottom:20px}.invoice-box table tr.top table td.title{font-size:45px;line-height:45px;color:#333}.invoice-box table tr.information table td{padding-bottom:40px}.invoice-box table tr.heading td{background:#eee;border-bottom:1px solid #ddd;font-weight:bold}.invoice-box table tr.details td{padding-bottom:20px}.invoice-box table tr.item td{border-bottom:1px solid #eee}.invoice-box table tr.item.last td{border-bottom:none}.invoice-box table tr.total td:nth-child(2){border-top:2px solid #eee;font-weight:bold}@media only screen and (max-width:600px){.invoice-box table tr.top table td{width:100%;display:block;text-align:center}.invoice-box table tr.information table td{width:100%;display:block;text-align:center}}.invoice-box.rtl{direction:rtl;font-family:Tahoma,'Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif}.invoice-box.rtl table{text-align:right}.invoice-box.rtl table tr td:nth-child(2){text-align:left}</style></head>
  <body><div class="invoice-box"><table cellpadding="0" cellspacing="0"><tr class="top"><td colspan="2"><table><tr><td class="title"><img src="https://fitnessformulax.com/wp-content/uploads/2023/05/cropped-fintness-logo.png" style="width: 100%; max-width: 150px" />
  </td><td>Factura #: ${nroFact} <br />Fecha: ${fechaFormateada} <br /></td></tr></table></td></tr><tr class="information"><td colspan="2"><table><tr><td>Fitness Center, Inc.<br />Calle Falsa 123<br />San Salvador de Jujuy, Jujuy</td><td> ${pago.alumno?.apellidos + pago.alumno?.nombres} 
  <br/> DNI: ${pago.alumno?.dni} <br/>${pago.alumno?.email}</td></tr></table></td></tr><tr class="heading"><td>Metodo de Pago</td><td></td></tr><tr class="details"><td>Efectivo</td><td></td></tr><tr class="heading"><td>Productos</td><td>Precio</td></tr>
  ${row}
  <tr class="total"><td></td><td><strong>Total: $ ${pago.total}</strong></td></tr></table></div></body>
  `;

  return (correo = {
    from: "fetchdata03@gmail.com",
    to: pago.alumno.email,
    subject: "Te enviamos tu factura",
    text: "Gracias por confiar en nosotros",
    html: html,
  });
};

administrativoCtrl.eliminarAlumno = async (req, res) => {
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }
  try {
    const alumno = await Alumno.findById(req.params.id);
    await Usuario.deleteOne({ _id: alumno.user });
    await Alumno.deleteOne(alumno._id);

    res.json({
      status: "1",
      msg: "Alumno eliminado correctamente.",
    });
  } catch (error) {
    res.status(400).json({ status: "0", msg: "Error processing operation." });
  }
};

administrativoCtrl.eliminarEntrenador = async (req, res) => {
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }
  // TODO
};

administrativoCtrl.eliminarPlan = async (req, res) => {
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }
  // TODO
};

administrativoCtrl.eliminarInsumo = async (req, res) => {
  if (req.userRol !== "ADMINISTRATIVO") {
    return res.status(403).json({
      status: "0",
      msg: "Acceso denegado. No tienes permisos suficientes.",
    });
  }
  // TODO
};


module.exports = administrativoCtrl;
