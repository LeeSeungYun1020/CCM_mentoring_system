var express = require('express');
var router = express.Router();

// TODO("향후 센터 로그인 내용으로 교체")
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
