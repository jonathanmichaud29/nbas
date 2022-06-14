const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");

exports.getAllPlayers = async (req, res, next) => {
  const resultMainQuery = await mysqlQuery("SELECT * FROM players", [])
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.getSpecificPlayers = async (req, res, next) => {
  if (!req.body || !req.body.listIds ) return next(new AppError("No form data found", 404));
  if( (req.body.listIds).length < 1 ){
    return appResponse(res, next, true, {}, {});
  }
  const resultMainQuery = await mysqlQuery("SELECT * FROM players WHERE id IN ?", [[req.body.listIds]])
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.createPlayer = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  const values = [req.body.name];
  const resultMainQuery = await mysqlQuery("INSERT INTO players (name) VALUES(?)", values)

  let customMessage = ''
  let customData = {}
  if( resultMainQuery.status ) {
    customData = {
      id: resultMainQuery.data.insertId,
      name: req.body.name
    }
    customMessage = `player '${req.body.name}' created!`
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};

exports.getPlayer = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  const values = [req.params.id]
  const resultMainQuery = await mysqlQuery("SELECT * FROM players WHERE id=?", values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

 /* exports.updatePlayer = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  conn.execute(
    "UPDATE players SET name=? WHERE id=?",
    [req.params.name, req.params.id],
    function (err, data, fields) {
      if (err) return next(new AppError(err, 500));
      res.status(201).json({
        status: "success",
        message: "team updated!",
      });
    }
  );
}; */

exports.deletePlayer = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery("DELETE FROM players WHERE id=?", values);
  let customData = {}
  let customMessage = '';
  if( resultMainQuery.status ){
    customData = {
      id: req.params.id
    };
    customMessage = `player deleted!`;
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};