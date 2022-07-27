const AppError = require("../utils/appError");

exports.is_missing_keys = (required_keys, compare_object) => {
  let is_missing = false;
  required_keys.forEach((key) => {
    if( ! (key in compare_object) ){
      is_missing = true;
    }
  })
  return is_missing;
}

exports.castNumber = (value) => {
  if( typeof(value) === 'number' ) {
    return value;
  }
  return parseInt(value, 10) || 0;
}

exports.validateUserLeague = (req, res, next) => {
  if( req.userAccessLeagues === undefined || req.userAccessLeagues.length < 1 || req.headers.idleague === undefined){
    return next(new AppError("Missing information to validate user access to league"));
  }
  const idLeagueRequest = this.castNumber(req.headers.idleague)
  if( req.userAccessLeagues.find((league) => idLeagueRequest === league.id) === undefined ) {
    return next(new AppError("User does not have access to this league"))
  }
  return next();
}