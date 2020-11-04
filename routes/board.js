const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    // 게시판 전체 목록 전송
    router.post('/data/list', function (req, res, next) {
        res.send(`TODO("데이터 전송 - 질문 목록")`)
    });
    // 단일 게시물 데이터 전송
    router.post('/data/:id', function (req, res, next) {
        console.log(req.params.id)
        res.send(`TODO("데이터 전송 - 질문 내부 데이터")`)
    });
    // 게시판 전체 목록 표시
    router.get('/', function (req, res, next) {
        res.render("board.html")
    });
    // 게시물 데이터 표시
    router.get('/:id', function (req, res, next) {
        res.render("question.html")
    });
    return router
}