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

  /* A implémenté au moment du travaill dessus
  //récupération de la page
  session.page = req.query.page;
  //switch des pages à afficher
  C.page(session.page);
  */
  
  //vérification de la présence d'un email en session
  if (session.email !== undefined){
    C.log('green', `ouverture page catways if req.session.email => ${session.email}`)
    res.status(200).render('pages/catways', { session: session, visite: session.visit, email: session.email, page: session.page });

  } else {
    C.log('red', `ouverture page catways else req.session.email => ${session.email}`)
    res.status(401).render('pages/catways', { visite: session.visit});
  }

});


module.exports = router;