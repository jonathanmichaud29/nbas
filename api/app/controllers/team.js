const AppError = require("../utils/appError");
const { mysqlQuery } = require("../services/db");
const transformMysqlErrorCode = require("../utils/dbErrorTranslator");
const { getPlayerData, getTeamData } = require("../utils/simpleQueries");

exports.getAllTeams = async (req, res, next) => {

  /**
   * Prepare and execute query
   */
  const query = "SELECT * FROM teams";
  const values = []
  const resultMainQuery = await mysqlQuery(query, values)
  
  /**
   * Return data
   */
  if( resultMainQuery.status ) {
    res.status(200).json({
      status: "success",
      length: resultMainQuery.data?.length,
      data: resultMainQuery.data,
    });
  }
  else {
    const err_message = transformMysqlErrorCode(resultMainQuery.error, "team");
    return next(new AppError(err_message, 500));
  }
}; 

exports.createTeam = async (req, res, next) => {
  /**
   * Validate Required Parameters
   */
  if (!req.body) return next(new AppError("No form data found", 404));

  /**
   * Prepare and execute query
   */
  const values = [req.body.name];
  const resultMainQuery = await mysqlQuery("INSERT INTO teams (name) VALUES(?)", values)

  /**
   * Return data
   */
  if( resultMainQuery.status ) {
    res.status(200).json({
      status: "success",
      length: resultMainQuery.data?.length,
      data:{
        id: resultMainQuery.data.insertId,
        name: req.body.name
      }
    });
  }
  else {
    const err_message = transformMysqlErrorCode(resultMainQuery.error, "team");
    return next(new AppError(err_message, 500));
  }
};

exports.getTeam = async (req, res, next) => {
  /**
   * Validate Required Parameters
   */
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }

  /**
   * Prepare and execute query
   */
  const query = "SELECT * FROM teams WHERE id = ?";
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery(query, values)

  /**
   * Return data
   */
  if( resultMainQuery.status ) {
    res.status(200).json({
      status: "success",
      length: resultMainQuery.data?.length,
      data: resultMainQuery.data,
    });
  }
  else {
    const err_message = transformMysqlErrorCode(resultMainQuery.error, "team");
    return next(new AppError(err_message, 500));
  }
};

/* exports.updateTeam = async (req, res, next) => {
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
}; */

exports.deleteTeam = async (req, res, next) => {
  /**
   * Validate Required Parameters
   */
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  
  /**
   * Prepare and execute query
   */
  const query = "DELETE from teams WHERE id=?";
  const values = [req.params.id]
  const resultMainQuery = await mysqlQuery(query, values);

  /**
   * Return data
   */
  if( resultMainQuery.status ) {
    res.status(200).json({
      status: "success",
      length: resultMainQuery.data?.length,
      data: resultMainQuery.data,
    });
  }
  else {
    const err_message = transformMysqlErrorCode(resultMainQuery.error, "team");
    return next(new AppError(err_message, 500));
  }
};

exports.getTeamPlayers = async (req, res, next) => {
  /**
   * Validate Required Parameters
   */
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }

  /**
   * Prepare and execute query
   */
  const query = "SELECT t.id as team_id, t.name as team_name, p.id as player_id, p.name as player_name "+
    "FROM team_player as tp " +
    "INNER JOIN teams as t ON (tp.id_team=t.id) " +
    "LEFT JOIN players AS p ON (tp.id_player=p.id) " +
    "WHERE tp.id_team = ?";
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery(query, values)

  /**
   * Return data
   */
  if( resultMainQuery.status ) {
    res.status(200).json({
      status: "success",
      length: resultMainQuery.data?.length,
      data: resultMainQuery.data,
    });
  }
  else {
    const err_message = transformMysqlErrorCode(resultMainQuery.error, "team");
    return next(new AppError(err_message, 500));
  }
};

exports.getUnassignedPlayers = async (req, res, next) => {

  /**
   * Prepare and execute query
   */
  const query = "SELECT p.* "+
    "FROM players as p  " +
    "LEFT JOIN team_player as tp ON (tp.id_player=p.id) " +
    "WHERE tp.id_team IS NULL";
  const values = []
  const resultMainQuery = await mysqlQuery(query, values)

  /**
   * Return data
   */
  if( resultMainQuery.status ) {
    res.status(200).json({
      status: "success",
      length: resultMainQuery.data?.length,
      data: resultMainQuery.data,
    });
  }
  else {
    const err_message = transformMysqlErrorCode(resultMainQuery.error, "team");
    return next(new AppError(err_message, 500));
  }
};


exports.createTeamPlayer = async (req, res, next) => {
  /**
   * Validate Required Parameters
   */
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  if (!req.body.id_player) {
    return next(new AppError("No player selected", 404));
  }

  /**
   * Prepare and execute query
   */
  const values = [
    [[req.params.id, req.body.id_player]]
  ];
  const resultMainQuery = await mysqlQuery("INSERT INTO team_player (id_team, id_player) VALUES ?", values)
  
  /**
   * Return data
   */
  if( resultMainQuery.status ) {
    let message = 'team player added!';
    const resultPlayerData = await getPlayerData(req.body.id_player);
    const resultTeamData = await getTeamData(req.params.id);
    
    if( resultPlayerData.status && resultTeamData.status ){
      message = `Player '${resultPlayerData.data.name}' added to team '${resultTeamData.data.name}'!`
    }
    else {
      console.error("Secondary queries errors", resultPlayerData, resultTeamData);
    }
    res.status(201).json({
      status: "success",
      message: message,
      data: {
        id_team: req.params.id,
        id_player: req.body.id_player
      }
    });
  }
  else {
    const err_message = transformMysqlErrorCode(resultMainQuery.error, "team");
    return next(new AppError(err_message, 500));
  }
  
};
