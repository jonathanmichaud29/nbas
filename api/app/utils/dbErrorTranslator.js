const transformMysqlErrorCode = (error, context) => {
  let error_return = `Unknown error occured when adding a new ${context}`;
  if( process.env.NODE_ENV === 'development' ) {
    error_return = error.sqlMessage;
  }
  else {
    switch(error.code){
      case "ER_DUP_ENTRY":
        error_return = `The ${context} already exists`;
        break;
      case "ER_BAD_FIELD_ERROR":
        error_return = `An unexpected error caused by a wrong field.`
        break;
      case "ER_BAD_NULL_ERROR":
        error_return = `A NULL value is supplied and it is forbidden.`
        break;
      case "ER_WRONG_VALUE_COUNT_ON_ROW":
        error_return = "Column count doesn't match value count at row 1";
        break;
      default:
        break;
    }
  }
  
  return error_return;
}


module.exports = transformMysqlErrorCode