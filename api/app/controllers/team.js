const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const { mysqlQuery } = require("../services/db");
const { getPlayerData, getTeamData } = require("../utils/simpleQueries");

exports.getAllTeams = async (req, res, next) => {

  const resultMainQuery = await mysqlQuery("SELECT * FROM teams", [])
  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);

}; 

exports.createTeam = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));

  const values = [req.body.name];
  const resultMainQuery = await mysqlQuery("INSERT INTO teams (name) VALUES(?)", values)

  let customData = {}
  let customMessage = ''
  if( resultMainQuery.status ) {
    customMessage = `The team '${req.body.name}' is created`;
    customData = {
      id: resultMainQuery.data.insertId,
      name: req.body.name
    }
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
};

exports.getTeam = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }

  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery("SELECT * FROM teams WHERE id = ?", values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
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
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }

  const values = [req.params.id]
  const resultMainQuery = await mysqlQuery("DELETE from teams WHERE id=?", values);

  let customMessage = '';
  if( resultMainQuery.status ){
    customMessage = `The team is deleted`;
  }
  return appResponse(res, next, resultMainQuery.status, [], resultMainQuery.error, customMessage);
};

exports.getTeamPlayers = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }

  const query = "SELECT t.id as teamId, t.name as teamName, p.id as playerId, p.name as playerName "+
    "FROM team_player as tp " +
    "INNER JOIN teams as t ON (tp.id_team=t.id) " +
    "LEFT JOIN players AS p ON (tp.id_player=p.id) " +
    "WHERE tp.id_team = ?";
  const values = [req.params.id];
  const resultMainQuery = await mysqlQuery(query, values)

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};

exports.getUnassignedPlayers = async (req, res, next) => {

  const query = "SELECT p.* "+
    "FROM players as p  " +
    "LEFT JOIN team_player as tp ON (tp.id_player=p.id) " +
    "WHERE tp.id_team IS NULL";
  const resultMainQuery = await mysqlQuery(query, [])

  return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
};


exports.createTeamPlayer = async (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("No team id found", 404));
  }
  if (!req.body.id_player) {
    return next(new AppError("No player selected", 404));
  }

  const values = [
    [[req.params.id, req.body.id_player]]
  ];
  const resultMainQuery = await mysqlQuery("INSERT INTO team_player (id_team, id_player) VALUES ?", values)
  

  const customData={
    id_team: req.params.id,
    id_player: req.body.id_player
  }
  let customMessage=''
  if( resultMainQuery.status ) {
    customMessage = 'team player added!';
    const resultPlayerData = await getPlayerData(req.body.id_player);
    const resultTeamData = await getTeamData(req.params.id);
    
    if( resultPlayerData.status && resultTeamData.status ){
      customMessage = `Player '${resultPlayerData.data.name}' added to team '${resultTeamData.data.name}'!`
    }
    else {
      console.error("Secondary queries errors", resultPlayerData, resultTeamData);
    }
  }
  return appResponse(res, next, resultMainQuery.status, customData, resultMainQuery.error, customMessage);
  
};

const is_missing_keys = (required_keys, compare_object) => {
  let is_missing = false;
  required_keys.forEach((key) => {
    if( ! (key in compare_object) ){
      is_missing = true;
    }
  })
  return is_missing;
}
exports.deleteTeamPlayer = async (req, res, next) => {
  if (!req.body) return next(new AppError("No form data found", 404));
  
  const bodyRequiredKeys = ["team_id", "team_name", "player_id", "player_name"]
  if( is_missing_keys(bodyRequiredKeys, req.body) ) {
    return next(new AppError(`Missing body parameters`, 404));
  }
  
  const values = [req.body.team_id, req.body.player_id]
  const resultMainQuery = await mysqlQuery("DELETE from team_player WHERE id_team=? AND id_player=?", values);

  let customMessage = '';
  if( resultMainQuery.status ) {
    customMessage = `'${req.body.player_name}' has been removed from team '${req.body.team_name}'`;
  }
  return appResponse(res, next, resultMainQuery.status, [], resultMainQuery.error, customMessage);
};
