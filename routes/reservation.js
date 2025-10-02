const express = require('express');
const router = express.Router({ mergeParams: true });
const Joi = require('joi'); 

const reservationSchema = require('../joi/reservationSchema');
const Reservation = require('../models/reservation');
const C = require('../test/test');



/* GET page reservation arrivals. */
router.get('/', async (req, res, next) => {
    
//raccourci de la session
session = req.session;

//Vérification de la connexion de l'utilisateur sinon redirection à l'accueil
if (session.verif) {
    C.log('green', `reservation connexion vérifié`);
} else {
    C.log('red', `reservation connexion non vérifié`)
    res.status(401).redirect('/')
}

//récupération de la page
session.page = req.query.page;
//switch des pages à afficher
C.page('reservation', session.page);

try {
        let reservations = [];
        // récupératin des réservation dans la DB
        if (session.page === 'findAllReserv') {
            reservations = await Reservation.find({}); // Fetch all reservations
            C.log('green', `trouvé ${reservations.length} reservations`);
        }
    
//vérification de la présence d'un email en session
if (session.email !== undefined){
    C.log('green', `ouverture page reservation if req.session.email => ${session.email}`)
    res.status(200).render('pages/reservation', { session: session, allReservations: reservations });

} else {
    C.log('red', `ouverture page reservation else req.session.email => ${session.email}`)
    res.status(401).render('pages/reservation', { visite: session.visit});
}
} catch (error) {
        C.log('red', `Erreur de recherche de réservations: ${error.message}`);
        res.status(500).send('Une erreur est arrivé durant la recherche de réservation.');
    }
});

router.get('/:id', async (req, res, next) => {
    // Récupération de la session et de l'id
    session = req.session;
    const idToFind = req.params.id;

    // Définir la page en session en fonction du paramètre de requête
    session.page = req.query.page || 'findOneReserv'; // Défaut à 'findOneReserv'

    try {
        // Recherche de la réservation par son numéro de catway
        const reservation = await Reservation.findOne({ catwayNumber: idToFind });
        C.log('green', `Réservation trouvée : ${JSON.stringify(reservation)}`);
        C.log('yellow',reservation.clientName)
        if (!reservation) {
            // Si aucune réservation n'est trouvée
            return res.status(404).render('pages/reservation', {
                session: session,
                message: `Aucune réservation trouvée pour le catway n°${idToFind}.`
            });
        }

        // Rendu de la page avec la réservation trouvée
        if (session.page === 'modifyReserv') {
            C.log('yellow', reservation.clientName) //affichahe corect de la variable dans la console
            return res.status(200).render(`pages/reservation`, {
                session: session,
                modifyReservation: reservation,
                message: `Modification de la réservation du catway n°${idToFind}.`
            });
        } else {
            C.log('yellow',reservation.clientName) //affichahe corect de la variable dans la console
            // Pour l'affichage par défaut (findOneReserv)
            return res.status(200).render(`pages/reservation`, {
                session: session,
                findOneReservation: reservation,
                message: `Détails de la réservation du catway n°${idToFind}.`
            });
        }

    } catch (error) {
        C.log('red', `Erreur lors de la recherche de la réservation : ${error.message}`);
        return res.status(500).render('pages/reservation', {
            session: session,
            message: `Erreur interne du serveur lors de la recherche.`
        });
    }
});


router.post('/', async (req,res,next) => {
    C.log('green', `Début de la route d'ajout d'une réservation`)
    //TODO
    //* Sélectionné un type de catway 
    //* demandé la date de début et de foin de séjour
    //* comparé si les date sont libres avec la liste de type de catway
    //* prendre le reste des information
    //* effectuer la réservation
});

module.exports = router;