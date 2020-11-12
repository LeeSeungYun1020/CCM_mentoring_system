const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql.js')

module.exports = function (passport) {
    router.route('/')
        .get(function (req, res, next) {
            if (req.user) {
                res.redirect("/users/info")
            } else
                res.render("login.html")
        })
        .post(((req, res) => {
            res.send(req.user)
        }))

    router.route('/login')
        .get((req, res) => {
            res.redirect('/users')
        })
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/error',
            failureFlash: "아이디와 비밀번호를 다시 확인하십시오."
        }))

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    })

    router.route('/signin')
        .get((req, res) => {
            res.redirect('/users')
        })
        .post((req, res, next) => {
            const data = req.body
            const ran = Math.floor(Math.random() * 11) + 1
            mysql.query(
                "INSERT INTO user (id, pw, name, email, phone, type, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [data.username, data.password, data.name, data.email, data.phone, data.type, ran],
                function (error, results) {
                    if (error) {
                        res.redirect('/users')
                    } else {
                        req.login({
                            id: data.username,
                            pw: data.password,
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                            type: data.type
                        }, (err) => {
                            if (err) return next(err)
                            return res.redirect('/')
                        })
                    }
                })
        })
    router.get('/pw', ((req, res) => {
        req.body.type = 'find'
        res.redirect('/users')
    }))
    router.post('/checkID', ((req, res) => {
        // 데이터베이스에 해당 ID 있는지 조회
        mysql.query(
            "SELECT id from `User` WHERE `id`=?",
            [req.body.id],
            function (error, results, fields) {
                if (error) {
                    res.send({step: false, error: true})
                }
                if (results[0]) {// ID 있는 경우
                    res.send({step: false, error: false})
                } else // ID 없는 경우
                    res.send({step: true, error: false})
            })

    }))
    router.post('/username/:id', ((req, res) => {
        mysql.query(
            "SELECT name from user WHERE id=?",
            [req.params.id],
            function (error, results) {
                res.send(results[0])
            })
    }))
    router.post('/image/:id', ((req, res) => {
        mysql.query(
            "SELECT image from user WHERE id=?",
            [req.params.id],
            function (error, results) {
                res.send(results[0])
            })
    }))

    router.post("/recommend/q/add/:target", (req, res) => {
        mysql.query(
            "UPDATE user SET questionPoint = questionPoint + 1 WHERE id = ?",
            [req.params.target],
            function (error, results) {
                if (error != null) {
                    return res.send({error: true})
                }
                res.send({error: false})
            })
    })

    router.post("/recommend/a/add/:target", (req, res) => {
        mysql.query(
            "UPDATE user SET answerPoint = answerPoint + 1 WHERE id = ?",
            [req.params.target],
            function (error, results) {
                if (error != null) {
                    return res.send({error: true})
                }
                res.send({error: false})
            })
    })
    router.post("/recommend/q/minus/:target", (req, res) => {
        mysql.query(
            "UPDATE user SET questionPoint = questionPoint + 1 WHERE id = ?",
            [req.params.target],
            function (error, results) {
                if (error != null) {
                    return res.send({error: true})
                }
                res.send({error: false})
            })
    })

    router.post("/recommend/a/minus/:target", (req, res) => {
        mysql.query(
            "UPDATE user SET answerPoint = answerPoint + 1 WHERE id = ?",
            [req.params.target],
            function (error, results) {
                if (error != null) {
                    return res.send({error: true})
                }
                res.send({error: false})
            })
    })
    router.get('/error', ((req, res) => {
        res.render('alert.ejs', {message: "아이디 또는 비밀번호를 잘못 입력하셨습니다.", redirectPage: '/users'})
    }))

    router.get('/info', ((req, res) => {
        // 사용자 정보 제공 페이지
        res.redirect('/')
    }))
    return router
}
