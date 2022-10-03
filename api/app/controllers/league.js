const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const appResponseActions = require("../utils/appResponseActions");

const { mysqlQuery, mysqlGetConnPool } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")

exports.getLeagues = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  /* const selectedLeagueId = castNumber(req.headers.idleague); */

  let query = '';
  let values = [];
  if( req.body.leagueIds !== undefined ){
    query = "SELECT l.* FROM leagues as l WHERE l.id IN ?";
    const listLeagueIds = req.body.leagueIds.length > 0 ? req.body.leagueIds : [0];
    values = [selectedLeagueId, [listLeagueIds]];
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else if(req.body.allLeagues !== undefined && req.body.allLeagues ) {
    query = "SELECT l.* FROM leagues as l";
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else {
    return appResponse(res, next, true, {}, {});
  }
  
};



exports.createLeague = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));

  const bodyRequiredKeys = ["name"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  
  // Prepare queries
  let success = true;
  let data = [];
  let error = {}; 

  /* console.log(req.userAccessLeagues, req.userId);
  return appResponse(res, next, false, null, "Force return"); */
  const promiseConn = await mysqlGetConnPool()
  await promiseConn.beginTransaction();

  let leagueId = 0;
  try{
    const resultLeague = await promiseConn.execute("INSERT INTO leagues (name) VALUES (?)", [req.body.name])
      .then( ([rows]) => {
        leagueId = rows.insertId;
        return Promise.resolve(true);
      })
      .catch( (err) => {
        error = err;
        success = false;
        return Promise.reject(err);
      })
  } catch( e ){
    success=false;
    error = e;
    
  }
  
  if( success ) {
    try{
      await promiseConn.query("INSERT INTO user_league (idLeague, idUser) VALUES ?", [[[leagueId, req.userId]]])
        .then( () => {
          return Promise.resolve(true);
        })
        .catch( (err) => {
          error = err;
          success = false;
          return Promise.reject(err);
        })
    } catch( e ){
      console.log("e", e);
    }
  }

  if( success ){
    await promiseConn.commit();
    const customData = {
      id: leagueId,
      name: [req.body.name]
    }
    const customMessage = `league '${req.body.name}' created!`
    return appResponse(res, next, success, customData, null, customMessage);
  }
  else {
    await promiseConn.rollback();
    return appResponse(res, next, success, null, error, null, 'league');
  }
  
};
