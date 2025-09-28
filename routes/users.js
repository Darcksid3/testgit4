const express = require('express');
const router = express.Router();
const Joi = require('joi'); // Joi

const inscriptionSchema = require('../joi/inscriptionSchema'); // Votre schéma Joi
//const nodemailer = require('nodemailer');
const Users = require('../models/users');
const C = require('../test/test');

// Configuration de Nodemailer (je pense utilisez Alwaysdata pour la mise en ligne)
/*
const transporter = nodemailer.createTransport({
  service: 'alwaysdata',
  auth: {
    user: 'User Email', // Remplacez par votre adresse email
    pass: 'UserPassApp'  // Remplacez par votre mot de passe d'application
  }
});
*/

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
router.post('/', async (req, res, next) => { 
  session = req.session;
  session.page = 'createUser';
  C.log('magenta', ` Debut ajout utilisateur`)

  const name = req.body.name;
  C.log('magenta', `req.body = ${name}`)
  const email = req.body.email;
  C.log('magenta', `req.body = ${email}`)
  const password = req.body.password;
  C.log('magenta', `req.body = ${password}`)

 
  const { error } = inscriptionSchema.validate(req.body);

  if (error) {
    return res.status(400).render('pages/users', {
      message: error.details[0].message
    });
  }

  try {
    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const userSaved = await newUser.save();
    console.log(`Nouvel utilisateur ajouté: ${userSaved.email}`);

    // Création du contenu de l'e-mail
    /*
    const mailOptions = {
      from: 'votre_email@gmail.com',
      to: userSaved.email,
      subject: 'Vérification de votre adresse e-mail',
      html: `
        <p>Bonjour ${userSaved.name},</p>
        <p>Merci de vous être inscrit. Veuillez cliquer sur ce lien pour confirmer votre adresse e-mail :</p>
        <a href="http://localhost:3000/users/verify/${userSaved.emailVerificationToken}">Confirmer mon e-mail</a>
      `
    };

    // Envoi de l'e-mail
    await transporter.sendMail(mailOptions);
    */

    res.status(201).render('pages/users', {
      message: 'Utilisateur créé. ' //Un e-mail de confirmation a été envoyé.
    });

  } catch (dbError) {
    console.error(`Erreur lors de la création de l'utilisateur : ${dbError.message}`);
    res.status(500).render('pages/users', {
      message: `Erreur: ${dbError.message}`
    });
  }
});

// Route pour la vérification par email
/*
router.get('/verify/:token', async (req, res, next) => {
  try {
    const user = await Users.findOne({
      emailVerificationToken: req.params.token,
      emailVerificationTokenExpires: { $gt: Date.now() } // Vérifie si le token n'est pas expiré
    });

    if (!user) {
      return res.status(404).render('pages/users', {
        message: 'Le lien de vérification est invalide ou a expiré.'
      });
    }

    // Le token est valide, on met à jour l'utilisateur
    user.isVerified = true;
    user.emailVerificationToken = undefined; // On supprime le token pour qu'il ne puisse pas être réutilisé
    user.emailVerificationTokenExpires = undefined;

    await user.save();
    
    // Vous pouvez aussi créer une session ici pour connecter l'utilisateur
    req.session.email = user.email;
    req.session.verif = true;
    req.session.name = user.name;

    res.status(200).render('pages/users', {
      message: 'Votre adresse e-mail a été vérifiée avec succès ! Vous pouvez maintenant vous connecter.'
    });

  } catch (error) {
    console.error(`Erreur lors de la vérification de l'e-mail : ${error.message}`);
    res.status(500).render('pages/users', {
      message: 'Une erreur est survenue lors de la vérification.'
    });
  }
});
*/

module.exports = router;
