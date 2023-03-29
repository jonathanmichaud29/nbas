const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const appResponseActions = require("../utils/appResponseActions");

const { mysqlQuery, mysqlGetConnPool } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")

exports.getLeagueSeasons = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  const selectedLeagueId = castNumber(req.headers.idleague);
  const listLeagueIds = req.body.leagueIds !== undefined ? ( req.body.leagueIds.length > 0 ? req.body.leagueIds : [0]) : [selectedLeagueId]
  let query = '';
  let values = [];

  query = "SELECT ls.* FROM league_season as ls WHERE ls.idLeague IN ?";
  values.push( [listLeagueIds] );
  const resultMainQuery = await mysqlQuery(query, values);
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);

};



exports.createLeagueSeason = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));

  const bodyRequiredKeys = ["name", "year"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  
  // Prepare queries
  let success = true;
  let data = [];
  let error = {};

  const promiseConn = await mysqlGetConnPool()
  await promiseConn.beginTransaction();

  const selectedLeagueId = castNumber(req.headers.idleague);
  const values = [selectedLeagueId, req.body.name, req.body.year];
  
  let seasonId = 0;
  try{
    const resultLeague = await promiseConn.query("INSERT INTO league_season (idLeague, name, year) VALUES (?)", [values])
      .then( ([rows]) => {
        seasonId = rows.insertId;
        return Promise.resolve(true);
      })
      .catch( (err) => {
        error = err;
        console.log(err)
        success = false;
        return Promise.reject(err);
      })
      .then(()=>{
        promiseConn.release();
      })
  } catch( e ){
    success=false;
    error = e;
    
  }
  

  if( success ){
    await promiseConn.commit();
    promiseConn.release()
    const customData = {
      id: seasonId,
      idLeague: selectedLeagueId,
      name: req.body.name,
      year: req.body.year,
    }
    const customMessage = `season league '${req.body.name}' created!`
    return appResponse(res, next, success, customData, null, customMessage);
  }
  else {
    await promiseConn.rollback();
    promiseConn.release()
    return appResponse(res, next, success, null, error, null, 'season');
  }
  
};


exports.deleteLeagueSeason = async (req, res, next) => {
  if (!req.params.idSeason) {
    return next(new AppError("No player id found", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  const values = [req.params.idSeason, selectedLeagueId];
  const resultMainQuery = await mysqlQuery("DELETE FROM league_season WHERE id=? AND idLeague=?", values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      id: req.params.idSeason
    };
    customMessage = `League season deleted!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};