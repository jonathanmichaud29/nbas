const AppError = require("../utils/appError");
const appResponse = require("../utils/appResponse");
const appResponseActions = require("../utils/appResponseActions");

const { mysqlQuery, mysqlGetConnPool } = require("../services/db");
const { is_missing_keys, castNumber } = require("../utils/validation")

exports.getLeagues = async (req, res, next) => {
  if (!req.body ) return next(new AppError("No form data found", 404));
  /* const selectedLeagueId = castNumber(req.headers.idleague); */

  let query = '';
  let values = [];
  if( req.body.leagueIds !== undefined ){
    query = "SELECT l.* FROM leagues as l WHERE l.id IN ?";
    const listLeagueIds = req.body.leagueIds.length > 0 ? req.body.leagueIds : [0];
    values = [selectedLeagueId, [listLeagueIds]];
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else if(req.body.allLeagues !== undefined && req.body.allLeagues ) {
    query = "SELECT l.* FROM leagues as l";
    const resultMainQuery = await mysqlQuery(query, values);
    return appResponse(res, next, resultMainQuery.status, resultMainQuery.data, resultMainQuery.error);
  }
  else {
    return appResponse(res, next, true, {}, {});
  }
  
};

