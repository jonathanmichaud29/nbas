const { mysqlQuery } = require("../services/db");

exports.getPlayerData = async (id) => {
  const result = await mysqlQuery("SELECT * FROM players WHERE id = ?", [id]);
  return {
    status:result.status,
    data: result.data[0],
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
