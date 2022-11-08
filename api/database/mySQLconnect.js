var mysql = require('mysql')

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
})

const status = connection.state

console.log(`\n\n\n${status}\n\n\n`)

module.exports = connection
