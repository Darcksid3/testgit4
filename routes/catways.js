const express = require('express');
const router = express.Router();
const Joi = require('joi'); // Joi

const catwaySchema = require('../joi/catwaySchema'); // Votre schéma Joi
//const nodemailer = require('nodemailer');
const Catway = require('../models/catway')
const C = require('../test/test');



/* GET page users arrivals. */
router.get('/', function (req, res, next) {
  //raccourci de la session
  session = req.session;
  
  //Vérification de la connexion de l'utilisateur sinon redirection à l'accueil
  if (session.verif) {
    C.log('green', `catways connexion vérifié`);
  } else {
    C.log('red', `catways connexion non vérifié`)
    res.status(401).redirect('/')
  }

  //récupération de la page
  session.page = req.query.page;
  //switch des pages à afficher
  C.page(session.page);
  
  
  //vérification de la présence d'un email en session
  if (session.email !== undefined){
    C.log('green', `ouverture page catways if req.session.email => ${session.email}`)
    res.status(200).render('pages/catways', { session: session });

  } else {
    C.log('red', `ouverture page catways else req.session.email => ${session.email}`)
    res.status(401).render('pages/catways', { visite: session.visit});
  }

});

router.get('/:id', async (req,res,next) => {
  // récupération de la session
  session = req.session;
  session.page = 'findOneCatway'
  // récupération de l'email
  let idFind = await req.params.id;
  // débug affichage de l'email
  C.log('yellow', idFind)
  
  res.status(200).render('pages/catways', {session: session, idFind : idFind})
});

// ajout d'un catway
router.post('/', async (req,res,next) => {
  //récupération de la session
  C.log('green', `Début route post`);
  session = req.session;
  session.page = 'createCatway';
  //récupération des donnée du formulaire
  const catwayNumber = req.body.catwayNumber;
  C.log('magenta', catwayNumber);
  const catwayType = req.body.catwayType;
  C.log('magenta', catwayType);
  const catwayState = req.body.catwayState;
  C.log('magenta', catwayState);

  const { error } = catwaySchema.validate(req.body);

    if (error) {
    return res.status(400).render('pages/catways', {
      message: error.details[0].message
    });
  }
    try {
      const newCatway = new Catway({
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState,
      });
  
    const catwaySaved = await newCatway.save();
    console.log(`Nouveau catway ajouté: ${catwaySaved.catwayNumber}`);
  
    res.status(201).render('pages/catways', {
      session: session,
      message: 'Catway créé.'
    });

  } catch (dbError) {
    console.error(`Erreur lors de la création du catway : ${dbError.message}`);
    res.status(500).render('pages/catways', {
      message: `Erreur: ${dbError.message}`
    });
  }
});

module.exports = router;