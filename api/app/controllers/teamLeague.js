const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");

const { mysqlQuery/* , mysqlGetConnPool */ } = require("../services/db");
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

exports.deleteLeagueTeam = async (req, res, next) => {
  if (!req.params.idTeam) {
    return next(new AppError("No team id found", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  
  const query = "DELETE tl, t " +
    "FROM team_league as tl " +
    "INNER JOIN teams as t ON (tl.idTeam=t.id) "+ 
    "WHERE tl.idTeam=? AND tl.idLeague=?";
  const values = [req.params.idTeam, selectedLeagueId];
  
  const resultMainQuery = await mysqlQuery(query, values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      teamId: req.params.idTeam,
      leagueId: selectedLeagueId
    };
    customMessage = `team deleted from this league!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};


