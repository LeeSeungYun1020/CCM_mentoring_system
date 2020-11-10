const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    // 게시판 전체 목록 전송
    router.post('/data/list/:page/:count', function (req, res, next) {
        let max
        let page
        if (req.params.page != null)
            page = parseInt(req.params.page, 10)
        else
            page = 0
        if (req.params.count != null)
            max = parseInt(req.params.count, 10)
        else
            max = 10
        const questionIndex = page * max
        mysql.query(
            `
            SELECT question.id, title, name, date, tag 
            from question left join user 
            on userID = user.id 
            where viewRange = 0 
            order by question.id desc limit ?,? `.trim(),
            [questionIndex, max],
            function (error, results, fields) {
                res.send({error: error, list: results})
            })
    });
    // 게시판 팀 목록 전송
    router.post('/data/team/:page/:count', function (req, res, next) {
        if (req.user == undefined) {
            res.send({error: "login"})
            return
        }
        if (req.user.teamID == null) {
            res.send({error: "team"})
            return
        }
        let page
        if (req.params.page != null)
            page = parseInt(req.params.page, 10)
        else
            page = 0
        let max
        if (req.params.count != null)
            max = parseInt(req.params.count, 10)
        else
            max = 10
        const questionIndex = page * max
        mysql.query(
            `
            SELECT question.id, title, name, date, tag 
            from question left join user 
            on userID = user.id 
            where viewRange = 1 and viewID = ? 
            order by question.id desc limit ?,? `.trim(),
            [req.user.teamID, questionIndex, max],
            function (error, results, fields) {
                if (error) {
                    console.log(error)
                    error = "data"
                }
                res.send({error: error, list: results})
            })
    });
    // 단일 게시물 데이터 전송
    router.post('/data/q/:id', function (req, res, next) {
        mysql.query(
            "SELECT * from question where id = ?",
            [req.params.id],
            function (error, results, fields) {
                res.send({error: error, data: results[0]})
            })
    });
    // 전체 질문 갯수
    router.post('/data/count/:range', function (req, res, next) {
        mysql.query(
            "SELECT COUNT(*) from question where viewRange = ?",
            [req.params.range],
            function (error, results, fields) {
                res.send({error: error, data: results[0]["COUNT(*)"]})
            })
    });
    // 게시판 전체 목록 표시
    router.get('/', function (req, res, next) {
        res.render("board.ejs")
    });
    // 게시물 데이터 표시
    router.get('/:id', function (req, res, next) {
        // TODO("게시물 데이터 출력")
        res.render("question.html")
    });
    return router
}