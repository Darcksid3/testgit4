const express = require('express');
const router = express.Router({ mergeParams: true }); 

const serviceReservation = require('../services/reservation');
const C = require('../test/test'); 

// Middleware de vérification de session (recommandé)
const checkAuth = (req, res, next) => {
    if (!req.session.verif) {
        C.log('red', `Réservation : connexion non vérifiée`);
        return res.status(401).redirect('/');
    }
    next();
};


// Appliquer le middleware à toutes les routes de réservation
router.use(checkAuth); 

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Récupère une reservation par son numéro et affiche la page demandée (modifyReserv, findOneReserv)
 *     responses:
 *       200:
 *         description: renvoie le reservation filtré
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Modifie un reservation par son numéro dans la base de donnée
 *     responses:
 *       200:
 *         description: renvoie sur la liste des reservations
 *   delete:
 *     tags:
 *       - Reservation
 *     summary: Supprime une reservation par son numéro dans la base de donnée
 *     responses:
 *       200:
 *         description: renvoie sur la liste des reservations
 */
router.put('/:idReservation', serviceReservation.modifyReservation);
router.get('/:idReservation', serviceReservation.getOneReservation);
router.delete('/:idReservation', serviceReservation.deleteReservation);

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Recherche toutes les reservation pour un catway dans la base de donnée
 *     responses:
 *       200:
 *         description: renvoie la liste des reservation
 *   post:
 *     tags:
 *       - Reservation
 *     summary: Ajoute une reservation  à la base de donnée
 *     responses:
 *       200:
 *         description: renvoie sur la liste des reservation
 */
router.get('/', serviceReservation.getAllReservForOneCatway);
router.post('/', serviceReservation.createReservation);


module.exports = router;