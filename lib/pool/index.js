const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'localhost',
    user:'',
    password:'',
    database:'test',
    connectionLimit:10,
    multipleStatements:true,
})
module.exports = pool