const mysql = require('mysql');

const con = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.DATABASE
    });

module.exports = {
    getConnection: (callback) => {
        return con.getConnection(callback);
    }
} 