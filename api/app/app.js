
const dotenvPathConfig = process.env.NODE_ENV === 'development' ? '/app/.env.development' : '/var/www/html/nbas/be/.env.production';
require('dotenv').config({path: dotenvPathConfig});
const express = require("express");
const app = express()
const cors = require("cors");
const router = require("./routes");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
const firebaseSetToken = require("./middlewares/firebase-set-token")
const { userAccessLeagues } = require("./middlewares/user-access-leagues")

app.use(cors({
  origin: process.env.WEB_DOMAIN
}));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(firebaseSetToken);
app.use(userAccessLeagues);

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
