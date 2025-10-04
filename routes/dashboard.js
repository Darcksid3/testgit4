const express = require('express');
const router = express.Router();

const C = require('../test/test');

const { checkJWT } = require('../middleware/private');
router.use(checkJWT)

/* GET page users arrivals. */
router.get('/', function (req, res, next) {
	//raccourci de la session
	session = req.session;
	const jstringSession = JSON.stringify(session)
		C.log('cyan', jstringSession)
	//Vérification de la connexion de l'utilisateur sinon redirection à l'accueil
	if (session.verif) {
		C.log('green', `connexion vérifié`);
	} else {
		C.log('red', `connexion non vérifié`)
		res.status(401).redirect('/')
	}
/*
	//récupération de la page
	session.page = req.query.page;
	//switch des pages à afficher
	C.page(session.page);
*/
	//vérification de la présence d'un email en session
	if (session.email !== undefined){
		C.log('green', `ouverture page dashboard if req.session.email => ${session.email}`)
		res.status(200).render('pages/dashboard', { session: session, visite: session.visit, email: session.email, page: session.page });

	} else {
		C.log('red', `ouverture page dashboard else req.session.email => ${session.email}`)
		res.status(401).render('pages/dashboard', { visite: session.visit});
	}

});


module.exports = router;
