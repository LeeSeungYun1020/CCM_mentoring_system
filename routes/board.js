const express = require('express')
const router = express.Router()

module.exports = function (passport) {
    // 게시판 전체 목록
    router.get('/', function (req, res, next) {
        res.render('question.html')
    });
    // 단일 게시물 출력
    router.get('/:id', function (req, res, next) {
        console.log(req.params.id)
        res.render('index.html')
    });
    return router
}