const express = require('express')
const router = express.Router()
const mysql = require('../lib/mysql')

module.exports = function (passport) {
    router.get('/', ((req, res) => {
        res.send('기능 구현 중')
        // res.render('search')
    }))

    router.get('/:value', ((req, res) => {
        res.send(`${req.params.value} 검색 시도`)
        // res.render('search')
    }))

    return router
}