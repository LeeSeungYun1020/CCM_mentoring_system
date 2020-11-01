const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  const body = req.body
  // email, id, pw
  res.send('TODO("로그인 기능 구현") \n' + body);
});

module.exports = router;
