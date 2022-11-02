var mysql = require('mysql')

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})

connection.query({
    sql: `SELECT * FROM Users;`
}, (err, rows) => {
    console.error(err)
})
console.log(`\n\n\nCONNECTION IS ${connection.state}\n\n\n`);
module.exports = connection

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Doctor_Wh0';
//flush privileges;