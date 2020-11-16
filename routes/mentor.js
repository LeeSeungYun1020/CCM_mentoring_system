const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

// mysql.query(
//     "select * from user order by answerPoint desc;",

module.exports = function (passport) {
    router.post('/data/user', (req, res) => {
        mysql.query(`select id, name, email, teamID, questionPoint, answerPoint, image from user order by answerPoint desc`,
            function (error, results) {
                return res.send({error: error, body: results})
            })
    })

    router.post('/data/team/:page/:count', (req, res) => {
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
            select team.*, user.name as mentorName 
            from team left join user 
            on mentorID = user.id 
            order by answerPoint desc limit ?,?`.trim(),
            [questionIndex, max],
            function (error, results, fields) {
                if (error) {
                    console.log(error)
                    error = "data"
                }
                res.send({error: error, list: results})
            })
    })

    router.post('/team/count', function (req, res) {
        mysql.query(
            "SELECT COUNT(*) from team",
            [req.params.range],
            function (error, results, fields) {
                res.send({error: error, data: results[0]["COUNT(*)"]})
            })
    })

    // 팀 페이지 출력
    router.get('/team', function (req, res) {
        res.render("team.html")
    });

    // 멘토 페이지 출력
    router.get('/', function (req, res) {
        res.render("mentor.html")
    });
    // 라이브러리 파일 요청
    router.get('/*.html', (req, res) => {
        res.render(req.params[0] + '.html')
    })

    router.get('/javascripts/*.js', (req, res) => {
        res.redirect(`/javascripts/${req.params[0]}.js`)
    })



    return router
}