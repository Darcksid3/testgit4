const express = require('express');
const router = express.Router();

const C = require('../test/test')

router.get('/', function (req, res, next) {
  
  C.log('green', `Connexion page test `)
  
  //raccourci de la session
  //res.render('pages/test')
  //console.log(req.query.id)
  //const mdp = C.randomMdpGen();
  //C.log('magenta', mdp)
  res.render('pages/test')
  
});


router.get('/:email', async (req,res) => {

  let emailFind = await req.params.email;
  C.log('yellow', emailFind)
  //let emailFindTest = decodeURIComponent(req.params.email) ;

  //console.log('green', `email find test ${emailFindTest}`)
  res.status(200).render('pages/test', {email : emailFind})
});


module.exports = router;
