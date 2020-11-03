const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'lsy1020',
    database : 'mentoring'
});

connection.connect();

connection.query(
    "SELECT id, name, type, teamID from `User` WHERE `id`=?",
    [id],
    function (error, results, fields) {
        if (error) throw error;

    })

connection.end();