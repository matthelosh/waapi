const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'waapi'
});

connection.connect();

// const token = connection.query('SELECT * FROM token', (err, rows, field) => {
//     if (err) throw err
//     console.log('Token ', rows[0].key)
// })

// connection.end();

module.exports = connection