const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");

/**
 * Fetch players from a list of ID or fetching all players
 * TODO: We should add an argument to fetch players by a specific league
 */
exports.getPlayers = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));

  let query = '';
  let values = [];
  if( req.body.playerIds !== undefined && req.body.playerIds.length > 0 ){
    query = "SELECT * FROM players WHERE id IN ?";
    values = [[req.body.playerIds]];
  }
  else if(req.body.allPlayers !== undefined && req.body.allPlayers ) {
    query = "SELECT * FROM players";
  }
  else {
    return appResponse(res, next, true, {}, {});
  }

  const resultMainQuery = await mysqlQuery(query, values);
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};


exports.createPlayer = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  const values = [req.body.name];
  const resultMainQuery = await mysqlQuery("INSERT INTO players (name) VALUES(?)", values)

  let customMessage = ''
  let customData = {}
  if( resultMainQuery.status ) {
    customData = {
      id: resultMainQuery.data.insertId,
      name: req.body.name
    }
    customMessage = `player '${req.body.name}' created!`
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};


exports.deletePlayer = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery("DELETE FROM players WHERE id=?", values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      id: req.params.id
    };
    customMessage = `player deleted!`;
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
