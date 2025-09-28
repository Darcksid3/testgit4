const express = require('express');
const router = express.Router();

const Users = require('../models/users');
const C = require('../test/test');


/* GET page users arrivals. */
router.get('/', function (req, res, next) {
  //raccourci de la session
  session = req.session;
  
  //Vérification de la connexion de l'utilisateur sinon redirection à l'accueil
  if (session.verif) {
    C.log('green', `connexion vérifié`);
  } else {
    C.log('red', `connexion non vérifié`)
    res.status(401).redirect('/')
  }
  //récupération de la page
  session.page = req.query.page;
  //switch des pages à afficher
  C.page('users', session.page);

  //vérification de la présence d'un email en session
  if (session.email !== undefined){
    C.log('green', `ouverture page users if req.session.email => ${session.email}`)
    res.status(200).render('pages/users', { session: session, visite: session.visit, email: session.email, page: session.page });

  } else {
    C.log('red', `ouverture page users else req.session.email => ${session.email}`)
    res.status(401).render('pages/users', { visite: session.visit});
  }

});

/* GET users listing. */


// find one user
router.get('/:email', async (req,res) => {
  // récupération de la session
  session = req.session;
  session.page = 'findOneUser'
  // récupération de l'email
  let emailFind = await req.params.email;
  // débug affichage de l'email
  C.log('yellow', emailFind)
  
  res.status(200).render('pages/users', {session: session, emailFind : emailFind})
});


// Ajout utilisateur
router.post('/', async (req,res,next) => {
  session = req.session;
  session.page = 'createUser';
  C.log('magenta', ` Debut ajout utilisateur`)

  const name = req.body.name;
  C.log('magenta', `req.body = ${name}`)
  const email = req.body.email;
  C.log('magenta', `req.body = ${email}`)
    const password = req.body.password;
  C.log('magenta', `req.body = ${password}`)


  res.status(201).render('pages/users', {session: session})
});


module.exports = router;
