const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");


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
