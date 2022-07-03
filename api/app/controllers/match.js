const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery, mysqlQueryPoolInserts, mysqlQueryPoolMixUpdates } = require("../services/db");
const { getTeamsData, getMatchesData, getPlayersData } = require("../utils/simpleQueries");
const { dateFormatShort } = require("../utils/dateFormatter")
const { is_missing_keys } = require("../utils/validation");


exports.getMatches = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No parameters received to fetch a match", 404));
  }
  let values = [];
  let wheres = [];
  let orderBy = [];
  
  if (req.body.matchIds ){
    wheres.push('`id` IN ?')
    values.push([req.body.matchIds]);
  }

  if( req.body.valueCompleted !== undefined ) {
    values.push(req.body.valueCompleted);
    wheres.push('`isCompleted`=?')
  }

  if (req.body.isPast === true ){
    const dateCompare = dateFormatShort(Date.now());
    wheres.push('`date`<?');
    values.push(dateCompare);
    orderBy.push('`date` DESC');
  }
  else if (req.body.isUpcoming === true ){
    const dateCompare = dateFormatShort(Date.now());
    wheres.push('`date`>=?');
    values.push(dateCompare);
    orderBy.push('`date` ASC');
  }

  const query = "SELECT * FROM matches " +
    ( wheres.length > 0     ? "WHERE " + wheres.join(" AND ") + " "   : '' ) + 
    ( orderBy.length > 0    ? "ORDER BY " + orderBy.join(", ") + " "  : '' ) +
    ( req.body.quantity !== undefined ? `LIMIT ${req.body.quantity}`  : '' );
  const resultMainQuery = await mysqlQuery(query, values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);

  /* const resultMainQuery = await mysqlQuery("SELECT * FROM matches", [])

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error); */
};

exports.getHistoryMatches = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  let listMatchIds = [];
  let listTeamIds = [];
  let listPlayerIds = [];
  let customData = {
    matchLineups:[],
    matches:[],
    teams:[],
    players:[],
  }


  let query="SELECT * FROM match_lineup WHERE ";
  let values=[];
  if( req.body.teamId !== undefined ){
    query += "`idTeam`=?";
    values.push(req.body.teamId)
  }
  else if( req.body.playerId !== undefined ){
    query += "`idPlayer`=?";
    values.push(req.body.playerId)
  }
  else {
    return appResponse(res, next, true, {}, {});
  }

  const resultMainQuery = await mysqlQuery(query, values);
  if( resultMainQuery.status ){
    customData.matchLineups = resultMainQuery.data;
    listMatchIds = resultMainQuery.data.map((row) => row.idMatch);
    listPlayerIds = resultMainQuery.data.map((row) => row.idPlayer);
  }

  if( listMatchIds.length > 0 ){
    const resultMatch = await getMatchesData(listMatchIds);
    if( resultMatch.status ){
      customData.matches = resultMatch.data;
      resultMatch.data.forEach((row) => {
        listTeamIds.push(row.idTeamHome);
        listTeamIds.push(row.idTeamAway);
      });
    }
  }

  if( listTeamIds.length > 0 ){
    const resultTeam = await getTeamsData([...new Set(listTeamIds)]);
    if( resultTeam.status ){
      customData.teams = resultTeam.data;
    }
  }

  if( listPlayerIds.length > 0 ){
    const resultPlayer = await getPlayersData([...new Set(listPlayerIds)]);
    if( resultPlayer.status ){
      customData.players = resultPlayer.data;
    }
  }

  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error);
}


/**
 * uncleaned entry points
 */
exports.getAllMatches = async (req, res, next) => {
  const resultMainQuery = await mysqlQuery("SELECT * FROM matches", [])
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.createMatch = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  const dateObject = new Date(req.body.date);
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hourCycle:'h24', 
    hour: '2-digit', 
    minute: '2-digit', 
  };
  const finalDate = dateObject.toLocaleDateString("en-CA", options);
  const values = [
    [[req.body.idTeamHome, req.body.idTeamAway, finalDate ]]
  ];
  const resultMainQuery = await mysqlQuery("INSERT INTO matches (idTeamHome, idTeamAway, date) VALUES ?", values)

  let customMessage = ''
  let customData = {}
  if( resultMainQuery.status ) {
    customMessage = `match created!`
    const resultLineupQuery = await mysqlQuery("SELECT * FROM matches WHERE id=?", [resultMainQuery.data.insertId]);
    customData = resultLineupQuery.data[0];
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};

exports.getMatch = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No match id found", 404));
  }
  const values = [req.params.id]
  const resultMainQuery = await mysqlQuery("SELECT * FROM matches WHERE id=?", values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.getSingleMatch = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No parameters received to fetch a match", 404));
  }
  let values = [];
  let wheres = [];
  let orderBy = [];
  
  if (req.body.isLast ){
    orderBy.push("ORDER BY date DESC");
  }
  else{
    orderBy.push("ORDER BY date ASC");
  }
  if (req.body.idMatch ){
    values.push(req.body.idMatch);
    wheres.push('`id`=?')
  }
  if( req.body.valueCompleted !== undefined ) {
    values.push(req.body.valueCompleted);
    wheres.push('`isCompleted`=?')
  }

  const query = "SELECT * FROM matches "+
  "WHERE " + wheres.join(" AND ") + " " + 
  orderBy.join(", ") + " " +
  "LIMIT 1";
  const resultMainQuery = await mysqlQuery(query, values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};


exports.deleteMatch = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No match id found", 404));
  }
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery("DELETE FROM matches WHERE id=?", values);
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      id: req.params.id
    };
    customMessage = `match deleted!`;
  }
  return appResponse(res, next, resultMainQuery.status, {}, resultMainQuery.error, customMessage);
};

exports.getMatchLineups = async (req, res, next) => {
  if (!req.params.idMatch) {
    return next(new AppError("No match id found", 404));
  }
  let values = [[req.params.idMatch]]
  let wheres = ['`idMatch`=?']
  if (req.params.idTeam !== undefined) {
    wheres.push('`idTeam`=?')
    values.push([req.params.idTeam]);
  }
  const resultMainQuery = await mysqlQuery("SELECT * FROM match_lineup WHERE "+wheres.join(" AND "), values);
  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `match lineups retrieved!`;
  }
  else {
    console.log(resultMainQuery.error)
  }
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error, customMessage);
};

exports.getMatchesLineups = async (req, res, next) => {
  const resultMainQuery = await mysqlQuery("SELECT * FROM match_lineup", []);
  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `all matches lineups retrieved`;
  }
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error, customMessage);
};

exports.getPlayersMatchLineups = async (req, res, next) => {
  if (!req.body.listPlayerIds) {
    return next(new AppError("No player ids found", 404));
  }
  let values = [req.body.listPlayerIds]
  
  const query = "SELECT ml.* FROM match_lineup as ml " +
    "INNER JOIN matches as m ON (ml.idMatch=m.id AND m.isCompleted=1) " +
    "WHERE ml.idPlayer IN (?)";
  const resultMainQuery = await mysqlQuery(query, values);
  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `players match lineups retrieved!`;
  }
  else {
    console.log(resultMainQuery.error)
  }
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error, customMessage);
};

exports.createPlayerLineup = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No match id found", 404));
  }

  const bodyRequiredKeys = ["idPlayers", "idTeam"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  let values = []
  const listIds = req.body.idPlayers;
  listIds.forEach((id) => {
    values.push([[req.params.id, req.body.idTeam, id]])
  });
  const query = "INSERT INTO match_lineup (idMatch, idTeam, idPlayer) VALUES (?)"
  const resultMainQuery = await mysqlQueryPoolInserts(query, values);
  
  let customMessage = '';
  let customData = {}
  if( resultMainQuery.status ){
    customMessage = `added ${resultMainQuery.data.length} player(s) to match lineup!`;
    const resultLineupQuery = await mysqlQuery("SELECT id, idMatch, idTeam, idPlayer FROM match_lineup WHERE id IN (?)", [resultMainQuery.data]);
    customData = resultLineupQuery.data;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};

exports.deletePlayerLineup = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No lineup id found", 404));
  }
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery("DELETE FROM match_lineup WHERE id=?", values);
  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `lineup removed from match!`;
  }
  return appResponse(res, next, resultMainQuery.status, {}, resultMainQuery.error, customMessage);
};

exports.updateMatchLineups = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No match id found", 404));
  }
  const bodyRequiredKeys = ["match", "lineups"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  const myMatch = req.body.match;
  const myLineups = req.body.lineups;

  const idTeamWon = myMatch.teamAwayPoints > myMatch.teamHomePoints ? myMatch.idTeamAway : myMatch.idTeamHome;
  const idTeamLost = idTeamWon !== myMatch.idTeamAway ? myMatch.idTeamAway : myMatch.idTeamHome;

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