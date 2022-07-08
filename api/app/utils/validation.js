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

exports.validateUserLeague = (req) => {
  if( req.userAccessLeagues === undefined || req.userAccessLeagues.length < 1 || req.headers.idleague === undefined){
    return false;
  }
  const idLeagueRequest = this.castNumber(req.headers.idleague)
  if( req.userAccessLeagues.find((leagueId) => idLeagueRequest === leagueId) === undefined ) {
    return false;
  }
  return true;
}