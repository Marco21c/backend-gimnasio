const Usuario = require ('./../models/usuario')
const usuarioCtrl = {}
const bcrypt = require('bcrypt');

usuarioCtrl.createUsuario = async (req, res)=>{
   try {
      const { username, password,rol } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Usuario.create({ username, password: hashedPassword,rol});
      res.status(201).json({ message: 'Usuario Creado Con Exito', user });
    } catch (error) {
      res.status(500).json({ error: 'Error en el proceso.' });
    }
}
usuarioCtrl.loginUsuario = async (req, res)=>{
 try {
   const { username, password } = req.body;
   const user = await Usuario.findOne({ username });
   if (!user) {
     return res.status(404).json({ status: 0, error: 'Usuario no encontrado' });
   }
   const validar = await bcrypt.compare(password, user.password);
   if (!validar) {
     return res.status(401).json({ status: 0, error: 'contraseña Invalida' });
   }
   res.status(200).json({ status: 1, message: 'Login exitoso', user: {id: user._id, username:user.username, rol:user.rol}});
 } catch (error) {
   res.status(500).json({ status: 0, error: 'Error en el proceso.' });
 }
};
   module.exports= usuarioCtrl;
   