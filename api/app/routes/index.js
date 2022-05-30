const express = require("express");
const router = express.Router();

const teamControllers = require("../controllers/team");
const playerControllers = require("../controllers/player");
const firebaseAuthMiddleware = require("../middlewares/firebase-auth-middleware");

router
  .route("/team/")
  .get(teamControllers.getAllTeams)
  .post(teamControllers.createTeam, firebaseAuthMiddleware.decodeToken);

router
 .route("/team/:id")
 .get(teamControllers.getTeam)
 .put(teamControllers.updateTeam, firebaseAuthMiddleware.decodeToken)
 .delete(teamControllers.deleteTeam, firebaseAuthMiddleware.decodeToken);

router
  .route("/player/")
  .get(playerControllers.getAllPlayers)
  .post(playerControllers.createPlayer, firebaseAuthMiddleware.decodeToken);

router
 .route("/player/:id")
 .get(playerControllers.getPlayer)
 .put(playerControllers.updatePlayer, firebaseAuthMiddleware.decodeToken)
 .delete(playerControllers.deletePlayer, firebaseAuthMiddleware.decodeToken);

module.exports = router;