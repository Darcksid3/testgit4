const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        return res.status(401).redirect('/');
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json('token_not_valid');
        } else {
            req.decoded = decoded;
            next();
        }
    });
}