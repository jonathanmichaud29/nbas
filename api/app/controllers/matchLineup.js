const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery, mysqlQueryPoolInserts, mysqlQueryPoolMixUpdates } = require("../services/db");
const { getTeamsData, getMatchesData, getPlayersData } = require("../utils/simpleQueries");
const { dateFormatShort, dateFormatToDatabase } = require("../utils/dateFormatter")
const { is_missing_keys } = require("../utils/validation");

exports.getMatchLineups = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No params found", 404));
  }

  let values = []
  let wheres = []

  if( req.body.allLineups ) {
    // Perhaps change this condition
  }
  else{
    if (req.body.matchId !== undefined) {
      wheres.push('`idMatch`=?')
      values.push([req.body.matchId]);
    }
    if (req.body.teamId !== undefined) {
      wheres.push('`idTeam`=?')
      values.push([req.body.teamId]);
    }
    if (req.body.playerIds !== undefined) {
      wheres.push('`idPlayer` IN ?')
      values.push([req.body.playerIds]);
    }
  }

  const query = "SELECT * FROM match_lineup " +
    ( wheres.length > 0 ? "WHERE "+wheres.join(" AND ") + " " : '' );

  const resultMainQuery = await mysqlQuery(query, values);
  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `match lineups retrieved!`;
  }

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error, customMessage);
};