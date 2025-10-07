const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {
  // destruction de la session
    req.session.destroy(function(err) {
    res.status(401).redirect('/')
})
})

module.exports = router;