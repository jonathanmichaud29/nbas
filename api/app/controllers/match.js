const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");

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
    timeZone: 'America/Toronto' 
  };
  const finalDate = dateObject.toLocaleDateString("en-CA", options);
  const values = [
    [[req.body.id_team_home, req.body.id_team_away, finalDate ]]
  ];
  const resultMainQuery = await mysqlQuery("INSERT INTO matches (id_team_home, id_team_away, date) VALUES ?", values)

  let customMessage = ''
  let customData = {}
  if( resultMainQuery.status ) {
    customData = {
      id: resultMainQuery.data.insertId,
      name: req.body.name
    }
    customMessage = `match '${req.body.name}' created!`
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
