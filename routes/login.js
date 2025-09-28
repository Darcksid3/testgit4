const express = require('express');
const router = express.Router();

const C = require('../test/test');

router.post('/', (req,res,next) => {
  //récup des variables
  const visit = req.body.visit;  
  const email = req.body.email;
  const password = req.body.password;
    // mise en session
  const session = req.session;
  session.email = email;
  session.visite = visit;
  
  const verif = C.verifUser(email, password);
  
  if(verif) {
    session.verif = true;
    res.status(301).redirect('/dashboard')
    
  } else {
    session.verif = false;
    session.errMsg = 'paire email/mot de passe invalide!';
    res.status(401).redirect('/')
  } 
  
});


module.exports = router;