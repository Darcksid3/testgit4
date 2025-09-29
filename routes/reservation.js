const express = require('express');
const router = express.Router();
const Joi = require('joi'); // Joi

const reservationSchema = require('../joi/reservationSchema'); // Votre schéma Joi
//const nodemailer = require('nodemailer');
const Reservation = require('../models/reservation');
const C = require('../test/test');


/* GET page users arrivals. */
router.get('/', function (req, res, next) {
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
  
  //vérification de la présence d'un email en session
  if (session.email !== undefined){
    C.log('green', `ouverture page reservation if req.session.email => ${session.email}`)
    res.status(200).render('pages/reservation', { session: session });

  } else {
    C.log('red', `ouverture page reservation else req.session.email => ${session.email}`)
    res.status(401).render('pages/reservation', { visite: session.visit});
  }

});

router.get('/:id', async (req,res,next) => {
  // récupération de la session
  session = req.session;
  session.page = 'findOneReserv'
  // récupération de l'email
  let idFind = await req.params.id;
  // débug affichage de l'email
  C.log('yellow', idFind)
  
  res.status(200).render('pages/reservation', {session: session, idFind : idFind})
});

router.post('/', async (req,res,next) => {
  //récupération de la session
  C.log('green', `Début route post`);
  session = req.session;
  session.page = 'createReserv';
  //récupération des donnée du formulaire
  

  const catwayType = req.body.catwayType;
  C.log('magenta', catwayType);
  const catwayNumber = req.body.catwayNumber;
  C.log('magenta', catwayNumber);
  const clientName = req.body.clientName;
  C.log('magenta', clientName);
  const boatName = req.body.boatName;
  C.log('magenta', boatName);
  const startDate = req.body.startDate + 'T06:00:00Z';
  C.log('magenta', startDate);
  const endDate = req.body.endDate + 'T06:00:00Z';
  C.log('magenta', endDate);

    // Création d'un objet avec les types de données convertis
  const dataToValidate = {
    catwayNumber: parseInt(req.body.catwayNumber, 10),
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  };

  const { error } = reservationSchema.validate(dataToValidate);

  if (error) {
    return res.status(400).render('pages/reservation', {
      message: error.details[0].message
  });
  }

  try {
    const newReservation = new Reservation(dataToValidate);
    const reservationSaved = await newReservation.save();
    console.log(`Nouvelle réservation ajouté catway numéro: ${reservationSaved.catwayNumber} pour ${reservationSaved.clientName}`);
  
    res.status(201).render('pages/reservation', {
      session: session,
      message: 'Réservation créé.'
    });

  } catch (dbError) {
    console.error(`Erreur lors de la création d'une réservation : ${dbError.message}`);
    res.status(500).render('pages/reservation', {
      message: `Erreur: ${dbError.message}`
    });
  }
});

module.exports = router;