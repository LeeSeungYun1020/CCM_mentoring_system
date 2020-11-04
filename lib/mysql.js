const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'lsy1020',
    database : 'mentoring'
});

connection.connect();

module.exports = connection