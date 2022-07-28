const { mysqlQuery } = require("../services/db");

exports.getPlayerData = async (id) => {
  const result = await mysqlQuery("SELECT * FROM players WHERE id = ?", [id]);
  return {
    status:result.status,
    data: result.data[0],
    error: result.error
  }
}

exports.getSystemPlayersByName = async (name) => {
  const query = "SELECT `p`.id as playerId, p.name as playerName, `l`.id as leagueId, l.name as leagueName " +
    "FROM players as `p` " +
    "LEFT JOIN player_league AS `pl` ON (`p`.`id`=pl.idPlayer) " +
    "LEFT JOIN leagues AS `l` ON (pl.idLeague=l.id)" +
    "WHERE `p`.`name` = ? ";
  
  const result = await mysqlQuery(query, [name]);
  return {
    status:result.status,
    data: result.data,
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

exports.getLeagueTeamByName = async (name, idLeague) => {
  const query = "SELECT `t`.id as teamId, t.name as teamName, `l`.id as leagueId, l.name as leagueName " +
    "FROM teams as `t` " +
    "INNER JOIN team_league AS `tl` ON (`t`.`id`=tl.idTeam AND tl.idLeague=?) " +
    "INNER JOIN leagues AS `l` ON (tl.idLeague=l.id)" +
    "WHERE `t`.`name` = ? ";
  
  const result = await mysqlQuery(query, [idLeague, name]);
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