const AppError = require("../utils/appError");
const conn = require("../services/db");
const transformMysqlErrorCode = require("../utils/dbErrorTranslator");

exports.getAllTeams = (req, res, next) => {
  conn.query("SELECT * FROM teams", function (err, data, fields) {
    if(err) return next(new AppError(err))
    res.status(200).json({
      status: "success",
      length: data?.length,
      data: data,
    });
  });
 };

 exports.createTeam = (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  const values = [req.body.name];
  const result = conn.query(
    "INSERT INTO teams (name) VALUES(?)",
    [values],
    function (err, data, fields) {
      if (err) {
        const err_message = transformMysqlErrorCode(err.code, "team");
        return next(new AppError(err_message, 500));
      }
      res.status(201).json({
        status: "success",
        message: `team '${req.body.name}' created!`,
        data:{
          id: data.insertId,
          name: req.body.name
        }
      });
    }
  );
  
 };

 exports.getTeam = (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  conn.query(
    "SELECT * FROM teams WHERE id = ?",
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

 exports.updateTeam = (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  conn.execute(
    "UPDATE teams SET name=? WHERE id=?",
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

exports.deleteTeam = (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  conn.execute(
    "DELETE from teams WHERE id=?",
    [req.params.id],
    function (err, data, fields) {
      if (err) return next(new AppError(err, 500));
      res.status(201).json({
        status: "success",
        message: "team deleted!",
        data:{
          id: req.params.id
        }
      });
    }
  );
 };


 exports.getTeamPlayers = (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  conn.query(
    "SELECT t.id as team_id, t.name as team_name, p.id as player_id, p.name as player_name "+
    "FROM team_player as tp " +
    "INNER JOIN teams as t ON (tp.id_team=t.id) " +
    "LEFT JOIN players AS p ON (tp.id_player=p.id) " +
    "WHERE tp.id_team = ?",
    [req.params.id],
    function (err, data, fields) {
      if (err) {
        const err_message = transformMysqlErrorCode(err.code, "team");
        return next(new AppError(err_message, 500));
      }
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    }
  );
 };