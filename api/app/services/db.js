const mysql = require('mysql2');
const conn = mysql.createConnection({
 host: "nbas-mysql",
 user: "nbas-user",
 password: "9272jkskmdd7f8zk3asxjcvh4h",
 database: "nbas",
 port: 3306
});

conn.connect();

module.exports = conn;