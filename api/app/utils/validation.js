exports.is_missing_keys = (required_keys, compare_object) => {
  let is_missing = false;
  required_keys.forEach((key) => {
    if( ! (key in compare_object) ){
      is_missing = true;
    }
  })
  return is_missing;
}