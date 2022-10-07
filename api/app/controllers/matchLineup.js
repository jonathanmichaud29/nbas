const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery, mysqlQueryPoolInserts, mysqlQueryPoolMixUpdates } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")

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
    if (req.body.teamIds !== undefined) {
      wheres.push('`idTeam` IN ?')
      values.push([req.body.teamIds.length > 0 ? req.body.teamIds : [0] ]);
    }
    if (req.body.playerIds !== undefined) {
      wheres.push('`idPlayer` IN ?')
      values.push([req.body.playerIds.length>0 ? req.body.playerIds : [0] ]);
    }
  }
  if (req.body.leagueIds !== undefined) {
    wheres.push('`idLeague` IN ?')
    values.push([req.body.leagueIds.length>0 ? req.body.leagueIds : [0] ]);
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

exports.createMatchLineups = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No match id found", 404));
  }
  const bodyRequiredKeys = ["matchId", "teamId", "playerIds"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);

  let values = []
  const listIds = req.body.playerIds;
  listIds.forEach((playerId) => {
    values.push([[req.body.matchId, req.body.teamId, playerId, selectedLeagueId]])
  });
  const query = "INSERT INTO match_lineup (idMatch, idTeam, idPlayer, idLeague) VALUES (?)"
  const resultMainQuery = await mysqlQueryPoolInserts(query, values);
  
  let customMessage = '';
  let customData = {}
  if( resultMainQuery.status ){
    customMessage = `added ${resultMainQuery.data.length} player(s) to match lineup!`;
    const resultLineupQuery = await mysqlQuery("SELECT id, idMatch, idTeam, idPlayer, idLeague FROM match_lineup WHERE id IN (?)", [resultMainQuery.data]);
    customData = resultLineupQuery.data;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};

exports.deleteMatchLineup = async (req, res, next) => {
  if (!req.params.matchLineupId) {
    return next(new AppError("No match lineup found", 404));
  }
  const values = [req.params.matchLineupId];
  const resultMainQuery = await mysqlQuery("DELETE FROM match_lineup WHERE id=?", values);
  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `Match Lineup removed!`;
  }
  return appResponse(res, next, resultMainQuery.status, {}, resultMainQuery.error, customMessage);
};

exports.updateMatchLineups = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No params found", 404));
  }
  const bodyRequiredKeys = ["match", "playersLineupsStats"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  const myMatch = req.body.match;
  const myLineups = req.body.playersLineupsStats;

  /**
   * TODO: Those default values should be NULL once we enforced foreign keys between match_lineups and teams
   */
  let idTeamWon = 0;
  let idTeamLost = 0;
  if( myMatch.teamAwayPoints > myMatch.teamHomePoints ){
    idTeamWon = myMatch.idTeamAway;
    idTeamLost = myMatch.idTeamHome;
  }
  else if( myMatch.teamAwayPoints < myMatch.teamHomePoints ) {
    idTeamWon = myMatch.idTeamHome;
    idTeamLost = myMatch.idTeamAway;
  }

  let queries = new Array();

  queries.push({
    query: "UPDATE matches SET isCompleted=?, teamHomePoints=?, teamAwayPoints=?, idTeamWon=?, idTeamLost=? WHERE id=?",
    values: [myMatch.isCompleted, myMatch.teamHomePoints, myMatch.teamAwayPoints, idTeamWon, idTeamLost, myMatch.id]
  })
  const queryLineup = "UPDATE match_lineup SET `hitOrder`=?, `atBats`=?, `single`=?, `double`=?, `triple`=?, `homerun`=?, `out`=?, "+
    "`hitByPitch`=?, `walk`=?, `strikeOut`=?, `stolenBase`=?, `caughtStealing`=?, `plateAppearance`=?, "+
    "`sacrificeBunt`=?, `sacrificeFly`=?, `runsBattedIn`=?, `hit`=? "+
    "WHERE `id`=?"
  myLineups.every((lineup) => {
    queries.push({
      query: queryLineup,
      values: [
        lineup.hitOrder, lineup.atBats, lineup.single, lineup.double, lineup.triple, lineup.homerun, lineup.out, 
        lineup.hitByPitch, lineup.walk, lineup.strikeOut, lineup.stolenBase, lineup.caughtStealing, lineup.plateAppearance, 
        lineup.sacrificeBunt, lineup.sacrificeFly, lineup.runsBattedIn, lineup.hit, 
        lineup.lineupId]
    })
    return true;
  })
  
  const resultMainQuery = await mysqlQueryPoolMixUpdates(queries);
  
  let customMessage = '';
  let customData = {}
  if( resultMainQuery.status ){
    customMessage = `match #${req.body.match.id} updated!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};