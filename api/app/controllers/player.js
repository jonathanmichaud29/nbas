const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const appResponseActions = require("../utils/appResponseActions");

const { mysqlQuery, mysqlGetConnPool } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")
const { getSystemPlayersByName } = require("../utils/simpleQueries");


exports.getPlayers = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  const selectedLeagueId = castNumber(req.headers.idleague);

  let query = '';
  let values = [];
  if( req.body.playerIds !== undefined ){
    query = "SELECT p.* FROM players as p INNER JOIN player_league as pl ON (p.id=pl.idPlayer AND pl.idLeague=?) WHERE p.id IN ?";
    const listPlayerIds = req.body.playerIds.length > 0 ? req.body.playerIds : [0];
    values = [selectedLeagueId, [listPlayerIds]];
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else if(req.body.allPlayers !== undefined && req.body.allPlayers ) {
    query = "SELECT p.* FROM players as p INNER JOIN player_league as pl ON (p.id=pl.idPlayer AND pl.idLeague=?) ";
    values = [selectedLeagueId]
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else {
    return appResponse(res, next, true, {}, {});
  }
  
};


exports.createPlayer = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));

  const bodyRequiredKeys = ["name"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);

  if( req.body.existingPlayer === undefined ){
    const resultPlayers = await getSystemPlayersByName(req.body.name);
    if( resultPlayers.data.length > 0 ){
      const customData = {
        players: resultPlayers.data
      }
      return appResponseActions(res, next, false, customData, `${req.body.name} exists in the system. What do you want to do?`, 'playerExists');
    }
  }

  // Prepare queries
  let success = true;
  let data = [];
  let error = {}; 

  const promiseConn = await mysqlGetConnPool()
  await promiseConn.beginTransaction();

  let playerId = 0;
  if( req.body.existingPlayer === undefined || castNumber(req.body.existingPlayer) === 0){
    const resultPlayer = await promiseConn.execute("INSERT INTO players (name) VALUES(?)", [req.body.name])
      .then( ([rows]) => {
        playerId = rows.insertId;
        return Promise.resolve(true);
      })
      .catch( (err) => {
        error = err;
        success = false;
        return Promise.reject(err);
      })
  }
  else{
    playerId = req.body.existingPlayer
  }
  
  try{
    await promiseConn.query("INSERT INTO player_league (idLeague, idPlayer) VALUES ?", [[[selectedLeagueId, playerId]]])
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
    const customData = {
      playerId: playerId,
      playerName: req.body.name,
      leagueId: selectedLeagueId,
      leagueName: req.userAccessLeagues.find((league) => league.id === selectedLeagueId).name
    }
    const customMessage = `player '${req.body.name}' created!`
    return appResponse(res, next, success, customData, null, customMessage);
  }
  else {
    console.log("rollback")
    await promiseConn.rollback();
    return appResponse(res, next, success, null, error);
  }
  
};


exports.deletePlayer = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery("DELETE FROM players WHERE id=?", values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      playerId: req.params.id,
      leagueId: selectedLeagueId
    };
    customMessage = `player deleted from this league!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};





/**
 * uncleaned entry points
 */



exports.getPlayerMatches = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  const resultMainQuery = await mysqlQuery("SELECT * FROM match_lineup WHERE idPlayer=?", [req.params.id])
  let customData = {
    matchLineups:[],
    matches:[],
    teams:[]
  }

  let listTeamIds = [];
  let listMatchIds = [];
  let customMessage = '';
  
  if( resultMainQuery.status ){
    customData.matchLineups = resultMainQuery.data;
    listMatchIds = resultMainQuery.data.map((row) => row.idMatch)
  }

  if( listMatchIds.length > 0 ){
    const resultQueryMatches = await mysqlQuery("SELECT * FROM matches WHERE id IN ?", [[listMatchIds]])
    if( resultQueryMatches.status ){
      customData.matches = resultQueryMatches.data;
      const teamAwayIds = resultQueryMatches.data.map((row) => row.idTeamAway)
      const teamHomeIds = resultQueryMatches.data.map((row) => row.idTeamHome)
      listTeamIds = teamHomeIds.concat(teamAwayIds)
    }
  }

  if( listTeamIds.length > 0 ){
    const resultQueryTeams = await mysqlQuery("SELECT * FROM teams WHERE id IN ?", [[listTeamIds]])
    if( resultQueryTeams.status ){
      customData.teams = resultQueryTeams.data;
    }
  }

  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};
