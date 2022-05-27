const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllPlayers = (req, res, next) => {
  conn.query("SELECT * FROM players", function (err, data, fields) {
    if(err) return next(new AppError(err))
    res.status(200).json({
      status: "success",
      length: data?.length,
      data: data,
    });
  });
 };

 exports.createPlayer = (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  const values = [req.body.name];
  conn.query(
    "INSERT INTO players (name) VALUES(?)",
    [values],
    function (err, data, fields) {
      if (err) return next(new AppError(err, 500));
      res.status(201).json({
        status: "success",
        message: "player created!",
      });
    }
  );
 };

 exports.getPlayer = (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  conn.query(
    "SELECT * FROM players WHERE id = ?",
    [req.params.id],
    function (err, data, fields) {
      if (err) return next(new AppError(err, 500));
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    }
  );
 };

 exports.updatePlayer = (req, res, next) => {
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
};

exports.deletePlayer = (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No player id found", 404));
  }
  conn.execute(
    "DELETE from players WHERE id=?",
    [req.params.id],
    function (err, data, fields) {
      if (err) return next(new AppError(err, 500));
      res.status(201).json({
        status: "success",
        message: "player deleted!",
      });
    }
  );
 };