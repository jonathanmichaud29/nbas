
require('dotenv').config({path: `/app/.env.${process.env.NODE_ENV}`});
const express = require("express");
const app = express()
const cors = require("cors");
const router = require("./routes");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");

app.use(cors({
  origin: process.env.WEB_DOMAIN
}));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(router);

app.all("*", (req, res, next) => {
  next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;
