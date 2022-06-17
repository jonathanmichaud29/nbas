const mysql = require('mysql2');

const configDB = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}

const configPoolDB = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10
}

const conn = mysql.createConnection(configDB);
const connPool = mysql.createPool(configPoolDB);

exports.mysqlQueryPoolInserts = async(query, values) => {
  let success = true;
  let data = [];
  let error = {}; 
  const promisePool = connPool.promise();
  const promiseConn = await promisePool.getConnection()

  await promiseConn.beginTransaction();
  
  await Promise.all( values.map(async(iterValues) => {
    return await promiseConn.query(query, iterValues)
      .then( ([rows]) => {
        data.push(rows.insertId);
        return Promise.resolve(true);
      })
      .catch( (err) => {
        error = err;
        return Promise.reject(err);
      })
  }))
    .catch((err) => {
      success = false;
    })
  
  

  if( success ){
    await promiseConn.commit();
    return {
      status: true, 
      data: data, 
      error: {}
    }
  } else {
    await promiseConn.rollback();
    return {
      status: false, 
      data: [], 
      error: error
    }
  }
  
}


exports.mysqlQueryPoolMixUpdates = async(queries) => {
  let success = true;
  let data = [];
  let error = {}; 
  const promisePool = connPool.promise();
  const promiseConn = await promisePool.getConnection()

  await promiseConn.beginTransaction();
  
  await Promise.all( queries.map(async(queryValues) => {
    return await promiseConn.execute(queryValues.query, queryValues.values)
      .then( () => {
        return Promise.resolve(true);
      })
      .catch( (err) => {
        error = err;
        return Promise.reject(err);
      })
  }))
    .catch((err) => {
      success = false;
    })
  

  if( success ){
    await promiseConn.commit();
    return {
      status: true, 
      data: data, 
      error: {}
    }
  } else {
    await promiseConn.rollback();
    return {
      status: false, 
      data: [], 
      error: error
    }
  }
  
}

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