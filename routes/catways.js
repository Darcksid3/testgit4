const express = require('express');
const router = express.Router();

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
    res.status(200).render('pages/catways', { session: session, visite: session.visit, email: session.email, page: session.page });

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

router.post('/', async (req,res,next) => {
  //récupération de la session
  C.log('green', `Début route post`);
  session = req.session;
  session.page = 'createCatway';
  //récupération des donnée du formulaire
  const size = req.body.size;
  C.log('magenta', size);
  const catNumber = req.body.catwayNumber;
  C.log('magenta', catNumber);
  const catState = req.body.catwayState;
  C.log('magenta', catState);

  const fullInfo = {
    size: size,
    catNumber: catNumber,
    catState: catState
  };



  res.status(201).render('pages/catways', { session: session, fullInfo: fullInfo })
});

module.exports = router;