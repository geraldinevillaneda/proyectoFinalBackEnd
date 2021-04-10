const jwt = require("jsonwebtoken");
const texto = require('../config');

function verifyToken(req, res, next)
{
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(401).json({
            auth: false,
            token: false,
            done: 'No esta autorizado'
        });
    }

    const decoded = jwt.verify(token, texto.secreto);
    req.userId = decoded.userId;

    next();

    
}

module.exports = verifyToken;