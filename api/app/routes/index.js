const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router
  .route("/")
  .get(controllers.getAllTeams)
  .post(controllers.createTeam);

router
 .route("/:id")
 .get(controllers.getTeam)
 .put(controllers.updateTeam)
 .delete(controllers.deleteTeam);

module.exports = router;