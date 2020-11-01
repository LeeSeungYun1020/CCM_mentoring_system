const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'lsy1020',
    database : 'mentoring'
});

connection.connect();

// connection.query('SELECT * from d', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

connection.end();