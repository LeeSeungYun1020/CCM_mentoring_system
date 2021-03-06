const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    // 게시판 전체 목록 전송
    router.post('/data/list/:page/:count', function (req, res) {
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
    router.post('/data/team/:page/:count', function (req, res) {
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

    // 사용자 기준 질문 반환
    router.post('/data/user/question/:id/:page/:count', function (req, res) {
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
            where viewRange = 0 and userID = ? 
            order by question.id desc limit ?,? `.trim(),
            [req.params.id, questionIndex, max],
            function (error, results, fields) {
                res.send({error: error, list: results})
            })
    });
    // 사용자 기준 답안에 따른 질문 반환
    router.post('/data/user/answer/:id/:page/:count', function (req, res) {
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
            SELECT question.id, title, name, question.date, tag 
            from answer 
            left join question on answer.questionID = question.id 
            left join user on user.id = question.userID  
            where viewRange = 0 and answer.userID = ? 
            order by question.id desc limit ?,? `.trim(),
            [req.params.id, questionIndex, max],
            function (error, results, fields) {
                res.send({error: error, list: results})
            })
    });

    // 단일 게시물 데이터 전송
    router.post('/data/q/:id', function (req, res) {
        let userID = 0
        let userTeam = 0
        if (req.user != null) {
            userID = req.user.id
            userTeam = req.user.teamID
        }
        mysql.query(
            `
            SELECT title, contents, date, modifyDate, viewRange, viewID, tag, question.point, user.id, name, teamID 
            from question left join user 
            on userID = user.id 
            where question.id = ?`.trim(),
            [req.params.id],
            function (error, results, fields) {
                if (results.length == 0) {
                    error = "not"
                } else if (results[0].viewRange === 1) {
                    if (results[0].teamID !== userTeam) {
                        return res.send({error: "auth"})
                    }
                    results[0].type = "team"
                } else if (results[0].viewRange === 2) {
                    if (results[0].viewID !== userID) {
                        return res.send({error: "auth"})
                    }
                    results[0].type = "one"
                } else {
                    results[0].type = "all"
                }
                res.send({error: error, data: results[0]})
            })
    });
    router.post('/data/a/:id', function (req, res) {
        mysql.query(`SELECT * from answer where questionID = ?`,
            [req.params.id],
            function (error, results, fields) {
                res.send({error: error, data: results})
            })
    });
    // 전체 질문 갯수
    router.post('/data/count/:range', function (req, res) {
        mysql.query(
            "SELECT COUNT(*) from question where viewRange = ?",
            [req.params.range],
            function (error, results, fields) {
                res.send({error: error, data: results[0]["COUNT(*)"]})
            })
    });
    router.post('/recommend/q/add/:id', function (req, res) {
        if (req.user == null) {
            return res.send({error: true})
        }
        mysql.query(
            "UPDATE question SET point=point+1 WHERE id = ?",
            [req.params.id],
            function (error, result) {
                if (error) {
                    return res.send({error: true})
                } else {
                    return res.send({error: false})
                }
            })
    })
    router.post('/recommend/a/add/:id', function (req, res) {
        if (req.user == null) {
            return res.send({error: true})
        }
        mysql.query(
            "UPDATE answer SET point=point+1 WHERE id = ?",
            [req.params.id],
            function (error, result) {
                if (error) {
                    return res.send({error: true})
                } else {
                    mysql.query(
                        "SELECT userID from answer WHERE id = ?",
                        [req.params.id],
                        function (error, result) {
                            if (error) {
                                return res.send({error: true})
                            } else {
                                return res.send({error: false, userID: result[0].userID})
                            }
                        })
                }
            })
    })
    router.post('/recommend/q/minus/:id', function (req, res) {
        if (req.user == null) {
            return res.send({error: true})
        }
        mysql.query(
            "UPDATE question SET point=point-1 WHERE id = ?",
            [req.params.id],
            function (error, result) {
                if (error) {
                    return res.send({error: true})
                } else {
                    return res.send({error: false})
                }
            })
    })
    router.post('/recommend/a/minus/:id', function (req, res) {
        if (req.user == null) {
            return res.send({error: true})
        }
        mysql.query(
            "UPDATE answer SET point=point-1 WHERE id = ?",
            [req.params.id],
            function (error, result) {
                if (error) {
                    return res.send({error: true})
                } else {
                    mysql.query(
                        "SELECT userID from answer WHERE id = ?",
                        [req.params.id],
                        function (error, result) {
                            if (error) {
                                return res.send({error: true})
                            } else {
                                return res.send({error: false, userID: result[0].userID})
                            }
                        })
                }
            })
    })

    // 게시판 전체 목록 표시
    router.get('/', function (req, res) {
        res.render("board.ejs")
    });
    // 라이브러리 파일 요청
    router.get('/*.html', (req, res) => {
        res.render(req.params[0] + '.html')
    })

    router.get('/javascripts/*.js', (req, res) => {
        res.redirect(`/javascripts/${req.params[0]}.js`)
    })
    // 게시물 데이터 표시
    router.get('/:id', function (req, res) {
        let userID = null
        if (req.user != null) {
            userID = req.user.id
        }
        res.render("question.html", {id: req.params.id, userID: userID})
    });
    return router
}