const express = require('express');
const router = express.Router();

const C = require('../test/test');
const verifUsers = require('../test/verifUsers');

router.post('/', async (req,res,next) => {
    //récup des variables
    // const visit = req.body.visit;  
    // const email = req.body.email;
    // const password = req.body.password;
    // const name = 'bruno'


    let validUser = await verifUsers.verifUsers(req.body.email, req.body.password);


    if(validUser) {
         // mise en session
        const session = req.session;
        session.verif = true;
        session.email = validUser.email;
        session.name = validUser.name;
        session.visite = req.body.visit;

        delete session.errMsg;

        res.status(301).redirect('/dashboard')
        
    } else {
        C.log('red', `login raté`)
        req.session.errMsg = 'Identifiants ou mot de passe incorrects.';
        res.status(401).redirect('/')
    } 
});

module.exports = router;