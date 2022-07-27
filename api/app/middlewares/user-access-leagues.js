const { mysqlQuery } = require("../services/db");

exports.userAccessLeagues = async(req, res, next) =>{
  if( req.userToken === ''){
    return next();
  }

  const query = "SELECT l.* " +
  "FROM users as u " +
  "INNER JOIN user_league AS ul ON (u.id=ul.idUser) " +
  "INNER JOIN leagues as l ON (ul.idLeague=l.id) " +
  "WHERE u.`firebaseToken`=?";
  const values = [req.userToken];
  const resultMainQuery = await mysqlQuery(query, values);
  const leagues = resultMainQuery.data.map((league) => league)
  req.userAccessLeagues = leagues;
  return next();
}

