const express = require('express')
const router = express.Router()

module.exports = function (passport) {
    router.get('/', function (req, res, next) {
        const type = req.body.type
        console.log(type)
        if (type === 'body')
            res.render("index.html")
        else
            res.render("login.html")
    });

    router.route('/login')
        .get((req, res) => {
            res.redirect('/users')
        })
        .post(function (req, res, next) {
            const body = req.body
            // email, id, pw
            res.send(body);
        })

    router.route('/signin')
        .get((req, res) => {
            res.redirect('/users')
        })
        .post((req, res) => {
            const data = req.body
            res.send(data)
            // TODO("
            //  id 존재하는지 확인
            //    존재하는 경우 -> 비밀번호 찾기로 리다이렉트
            //    존재하지 않는 경우 -> 회원가입 추가 정보 입력 (sign.html 렌더링)
            //  ")
            //res.render('singin.html')
        })
    router.get('/pw', ((req, res) => {
        req.body.type = 'find'
        res.redirect('/users')
    }))
    return router
}
