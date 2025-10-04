const express = require('express');
const router = express.Router();

const C = require('../test/test');
const verifUsers = require('../middleware/verifUsers');

router.post('/', async (req,res,) => {

    let validUser = await verifUsers.verifUsers(req.body.email, req.body.password);


    if(validUser) {
        const { user, token } = validUser;
         // mise en session
        const session = req.session;
        session.verif = true;
        session.email = user.email;
        session.name = user.name;
        session.visite = req.body.visit;
        session.token = token;
        delete session.errMsg;
        
        //res.header('Authorization', 'Bearer ' + token);
        C.log('green', `Juste apres le token username  => ${user.name}`)

        res.status(301).redirect('/dashboard')
        
    } else {
        C.log('red', `login raté`)
        req.session.errMsg = 'Identifiants ou mot de passe incorrects.';
        res.status(401).redirect('/')
    } 
});

module.exports = router;