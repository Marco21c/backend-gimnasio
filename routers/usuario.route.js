/**
 * Importa el framework Express y el módulo Router (del framework).
 * El módulo Router permite el manejo de las rutas en Express.
 * Importa los controladores usuarioCtrl y autCtrl para acceder a las funcionalidades definidas.
 * Define las rutas y los controladores asociados a cada una.
 * Exporta el enrutador para su uso en otras partes de la aplicación.
 * @type {{}|{}}
 */
const express = require("express");
const router = express.Router();
const usuarioCtrl = require('./../controllers/usuario.controller');
const autCtrl = require("../controllers/auth.controller");

/**
 Ruta para el registro de usuarios.
 Verifica el token antes de permitir el acceso.
 Llama al controlador usuarioCtrl.createUsuario para procesar la solicitud.
 */
router.post('/sign-up', usuarioCtrl.createUsuario);

/**
 Ruta para el inicio de sesión de usuarios.
 Llama al controlador usuarioCtrl.loginUsuario para procesar la solicitud.
 */
router.post('/login', usuarioCtrl.loginUsuario);

/**
 * Obtiene un usuario por su ID
 * Devuelve los detalles de un usuario según su ID.
 */
router.get('/:id', usuarioCtrl.getUsuario);
router.get('/username/:username', usuarioCtrl.verificarUsername);

module.exports = router;
