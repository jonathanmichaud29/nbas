const express = require("express");
const router = express.Router();

const teamControllers = require("../controllers/team");
const playerControllers = require("../controllers/player");

router
  .route("/team/")
  .get(teamControllers.getAllTeams)
  .post(teamControllers.createTeam);

router
 .route("/team/:id")
 .get(teamControllers.getTeam)
 .put(teamControllers.updateTeam)
 .delete(teamControllers.deleteTeam);

router
  .route("/player/")
  .get(playerControllers.getAllPlayers)
  .post(playerControllers.createPlayer);

router
 .route("/player/:id")
 .get(playerControllers.getPlayer)
 .put(playerControllers.updatePlayer)
 .delete(playerControllers.deletePlayer);

module.exports = router;