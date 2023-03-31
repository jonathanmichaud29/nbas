const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");
const { is_missing_keys } = require("../utils/validation");

exports.userFirebaseToken = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No parameters found", 404));
  }
  const bodyRequiredKeys = ["email", "token"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }

  let query = "SELECT id, firebaseToken FROM users WHERE `email`=?";
  let values = [req.body.email]
  const resultMainQuery = await mysqlQuery(query, values);
  let customData = {}
  if( resultMainQuery.status ){
    if( resultMainQuery.data[0].firebaseToken !== req.body.token){
      query = "UPDATE users SET `firebaseToken`=? WHERE id=?";
      values = [req.body.token, resultMainQuery.data[0].id];
      const resultUpdate = await mysqlQuery(query,values);
      if( ! resultUpdate.status ){
        return next(new AppError(`Cannot update user Uid`, 404));
      }
    }
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error);
}

exports.fetchUserLeagues = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No parameters found", 404));
  }
  let query = "SELECT l.* " +
  "FROM users as u " +
  "INNER JOIN user_league AS ul ON (u.id=ul.idUser) " +
  "INNER JOIN leagues as l ON (ul.idLeague=l.id) " +
  "WHERE u.`firebaseToken`=?";
  const values = [req.userToken];
  const resultMainQuery = await mysqlQuery(query, values);

  let customData = {
    leagues:[],
    leagueSeasons: []
  }
  let customMessage = '';
  if( resultMainQuery.status ){
    customData.leagues = resultMainQuery.data;

    const aLeagueIds = customData.leagues.map((league) => league.id);
    query = "SELECT ls.* FROM league_season as ls WHERE idLeague IN (?)";
    const resultSeasons = await mysqlQuery(query, [aLeagueIds])
    if( resultSeasons.status ){
      customData.leagueSeasons = resultSeasons.data;
    }
  }

  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error);
}