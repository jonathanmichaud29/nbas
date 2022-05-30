const AppError = require("../utils/appError");
const conn = require("../services/db");

transformMysqlErrorCode = (err_code) => {
  let error_return = 'Unknown error occured when adding a new team';
  switch(err_code){
    case "ER_DUP_ENTRY":
      error_return = "The team already exists";
      break;
    default:
      break;
  }
  return error_return;
}

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
        const err_message = transformMysqlErrorCode(err.code);
        return next(new AppError(err_message, 500));
      }
      res.status(201).json({
        status: "success",
        message: "team created!",
        data:{
          id: data.insertId
        }
      });
    }
  );
  
 };

 exports.getTeam = (req, res, next) => {
  console.info(req.params)
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
      });
    }
  );
 };