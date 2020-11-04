const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    // 게시글 작성
    router.get('/', function (req, res, next) {
        res.render('edit.html')
    });
    // 게시글 수정
    router.get('/:id', function (req, res, next) {
        console.log(req.params.id)
        res.render('edit.html')
    });
    return router
}