const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const C = require('../test/test');

exports.checkJWT = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        C.log('red', 'Token non fourni en session');
        return res.status(401).redirect('/');
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            C.log('red', 'Token JWT invalide');
            return res.status(401).json('token_not_valid');
        } else {
            req.decoded = decoded;
            next();
        }
    });
}