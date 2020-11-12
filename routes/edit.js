const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    // 게시글 추가
    router.route('/question/add')
        .post((req, res) => {
            const id = req.params.id
            const data = req.body
            if (req.user == null) {
                console.log(data)
                return res.render('alert.ejs', {
                    message: "로그인하셔야 게시물을 등록할 수 있습니다.",
                    redirectPage: `/board`
                })
            }
            console.log(data)
            if (data.viewId == '')
                data.viewId = 0
            if (data.questionID == '') {
                mysql.query(
                    `INSERT INTO question (title, userID, contents, viewRange, viewID, tag) 
                VALUES (?, ?, ?, ?, ?, ?)`.trim(),
                    [data.title, req.user.id, data.contents, data.viewRange, data.viewID, data.tag],
                    function (error, results) {
                        console.log(error)
                        if (error) {
                            return res.render('alert.ejs', {
                                message: "게시물을 등록할 수 없습니다.",
                                redirectPage: `/board`
                            })
                        }
                        return res.redirect(`/board/${id}`)
                    })
            } else {
                mysql.query(
                    "UPDATE question SET title=?, contents=?, tag=?  WHERE id = ?",
                    [data.title, data.contents, data.questionID],
                    function (error, result) {
                        if (error) {
                            return res.render('alert.ejs', {
                                message: "게시물 수정에 실패하였습니다.",
                                redirectPage: `/board`
                            })
                        }
                        if (result.affectedRows > 0) {
                            return res.redirect(`/board/${data.questionID}`)
                        } else {
                            return res.render('alert.ejs', {
                                message: "게시물을 수정할 수 없습니다.",
                                redirectPage: `/board/${data.questionID}`
                            })
                        }
                    })
            }
        })
    // 답변 추가
    router.route('/answer/add/:id')
        .post((req, res) => {
            const id = req.params.id
            const data = req.body
            if (req.user == null) {
                return res.render('alert.ejs', {
                    message: "로그인하셔야 답변을 등록할 수 있습니다.",
                    redirectPage: `/board/${id}`
                })
            }
            mysql.query(
                "INSERT INTO answer (userID, contents, questionID) VALUES (?, ?, ?)",
                [req.user.id, data.contents, id],
                function (error, results) {
                    if (error) {
                        return res.render('alert.ejs', {
                            message: "답변을 등록할 수 없습니다.",
                            redirectPage: `/board`
                        })
                    }
                    return res.redirect(`/board/${id}`)
                })
        })
    // 게시글 수정
    // TODO("/question/update/:id")
    // 답변 수정
    router.route('/answer/update/:id')
        .post((req, res) => {
            const id = req.params.id
            const data = req.body
            if (req.user == null) {
                return res.render('alert.ejs', {
                    message: "사용자 정보 인증에 실패하였습니다.",
                    redirectPage: `/board/${data.questionID}`
                })
            }
            console.log(data)
            if (data[`contents_answer${id}`].length == 0) {
                return res.render('alert.ejs', {
                    message: "입력된 데이터가 없어 수정이 취소되었습니다.",
                    redirectPage: `/board/${data.questionID}`
                })
            }
            mysql.query(
                "UPDATE answer SET contents=? WHERE id = ?",
                [data[`contents_answer${id}`], id],
                function (error, result) {
                    if (error) {
                        return res.render('alert.ejs', {
                            message: "답변을 수정할 수 없습니다.",
                            redirectPage: `/board`
                        })
                    }
                    if (result.affectedRows > 0) {
                        return res.redirect(`/board/${data.questionID}`)
                    } else {
                        return res.render('alert.ejs', {
                            message: "답변을 수정할 수 없습니다.",
                            redirectPage: `/board/${data.questionID}`
                        })
                    }
                })
        })
    // 게시글 삭제
    router.post('/question/delete/:id', function (req, res, next) {
        const id = req.params.id

        if (req.user == null) {
            return res.send({isSuccess: false})
        }
        mysql.query(
            "DELETE FROM question WHERE id = ? and userID = ?",
            [id, req.user.id],
            function (error, result) {
                if (error) {
                    return res.send({isSuccess: false})
                }
                if (result.affectedRows > 0)
                    res.send({isSuccess: true})
                else
                    res.send({isSuccess: false})
            })
    })
    // 답변 삭제
    router.post('/answer/delete/:id', function (req, res, next) {
        const id = req.params.id

        if (req.user == null) {
            return res.send({isSuccess: false})
        }
        mysql.query(
            "DELETE FROM answer WHERE id = ? and userID = ?",
            [id, req.user.id],
            function (error, result) {
                if (error) {
                    return res.send({isSuccess: false})
                }
                if (result.affectedRows > 0)
                    res.send({isSuccess: true})
                else
                    res.send({isSuccess: false})
            })
    })
    router.get('/team/question/add/:viewID', (req, res) => {
        req.session.viewID = req.params.viewID
        req.session.viewRange = 1
        res.redirect(`/edit`)
    })
    // 라이브러리 파일 요청
    router.get('/*.html', (req, res) => {
        res.render(req.params[0] + '.html')
    })

    router.get('/javascripts/*.js', (req, res) => {
        res.redirect(`/javascripts/${req.params[0]}.js`)
    })
    // 게시글 작성 페이지 로드
    router.get('/', function (req, res, next) {
        if (req.user == null) {
            return res.render('alert.ejs', {
                message: "로그인 하셔야 게시물을 작성하실 수 있습니다.",
                redirectPage: `/board`
            })
        }
        let viewRange
        if (req.session.viewRange != null) {
            viewRange = req.session.viewRange
            req.session.viewRange = null
        } else {
            viewRange = 0
        }
        let viewID
        if (req.session.viewID != null) {
            viewID = req.session.viewID
            req.session.viewID = null
        } else {
            viewID = null
        }
        if (viewRange !== 0) {
            if (viewRange === 1 && req.user.teamID !== viewID) {
                return res.render('alert.ejs', {
                    message: "요청한 범위의 작성 권한이 없습니다.",
                    redirectPage: `/board`
                })
            }
        }
        res.render('edit.html', {id: null, viewRange: viewRange, viewID: viewID})
    })
    // 게시글 수정 페이지 로드
    router.get('/:id', function (req, res, next) {
        if (req.user == null)
            return res.render('alert.ejs', {
                message: "수정 권한이 없습니다. 로그인해주세요.",
                redirectPage: `/board`
            })
        mysql.query(`SELECT userID from question where id = ?`,
            [req.params.id],
            function (error, results) {
                if (results[0].userID === req.user.id) {
                    return res.render('edit.html', {id: req.params.id, viewRange: 0, viewID: null})
                } else {
                    return res.render('alert.ejs', {
                        message: "다른 사람이 작성한 글은 수정할 수 없습니다.",
                        redirectPage: `/board`
                    })
                }
            })
    })

    return router
}