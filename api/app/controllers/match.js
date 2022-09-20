const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");
const { getTeamsData, getMatchesData, getPlayersData } = require("../utils/simpleQueries");
const { dateFormatShort, dateFormatToDatabase } = require("../utils/dateFormatter")
const { is_missing_keys, castNumber } = require("../utils/validation")


exports.getMatches = async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("No parameters received to fetch a match", 404));
  }
  const selectedLeagueId = castNumber(req.headers.idleague);
  let values = [];
  let wheres = [];
  let orderBy = [];
  
  wheres.push('`idLeague` IN ?');
  if( req.body.leagueIds !== undefined ){
    values.push([req.body.leagueIds.length > 0 ? req.body.leagueIds : [0] ])
  } else {
    values.push([[selectedLeagueId]])
  }
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

exports.createMatch = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  const selectedLeagueId = castNumber(req.headers.idleague);

  const dateObject = new Date(req.body.date);
  const finalDate = dateFormatToDatabase(dateObject);
  const values = [
    [[selectedLeagueId, req.body.teamHomeId, req.body.teamAwayId, finalDate ]]
  ];
  const resultMainQuery = await mysqlQuery("INSERT INTO matches (idLeague, idTeamHome, idTeamAway, date) VALUES ?", values)

  let customMessage = ''
  let customData = {}
  if( resultMainQuery.status ) {
    customMessage = `match created!`
    const resultLineupQuery = await mysqlQuery("SELECT * FROM matches WHERE id=?", [resultMainQuery.data.insertId]);
    customData = resultLineupQuery.data[0];
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};


exports.deleteMatch = async (req, res, next) => {
  if (!req.params.matchId) {
    return next(new AppError("No match id found", 404));
  }
  const values = [req.params.matchId];
  const resultMainQuery = await mysqlQuery("DELETE FROM matches WHERE id=?", values);
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      id: req.params.matchId
    };
    customMessage = `match deleted!`;
  }
  return appResponse(res, next, resultMainQuery.status, {}, resultMainQuery.error, customMessage);
};
