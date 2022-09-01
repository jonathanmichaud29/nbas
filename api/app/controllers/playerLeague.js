const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");

const { mysqlQuery/* , mysqlGetConnPool */ } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")

exports.getLeaguePlayers = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  const selectedLeagueId = castNumber(req.headers.idleague);

  let query = "SELECT * FROM player_league WHERE idLeague=?";
  let values = [selectedLeagueId]
  
  const resultMainQuery = await mysqlQuery(query, values);
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.deleteLeaguePlayer = async (req, res, next) => {
  if (!req.params.idPlayer) {
    return next(new AppError("No player id found", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  const values = [req.params.idPlayer, selectedLeagueId];
  const resultMainQuery = await mysqlQuery("DELETE FROM player_league WHERE idPlayer=? AND idLeague=?", values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      playerId: req.params.idPlayer,
      leagueId: selectedLeagueId
    };
    customMessage = `player deleted from this league!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};

exports.getPlayersLeagues = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  /* const selectedLeagueId = castNumber(req.headers.idleague); */

  let query='SELECT pl.* FROM player_league as pl';
  let values = [];
  if( req.body.playerIds !== undefined ){
    query = "SELECT pl.* FROM player_league as pl WHERE pl.idPlayer IN ?";
    const listIds = req.body.playerIds.length > 0 ? req.body.playerIds : [0];
    values.push([listIds]);
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  if( req.body.leagueIds !== undefined ){
    query = "SELECT pl.* FROM player_league as pl WHERE pl.idLeague IN ?";
    const listIds = req.body.leagueIds.length > 0 ? req.body.leagueIds : [0];
    values.push([listIds]);
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  
  const resultMainQuery = await mysqlQuery(query, values);
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};
