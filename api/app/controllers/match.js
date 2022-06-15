const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery, mysqlQueryPoolInserts } = require("../services/db");
const { is_missing_keys } = require("../utils/validation");

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
    customData = {
      id: resultMainQuery.data.insertId,
      name: req.body.name
    }
    customMessage = `match created!`
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
  if (!req.params.id) {
    return next(new AppError("No match id found", 404));
  }
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery("SELECT * FROM match_lineup WHERE idMatch=?", values);
  if( resultMainQuery.status ){
    customMessage = `match deleted!`;
  }
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
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