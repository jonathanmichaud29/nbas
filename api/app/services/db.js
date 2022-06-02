const mysql = require('mysql2');

const configDB = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}

const conn = mysql.createConnection(configDB);


exports.mysqlQuery = async(query, values) => {
  let success = true;
  let data = [];
  let error = {}; 
  await conn.promise().query(query, values)
    .then( ([rows]) => {
      data = rows;
    })
    .catch( (err) => {
      success = false;
      error = err;
    })
  return {
    status: success, 
    data: data, 
    error: error
  };
}