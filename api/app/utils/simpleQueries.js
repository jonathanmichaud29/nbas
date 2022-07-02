const { mysqlQuery } = require("../services/db");

exports.getPlayerData = async (id) => {
  const result = await mysqlQuery("SELECT * FROM players WHERE id = ?", [id]);
  return {
    status:result.status,
    data: result.data[0],
    error: result.error
  }
}

exports.getPlayersData = async (listIds) => {
  const result = await mysqlQuery("SELECT * FROM players WHERE id IN ?", [[listIds]]);
  return {
    status:result.status,
    data: result.data,
    error: result.error
  }
}

exports.getTeamData = async (id) => {
  const result = await mysqlQuery("SELECT * FROM teams WHERE id = ?", [id]);
  return {
    status:result.status,
    data: result.data[0],
    error: result.error
  }
}

exports.getTeamsData = async (listIds) => {
  const result = await mysqlQuery("SELECT * FROM teams WHERE id IN ?", [[listIds]]);
  return {
    status:result.status,
    data: result.data,
    error: result.error
  }
}

exports.getMatchData = async (id) => {
  const result = await mysqlQuery("SELECT * FROM matches WHERE id = ?", [id]);
  return {
    status:result.status,
    data: result.data[0],
    error: result.error
  }
}

exports.getMatchesData = async (listIds) => {
  const result = await mysqlQuery("SELECT * FROM matches WHERE id IN ?", [[listIds]]);
  return {
    status:result.status,
    data: result.data,
    error: result.error
  }
}