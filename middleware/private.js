/**
 * * @param {Object} req - L'objet de requête Express
 * * @param {Object} res - L'objet de réponse Express
 * * @param {Function} next - La fonction middleware suivante dans la pile
 * Middleware pour restreindre l'acces au route aux utilisateurs authentifiés
 */

module.exports = function (req, res, next) {
    if (req.session && req.session.user) {
        next(); 
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }   
};