const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    // 게시글 추가
    // TODO("/question/add/:id")
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
    // 라이브러리 파일 요청
    router.get('/*.html', (req, res) => {
        res.render(req.params[0] + '.html')
    })

    router.get('/javascripts/*.js', (req, res) => {
        res.redirect(`/javascripts/${req.params[0]}.js`)
    })
    // 게시글 작성 페이지 로드
    router.get('/', function (req, res, next) {
        res.render('edit.html')
    })
    // 게시글 수정 페이지 로드
    router.get('/:id', function (req, res, next) {
        console.log(req.params.id)
        res.render('edit.html')
    })

    return router
}