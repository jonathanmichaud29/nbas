const transformMysqlErrorCode = (err_code, context) => {
  let error_return = `Unknown error occured when adding a new ${context}`;
  switch(err_code){
    case "ER_DUP_ENTRY":
      error_return = `The ${context} already exists`;
      break;
    case "ER_BAD_FIELD_ERROR":
      error_return = `An unexpected error caused by a wrong field.`
      break;
    default:
      break;
  }
  return error_return;
}

module.exports = transformMysqlErrorCode