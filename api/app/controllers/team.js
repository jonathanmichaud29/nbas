const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery, mysqlGetConnPool } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")
const { getLeagueTeamByName } = require('../utils/simpleQueries');


exports.getTeams = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  const selectedLeagueId = castNumber(req.headers.idleague);
  const listLeagueIds = req.body.leagueIds !== undefined ? req.body.leagueIds : [selectedLeagueId]
  let query = '';
  let values = [];
  if( req.body.teamIds !== undefined ){
    query = "SELECT t.* FROM teams as t INNER JOIN team_league as tl ON (t.id=tl.idTeam AND tl.idLeague IN ?) WHERE t.id IN ?";
    const listPlayerIds = req.body.teamIds.length > 0 ? req.body.teamIds : [0];
    values = [[listLeagueIds], [listPlayerIds]];
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else if(req.body.allTeams !== undefined && req.body.allTeams ) {
    query = "SELECT t.* FROM teams as t INNER JOIN team_league as tl ON (t.id=tl.idTeam AND tl.idLeague IN ?) ";
    values = [[listLeagueIds]]
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else {
    return appResponse(res, next, true, {}, {});
  }

};

exports.createTeam = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  
  const bodyRequiredKeys = ["name"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  const selectedSeasonId = castNumber(req.headers.idseason);

  const resultTeams = await getLeagueTeamByName(req.body.name, selectedLeagueId);
  if( resultTeams.data.length > 0 ){
    return appResponse(res, next, false, {}, `Team '${req.body.name}' already exists in this league`);
  }

  // Prepare queries
  let success = true;
  let data = [];
  let error = {}; 

  const promiseConn = await mysqlGetConnPool()
  await promiseConn.beginTransaction();

  let teamId = 0;
  const resultTeam = await promiseConn.execute("INSERT INTO teams (name) VALUES(?)", [req.body.name])
    .then( ([rows]) => {
      teamId = rows.insertId;
      return Promise.resolve(true);
    })
    .catch( (err) => {
      error = err;
      success = false;
      return Promise.reject(err);
    })

  try{
    await promiseConn.query("INSERT INTO team_league (idLeague, idTeam) VALUES ?", [[[selectedLeagueId, teamId]]])
      .then( () => {
        return Promise.resolve(true);
      })
      .catch( (err) => {
        error = err;
        success = false;
        return Promise.reject(err);
      })
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
    const customData = {
      teamId: teamId,
      teamName: req.body.name,
      leagueId: selectedLeagueId,
      leagueName: req.userAccessLeagues.find((league) => league.id === selectedLeagueId).name,
      seasonId: selectedSeasonId,
    }
    const customMessage = `Team '${req.body.name}' created!`
    return appResponse(res, next, success, customData, null, customMessage);
  }
  else {
    await promiseConn.rollback();
    promiseConn.release()
    return appResponse(res, next, success, null, error);
  }
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
    query = `SELECT t.id, COUNT(*) as nbGamePlayed, SUM(if(m.idTeamWon=t.id, 1, 0)) as nbWins, SUM(if(m.idTeamLost=t.id, 1, 0)) as nbLosts, SUM(if(m.idTeamWon=0 AND m.idTeamLost=0, 1, 0)) as nbNulls 
      FROM teams as t 
      INNER JOIN matches as m ON (t.id=m.idTeamHome OR t.id=m.idTeamAway)
      WHERE m.isCompleted=1 AND t.id IN ? 
      GROUP BY t.id`;
    values = [[req.body.teamIds]];
  }
  else if(req.body.allTeams !== undefined && req.body.allTeams ) {
    query = `SELECT t.id, COUNT(*) as nbGamePlayed, SUM(if(m.idTeamWon=t.id, 1, 0)) as nbWins, SUM(if(m.idTeamLost=t.id, 1, 0)) as nbLosts, SUM(if(m.idTeamWon=0 AND m.idTeamLost=0, 1, 0)) as nbNulls 
      FROM nbas.teams as t 
      INNER JOIN matches as m ON (t.id=m.idTeamHome OR t.id=m.idTeamAway) 
      WHERE m.isCompleted=1 
      GROUP BY t.id`;
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
