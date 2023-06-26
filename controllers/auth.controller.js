const jwt = require('jsonwebtoken');
const authCtrl = {};

authCtrl.verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.json({'status': '0', 'msg': 'Unauthorized request.'})
    }

    let arrayTexto = req.headers.authorization.split(' ');
    let token = null;

    (arrayTexto.length >= 2) ? token = arrayTexto[1] : token = null;

    if (token == null) {
        return res.json({'status': '0', 'msg': 'Unauthorized request.'});
    }

    try {
        const payload = jwt.verify(token, "secretkey");
        req.userId = payload._id;
        req.userRol = payload.rol;
        next();
    } catch (error) {
        res.json({'status': '0', 'msg': 'Unauthorized request.'});
    }
}

module.exports = authCtrl;