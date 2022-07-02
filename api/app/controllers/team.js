const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");
const { getPlayerData, getTeamData } = require("../utils/simpleQueries");
const { is_missing_keys } = require("../utils/validation");


/**
 * Fetch teams from a list of ID or fetching all teams
 * TODO: We should add an argument to fetch teams by a specific league
 */
 exports.getTeams = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));

  let query = '';
  let values = [];
  if( req.body.teamIds !== undefined && req.body.teamIds.length > 0 ){
    query = "SELECT * FROM teams WHERE id IN ?";
    values = [[req.body.teamIds]];
  }
  else if(req.body.allTeams !== undefined && req.body.allTeams ) {
    query = "SELECT * FROM teams";
  }
  else {
    return appResponse(res, next, true, {}, {});
  }

  const resultMainQuery = await mysqlQuery(query, values);
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.createTeam = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));

  const values = [req.body.name];
  const resultMainQuery = await mysqlQuery("INSERT INTO teams (name) VALUES(?)", values)

  let customData = {}
  let customMessage = ''
  if( resultMainQuery.status ) {
    customMessage = `The team '${req.body.name}' is created`;
    customData = {
      id: resultMainQuery.data.insertId,
      name: req.body.name
    }
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};

exports.deleteTeam = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }

  const values = [req.params.id]
  const resultMainQuery = await mysqlQuery("DELETE from teams WHERE id=?", values);

  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `The team is deleted`;
  }
  return appResponse(res, next, resultMainQuery.status, [], resultMainQuery.error, customMessage);
};

exports.getStandingTeams = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  
  let query = '';
  let values = [];
  if( req.body.teamIds !== undefined && req.body.teamIds.length > 0 ){
    query = "SELECT t.id, COUNT(*) as nbGamePlayed, SUM(if(m.idTeamWon=t.id, 1, 0)) as nbWins, SUM(if(m.idTeamLost=t.id, 1, 0)) as nbLosts, SUM(if(m.idTeamWon=0 AND m.idTeamLost=0, 1, 0)) as nbNulls "+
      "FROM nbas.teams as t "+
      "INNER JOIN matches as m ON (t.id=m.idTeamHome OR t.id=m.idTeamAway) "+
      "WHERE m.isCompleted=1 AND t.id IN ? "+
      "GROUP BY t.id";
    values = [[req.body.teamIds]];
  }
  else if(req.body.allTeams !== undefined && req.body.allTeams ) {
    query = "SELECT t.id, COUNT(*) as nbGamePlayed, SUM(if(m.idTeamWon=t.id, 1, 0)) as nbWins, SUM(if(m.idTeamLost=t.id, 1, 0)) as nbLosts, SUM(if(m.idTeamWon=0 AND m.idTeamLost=0, 1, 0)) as nbNulls "+
      "FROM nbas.teams as t "+
      "INNER JOIN matches as m ON (t.id=m.idTeamHome OR t.id=m.idTeamAway) "+
      "WHERE m.isCompleted=1 "+
      "GROUP BY t.id";
  }
  else {
    return appResponse(res, next, true, {}, {});
  }
  
  const resultMainQuery = await mysqlQuery(query, values)
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);

}; 




/**
 * uncleaned entry points
 */



exports.getAllTeamPlayers = async (req, res, next) => {
  
  const query = "SELECT t.id as teamId, t.name as teamName, p.id as playerId, p.name as playerName "+
    "FROM team_player as tp " +
    "INNER JOIN teams as t ON (tp.idTeam=t.id) " +
    "INNER JOIN players AS p ON (tp.idPlayer=p.id) ";
  const values = [];
  const resultMainQuery = await mysqlQuery(query, values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.getTeamPlayers = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }

  const query = "SELECT t.id as teamId, t.name as teamName, p.id as playerId, p.name as playerName "+
    "FROM team_player as tp " +
    "INNER JOIN teams as t ON (tp.idTeam=t.id) " +
    "LEFT JOIN players AS p ON (tp.idPlayer=p.id) " +
    "WHERE tp.idTeam = ?";
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery(query, values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.getUnassignedPlayers = async (req, res, next) => {

  const query = "SELECT p.* "+
    "FROM players as p  " +
    "LEFT JOIN team_player as tp ON (tp.idPlayer=p.id) " +
    "WHERE tp.idTeam IS NULL";
  const resultMainQuery = await mysqlQuery(query, [])

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};


exports.createTeamPlayer = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  if (!req.body.idPlayer) {
    return next(new AppError("No player selected", 404));
  }

  const values = [
    [[req.params.id, req.body.idPlayer]]
  ];
  const resultMainQuery = await mysqlQuery("INSERT INTO team_player (idTeam, idPlayer) VALUES ?", values)
  

  const customData={
    idTeam: req.params.id,
    idPlayer: req.body.idPlayer
  }
  let customMessage=''
  if( resultMainQuery.status ) {
    customMessage = 'team player added!';
    const resultPlayerData = await getPlayerData(req.body.idPlayer);
    const resultTeamData = await getTeamData(req.params.id);
    
    if( resultPlayerData.status && resultTeamData.status ){
      customMessage = `Player '${resultPlayerData.data.name}' added to team '${resultTeamData.data.name}'!`
    }
    else {
      console.error("Secondary queries errors", resultPlayerData, resultTeamData);
    }
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
  
};

exports.deleteTeamPlayer = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  
  const bodyRequiredKeys = ["teamId", "teamName", "playerId", "playerName"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  
  const values = [req.body.team_id, req.body.player_id]
  const resultMainQuery = await mysqlQuery("DELETE from team_player WHERE idTeam=? AND idPlayer=?", values);

  let customMessage = '';
  if( resultMainQuery.status ) {
    customMessage = `'${req.body.player_name}' has been removed from team '${req.body.team_name}'`;
  }
  return appResponse(res, next, resultMainQuery.status, [], resultMainQuery.error, customMessage);
};


exports.getTeamMatches = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  const resultMainQuery = await mysqlQuery("SELECT * FROM match_lineup WHERE idTeam=?", [req.params.id])
  let customData = {
    matchLineups:[],
    matches:[],
    teams:[],
    players:[],
  }

  let listPlayerIds = [];
  let listTeamIds = [];
  let listMatchIds = [];
  let customMessage = '';
  
  if( resultMainQuery.status ){
    customData.matchLineups = resultMainQuery.data;
    listMatchIds = resultMainQuery.data.map((row) => row.idMatch)
    listPlayerIds = resultMainQuery.data.map((row) => row.idPlayer)
  }

  if( listPlayerIds.length > 0 ){
    const resultQueryPlayers = await mysqlQuery("SELECT * FROM players WHERE id IN ?", [[listPlayerIds]])
    if( resultQueryPlayers.status ){
      customData.players = resultQueryPlayers.data;
    }
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