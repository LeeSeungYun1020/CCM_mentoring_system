const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    // 게시글 작성 페이지 로드
    router.get('/', function (req, res, next) {
        res.render('edit.html')
    });
    // 게시글 수정 페이지 로드
    router.get('/:id', function (req, res, next) {
        console.log(req.params.id)
        res.render('edit.html')
    });
    // 게시글 추가
    // TODO("/question/add/:id")
    // 답변 추가
    router.route('/answer/add/:id')
        .post((req, res) => {
            const id = req.params.id
            const data = req.body
            console.log(data.contents)
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
    // 게시글 삭제
    // TODO("/question/delete/:id")
    // 답변 삭제
    return router
}