const express = require('express')
const router = express.Router()

module.exports = function (passport) {
    // 게시글 작성
    router.get('/', function (req, res, next) {
        res.render('question.html')
    });
    // 게시글 수정
    router.get('/:id', function (req, res, next) {
        console.log(req.params.id)
        res.render('question.html')
    });
    return router
}