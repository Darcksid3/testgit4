const express = require('express');
const router = express.Router();

const C = require('../test/test')

router.get('/', (req,res,next) => {

	//test de session variable incrémentante
	req.session.visit = (req.session.visit ||0)+1;

	const session = req.session;
	const jstringSession = JSON.stringify(session)
	C.log('red',JSON.stringify(session.cookie))
	C.log('cyan', jstringSession)
	C.log('yellow', session.visit)

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
