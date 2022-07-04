const { json } = require("express");
const AppError = require("../utils/appError");
const transformMysqlErrorCode = require("../utils/dbErrorTranslator");

const appResponse = (response, next, status, data, error, customMessage) => {
  if( status ) {
    let jsonData = {
      status: "success",
      length: data?.length,
      data: data,
    }
    if( customMessage !== undefined ) {
      jsonData['message'] = customMessage
    }
    response.status(200).json(jsonData)
  }
  else {
    const err_message = transformMysqlErrorCode(error, "team");
    if( process.env.LOGS_ERROR == 1){
      console.error("appResponse Error", error)
    }
    return next(new AppError(err_message, 500));
  }
}

module.exports = appResponse;