const express = require('express');
const router = express.Router();

const C = require('../test/test');

const { checkJWT } = require('../middleware/private');
router.use(checkJWT)

/* GET page users arrivals. */
const dashboardService = require('../services/dashboard');

router.get('/', async (req, res, next) => {
    session = req.session;
    session.page = req.query.page;
    C.page(session.page);

    let reservations = [];
    try {
        reservations = await dashboardService.getCurrentReservations();
    } catch (error) {
        C.log('red', `Erreur lors de la récupération des réservations: ${error.message}`);
    }

    if (session.email !== undefined){
        res.status(200).render('pages/dashboard', {
            session: session,
            visite: session.visit,
            email: session.email,
            page: session.page,
            reservations: reservations // <-- à utiliser dans ta vue
        });
    } else {
        res.status(401).render('pages/dashboard', { visite: session.visit });
    }
});


module.exports = router;
