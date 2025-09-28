const express = require('express');
const router = express.Router();

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
  const size = req.body.size;
  C.log('magenta', size);
  const catNumber = req.body.catwayNumber;
  C.log('magenta', catNumber);
  const clientName = req.body.clientName;
  C.log('magenta', clientName);
  const boatName = req.body.boatName;
  C.log('magenta', boatName);
  const startDate = req.body.startDate;
  C.log('magenta', startDate);
  const endDate = req.body.endDate;
  C.log('magenta', endDate);


  res.status(201).render('pages/reservation', { session: session })
});

module.exports = router;