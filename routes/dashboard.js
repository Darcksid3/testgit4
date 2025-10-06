const express = require('express');
const router = express.Router();

const { checkJWT } = require('../middleware/private');
router.use(checkJWT)

/* GET page users arrivals. */
const dashboardService = require('../services/dashboard');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags:
 *       - Tableau de bord
 *     summary: Récupère les réservations en cours
 *     responses:
 *       200:
 *         description: donne accès au tableau de bord avec les réservations en cours et les liens vers les autres pages
 */
router.get('/', async (req, res, next) => {
    session = req.session;
    session.page = req.query.page;
    let reservations = [];
    try {
        reservations = await dashboardService.getCurrentReservations();
    } catch (error) {
        return res.status(400).json({ 
            message: 'Erreur récupération de réservation courrante.'
        });
    }

    if (session.email !== undefined){
        res.status(200).render('pages/dashboard', {
            session: session,
            visite: session.visit,
            email: session.email,
            page: session.page,
            reservations: reservations 
        });
    } else {
        res.status(401).render('pages/dashboard', { visite: session.visit });
    }
});


module.exports = router;
