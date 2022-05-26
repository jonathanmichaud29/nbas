const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router
  .route("/team/")
  .get(controllers.getAllTeams)
  .post(controllers.createTeam);

router
 .route("/team/:id")
 .get(controllers.getTeam)
 .put(controllers.updateTeam)
 .delete(controllers.deleteTeam);

module.exports = router;