const express = require('express');
const router = express.Router();

router.get('/', (req,res,next) => {

	//test de session variable incrémentante
	req.session.visit = (req.session.visit ||0)+1;

	const session = req.session;

	if (session.verif){
		res.render('pages/index', { 
			session: session, 
			visite: session.visit, 
			email: session.email
		})
	} else {
		res.render('pages/index', { 
			session: session,
			visite: session.visit,
			errMsg: session.errorMessage})
	}

});


module.exports = router;
