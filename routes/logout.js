const express = require('express');
const router = express.Router();

const C = require('../test/test');

router.get('/', (req,res) => {
  // destruction de la session
  req.session.destroy(function(err) {
  C.log('yellow', `Déconnexion de l'utilisateur`)
  res.status(401).redirect('/')
})
})

module.exports = router;