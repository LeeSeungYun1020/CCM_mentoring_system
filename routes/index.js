const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  // console.log(req.session)
  res.render('index.html')
});

module.exports = router;
