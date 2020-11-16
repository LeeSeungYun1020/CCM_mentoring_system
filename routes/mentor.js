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

    router.post('/data/user/team', (req, res) => {
        if (req.user == null) {
            return res.send({error: "login"})
        }
        res.send({error: false, data: req.user.teamID})
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

    router.post('/team/join/:id', function (req, res) {
        if (req.user == undefined) {
            return res.send({error: "login"})
        }
        mysql.query(
            "UPDATE user SET teamID = ? WHERE id = ?",
            [req.params.id, req.user.id],
            function (error, results, fields) {
                if (error)
                    return res.send({error: "data"})
                else if (results.affectedRows > 0)
                    return res.send({error: false})
                else
                    return res.send({error: "data"})
            })
    })

    router.post('/team/drop/:id', function (req, res) {
        if (req.user == undefined) {
            return res.send({error: "login"})
        }
        if (req.user.id == req.params.id) {
            return res.send({error: "mentor"})
        }
        mysql.query(
            "UPDATE user SET teamID = null WHERE id = ?",
            [req.user.id],
            function (error, results) {
                if (error)
                    return res.send({error: "data"})
                else if (results.affectedRows > 0)
                    return res.send({error: false})
                else
                    return res.send({error: "data"})
            })
    })

    router.post('/team/drop', function (req, res) {
        if (req.user == undefined) {
            return res.send({error: "login"})
        }
        mysql.query(
            "UPDATE user SET teamID = null WHERE id = ?",
            [req.user.id],
            function (error, results) {
                console.log(error)
                if (error)
                    return res.send({error: "data"})
                else if (results.affectedRows > 0)
                    return res.send({error: false})
                else
                    return res.send({error: "data"})
            })
    })

    router.post('/team/delete/:id', function (req, res) {
        if (req.user == undefined) {
            return res.send({error: "login"})
        }
        if (req.user.teamID != req.params.id) {
            return res.send({error: "auth"})
        }
        mysql.query(
            "DELETE FROM team WHERE id = ?", [req.params.id],
            function (error, results) {
                if (error)
                    return res.send({error: "data"})
                else if (results.affectedRows > 0)
                    return res.send({error: false})
                else
                    return res.send({error: "data"})
            })
    })

    router.post('/team/delete', function (req, res) {
        if (req.user == undefined) {
            return res.send({error: "login"})
        }
        mysql.query(
            "DELETE FROM team WHERE id = ?", [req.user.teamID],
            function (error, results) {
                if (error)
                    return res.send({error: "data"})
                else if (results.affectedRows > 0)
                    return res.send({error: false})
                else
                    return res.send({error: "data"})
            })
    })

    router.route('/team/create')
        .get(function (req, res) {
            res.render("team_create.html")
        })
        .post((req, res) => {
            if (req.user == null) {
                return res.render('alert.ejs', {
                    message: "로그인하셔야 팀을 생성할 수 있습니다.",
                    redirectPage: `/mentor/team`
                })
            }
            mysql.query(
                "INSERT INTO team (name, mentorID, tag) VALUES (?, ?, ?)",
                [req.body.name, req.user.id, req.body.tag],
                function (error, results) {
                    if (error)
                        return res.render('alert.ejs', {
                            message: "팀을 생성할 수 없습니다.",
                            redirectPage: `/mentor/team`
                        })
                    else
                        mysql.query(
                            "UPDATE user SET teamID = ? WHERE id = ?",
                            [results.insertId, req.user.id],
                            function (error, results) {
                                console.log(error)
                                if (error)
                                    return res.render('alert.ejs', {
                                        message: "팀을 추가할 수 없습니다.",
                                        redirectPage: `/mentor/team`
                                    })
                                else if (results.affectedRows > 0)
                                    return res.redirect("/users/info")
                                else
                                    return res.render('alert.ejs', {
                                        message: "팀을 추가할 수 없습니다.",
                                        redirectPage: `/mentor/team`
                                    })
                            })
                })
        })

    // 팀 페이지 출력
    router.get('/team', function (req, res) {
        res.render("team.html")
    });

    router.get('/team/*.html', (req, res) => {
        res.render(req.params[0] + '.html')
    })

    router.get('/team/javascripts/*.js', (req, res) => {
        res.redirect(`/javascripts/${req.params[0]}.js`)
    })

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