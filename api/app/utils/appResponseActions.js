const { json } = require("express");
const AppError = require("../utils/appError");
const transformMysqlErrorCode = require("../utils/dbErrorTranslator");

const appResponseActions = (response, next, status, data, message, warningCode) => {
  let jsonData = {
    status: status ? "success" : "error",
    length: data?.length,
    data: data,
    message: message,
    code: warningCode
  }
  const responseStatus = ( status ? 200 : 500);
  response.status(responseStatus).json(jsonData);
}

module.exports = appResponseActions;