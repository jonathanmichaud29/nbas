const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");
const { getPlayerData, getTeamData } = require("../utils/simpleQueries");
const { is_missing_keys, castNumber } = require("../utils/validation")


exports.getTeamsPlayers = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  const selectedLeagueId = castNumber(req.headers.idleague);
  const listLeagueIds = req.body.leagueIds !== undefined ? req.body.leagueIds : [selectedLeagueId]
  let query = '';
  let values = [];

  if( req.body.allTeamsPlayers !== undefined && req.body.allTeamsPlayers) {
    query = `SELECT t.id as teamId, t.name as teamName, p.id as playerId, p.name as playerName 
      FROM team_player as tp 
      INNER JOIN teams as t ON (tp.idTeam=t.id) 
      INNER JOIN team_league as tl ON (t.id=tl.idTeam AND tl.idLeague=?) 
      INNER JOIN players AS p ON (tp.idPlayer=p.id)`;
      values = [listLeagueIds];
  }
  else if( req.body.teamIds !== undefined && req.body.teamIds.length > 0) {
    query = `SELECT t.id as teamId, t.name as teamName, p.id as playerId, p.name as playerName 
      FROM team_player as tp 
      INNER JOIN teams as t ON (tp.idTeam=t.id) 
      INNER JOIN players AS p ON (tp.idPlayer=p.id) 
      WHERE tp.idTeam IN ?`;
    values = [[req.body.teamIds]];
  }
  else if( req.body.playerIds !== undefined && req.body.playerIds.length > 0) {
    query = `SELECT t.id as teamId, t.name as teamName, p.id as playerId, p.name as playerName 
      "FROM team_player as tp 
      "INNER JOIN teams as t ON (tp.idTeam=t.id) 
      "INNER JOIN players AS p ON (tp.idPlayer=p.id) 
      "WHERE tp.idPlayer IN ?`;
    values = [[req.body.playerIds]];
  }
  else {
    return appResponse(res, next, true, {}, {});
  }

  const resultMainQuery = await mysqlQuery(query, values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};


exports.getUnassignedPlayers = async (req, res, next) => {
  const selectedLeagueId = castNumber(req.headers.idleague);
  // Find all league players
  const queryPlayers = "SELECT idPlayer FROM player_league WHERE idLeague=?"
  const resultPlayers = await mysqlQuery(queryPlayers, [selectedLeagueId])
  const listPlayerIds = resultPlayers.data.map((row)=>row.idPlayer);

  // Find all league teams
  const queryTeams = "SELECT idTeam FROM team_league WHERE idLeague=?"
  const resultTeams = await mysqlQuery(queryTeams, [selectedLeagueId])
  const listTeamIds = resultTeams.data.map((row)=>row.idTeam);

  // Find all players attached to a team in this league
  const queryTeamPlayers = "SELECT idPlayer FROM team_player WHERE idTeam IN ? AND idPlayer IN ?"
  const resultTeamPlayers = await mysqlQuery(queryTeamPlayers, [[listTeamIds], [listPlayerIds]])
  const listTeamPlayerIds = resultTeamPlayers.data.map((row)=>row.idPlayer);

  // Player IDs that are active in this league without being associated to a team
  let listPlayerIdsWithoutTeam = listPlayerIds.filter(x => !listTeamPlayerIds.includes(x));
  if( listPlayerIdsWithoutTeam.length === 0 ){
    listPlayerIdsWithoutTeam = [0];
  }

  // Final Query
  const query = "SELECT p.* FROM players as p WHERE p.id IN ?";
  const resultMainQuery = await mysqlQuery(query, [[listPlayerIdsWithoutTeam]])
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.createTeamPlayer = async (req, res, next) => {
  if (!req.body.teamId) {
    return next(new AppError("No team id found", 404));
  }
  if (!req.body.playerId) {
    return next(new AppError("No player id found", 404));
  }

  const values = [
    [[req.body.teamId, req.body.playerId]]
  ];
  const resultMainQuery = await mysqlQuery("INSERT INTO team_player (idTeam, idPlayer) VALUES ?", values)
  

  const customData={
    idTeam: req.body.teamId,
    idPlayer: req.body.playerId
  }
  let customMessage=''
  if( resultMainQuery.status ) {
    customMessage = 'team player added!';
    const resultPlayerData = await getPlayerData(req.body.playerId);
    const resultTeamData = await getTeamData(req.body.teamId);
    
    if( resultPlayerData.status && resultTeamData.status ){
      customMessage = `Player '${resultPlayerData.data.name}' added to team '${resultTeamData.data.name}'!`
    }
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
  
};

exports.deleteTeamPlayer = async (req, res, next) => {
  if (!req.params) return next(new AppError("No form data found", 404));
  
  const paramsRequiredKeys = ["teamId", "playerId"]
  if( is_missing_keys(paramsRequiredKeys, req.params) ) {
    return next(new AppError(`Missing params parameters`, 404));
  }

  const resultPlayerData = await getPlayerData(req.params.playerId);
  const resultTeamData = await getTeamData(req.params.teamId);
  
  const values = [req.params.teamId, req.params.playerId]
  const resultMainQuery = await mysqlQuery("DELETE from team_player WHERE idTeam=? AND idPlayer=?", values);

  let customMessage = '';
  if( resultMainQuery.status ) {
    customMessage = `This player has been removed from this team`;
    if( resultPlayerData.status && resultTeamData.status ){
      customMessage = `'${resultPlayerData.data.name}' has been removed from the '${resultTeamData.data.name}'!`
    }
  }
  return appResponse(res, next, resultMainQuery.status, [], resultMainQuery.error, customMessage);
};