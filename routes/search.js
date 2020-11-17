const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    router.post('/title', (req, res) => {
        console.log(req.body)
        mysql.query(`SELECT * from question where title LIKE ?`,
            ["%" + req.body.value + "%"],
            function (error, results) {
                return res.send({error: error, body: results})
            })
    })

    router.post('/tag', (req, res) => {
        mysql.query(`SELECT * from question where tag LIKE ?`,
            ["%" + req.body.value + "%"],
            function (error, results) {
                return res.send({error: error, body: results})
            })
    })

    router.post('/contents', (req, res) => {
        mysql.query(`SELECT * from question where contents LIKE ?`,
            ["%" + req.body.value + "%"],
            function (error, results) {
                return res.send({error: error, body: results})
            })
    })

    router.post('/team/name', (req, res) => {
        mysql.query(`SELECT * from team where name LIKE ?`,
            ["%" + req.body.value + "%"],
            function (error, results) {
                return res.send({error: error, body: results})
            })
    })

    router.post('/team/tag', (req, res) => {
        mysql.query(`SELECT * from team where tag LIKE ?`,
            ["%" + req.body.value + "%"],
            function (error, results) {
                return res.send({error: error, body: results})
            })
    })

    // 라이브러리 파일 요청
    router.get('/*.html', (req, res) => {
        res.render(req.params[0] + '.html')
    })

    router.get('/javascripts/*.js', (req, res) => {
        res.redirect(`/javascripts/${req.params[0]}.js`)
    })

    router.get('/:value', ((req, res) => {
        res.render('search.html', {value: req.params.value})
    }))

    return router
}