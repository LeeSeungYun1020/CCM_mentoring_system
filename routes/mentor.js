const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')



module.exports = function (passport) {
    //멘토리스트 출력
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