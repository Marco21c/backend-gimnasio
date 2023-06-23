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
     return res.status(404).json({ error: 'Usuario no encontrado' });
   }
   const validar = await bcrypt.compare(password, user.password);
   if (!validar) {
     return res.status(401).json({ error: 'contraseña Invalida' });
   }
   res.status(200).json({ message: 'Login exitoso'});
 } catch (error) {
   res.status(500).json({ error: 'Error en el proceso.' });
 }
};
   module.exports= usuarioCtrl;
   