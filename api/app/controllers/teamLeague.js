const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");

const { mysqlQuery, mysqlGetConnPool } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")

exports.getLeagueTeams = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  const selectedLeagueId = castNumber(req.headers.idleague);
  let query = "";
  let values = [];
  if( req.body.leagueIds !== undefined ){
    query = "SELECT * FROM team_league WHERE idLeague IN ?";
    values.push([req.body.leagueIds]);
  }
  else if( req.body.teamIds !== undefined ){
    query = "SELECT * FROM team_league WHERE idTeam IN ?";
    values.push([req.body.teamIds]);
  }
  else {
    query = "SELECT * FROM team_league WHERE idLeague=?";
    values.push(selectedLeagueId);
  }
  
  const resultMainQuery = await mysqlQuery(query, values);
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.getAllTeamSeasons = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  
  const bodyRequiredKeys = ["teamIds"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }

  const selectedLeagueId = castNumber(req.headers.idleague);
  const listLeagueIds = req.body.leagueIds !== undefined ? ( req.body.leagueIds.length > 0 ? req.body.leagueIds : [0]) : [selectedLeagueId]

  const listTeamIds = ( req.body.teamIds.length > 0 ? req.body.teamIds : [0]);
  let query = "";
  let values = [];
  
  /* query = "SELECT * FROM team_season WHERE idTeam IN ? AND idLeagueSeason IN ?";
  values.push([listTeamIds]);
  values.push([listLeagueIds]); */
  query = "SELECT * FROM team_season WHERE idTeam IN ?";
  values.push([listTeamIds]);
  
  const resultMainQuery = await mysqlQuery(query, values);
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.deleteLeagueTeam = async (req, res, next) => {
  if (!req.params.idTeam) {
    return next(new AppError("No team id found", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  const selectedSeasonId = castNumber(req.headers.idseason);
  
  /* const query = "DELETE tl, t " +
    "FROM team_league as tl " +
    "INNER JOIN teams as t ON (tl.idTeam=t.id) "+ 
    "WHERE tl.idTeam=? AND tl.idLeague=?";
  const values = [req.params.idTeam, selectedLeagueId]; */
  const query = "DELETE tl " +
    "FROM team_league as tl " +
    "WHERE tl.idTeam=? AND tl.idLeague=? AND tl.idSeason=?";
  const values = [req.params.idTeam, selectedLeagueId, selectedSeasonId];
  
  const resultMainQuery = await mysqlQuery(query, values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      teamId: req.params.idTeam,
      leagueId: selectedLeagueId,
      seasonId: selectedSeasonId
    };
    customMessage = `team deleted from this league!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};


exports.addTeamSeason = async (req, res, next) => {
  if (!req.body.idTeam) {
    return next(new AppError("No team id found", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  const selectedSeasonId = castNumber(req.headers.idseason);

  const teamId = castNumber(req.body.idTeam);

  // Prepare queries
  let success = true;
  let data = [];
  let error = {}; 

  const promiseConn = await mysqlGetConnPool()
  await promiseConn.beginTransaction();

  try{
    
    await promiseConn.query("INSERT INTO team_season (idTeam, idLeagueSeason) VALUES ?", [[[teamId, selectedSeasonId]]])
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

  if( success ){
    await promiseConn.commit();
    promiseConn.release()
    data = {
      teamId: teamId,
      leagueId: selectedLeagueId,
      seasonId: selectedSeasonId,
    };
    const message = `team added for this league season!`;
    return appResponse(res, next, success, data, null, message);
  }
  else {
    await promiseConn.rollback();
    promiseConn.release()
    return appResponse(res, next, success, null, error);
  }
  
};


exports.deleteTeamSeason = async (req, res, next) => {
  if (!req.params.idTeam) {
    return next(new AppError("No team id found", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  const selectedSeasonId = castNumber(req.headers.idseason);
  
  /* const query = "DELETE tl, t " +
    "FROM team_league as tl " +
    "INNER JOIN teams as t ON (tl.idTeam=t.id) "+ 
    "WHERE tl.idTeam=? AND tl.idLeague=?";
  const values = [req.params.idTeam, selectedLeagueId]; */
  const query = `DELETE ts, tp
    FROM team_season as ts
    INNER JOIN team_player as tp ON (ts.idTeam=tp.idTeam AND ts.idLeagueSeason=tp.idLeagueSeason)
    WHERE ts.idTeam=? AND ts.idLeagueSeason=?`;
  const values = [req.params.idTeam, selectedSeasonId];
  
  const resultMainQuery = await mysqlQuery(query, values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      teamId: req.params.idTeam,
      leagueId: selectedLeagueId,
      seasonId: selectedSeasonId
    };
    customMessage = `team deleted from this league season!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};