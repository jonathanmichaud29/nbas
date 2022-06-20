const express = require("express");
const router = express.Router();

const teamControllers = require("../controllers/team");
const playerControllers = require("../controllers/player");
const matchControllers = require("../controllers/match");
const firebaseAuthMiddleware = require("../middlewares/firebase-auth-middleware");

router
  .route("/team/")
  .get(teamControllers.getAllTeams)
  .post(teamControllers.createTeam, firebaseAuthMiddleware.decodeToken);

router
  .route("/team/list/")
  .post(teamControllers.getTeams)

router
 .route("/team/:id")
 .get(teamControllers.getTeam)
 /* .put(teamControllers.updateTeam, firebaseAuthMiddleware.decodeToken) */
 .delete(teamControllers.deleteTeam, firebaseAuthMiddleware.decodeToken);

router
 .route("/team-players/:id")
 .get(teamControllers.getTeamPlayers)
 .post(teamControllers.createTeamPlayer, firebaseAuthMiddleware.decodeToken)

router
  .route('/team-player/')
  .get(teamControllers.getAllTeamPlayers)
  .delete(teamControllers.deleteTeamPlayer, firebaseAuthMiddleware.decodeToken)

router
 .route("/unassigned-players/")
 .get(teamControllers.getUnassignedPlayers)

router
  .route("/player/")
  .get(playerControllers.getAllPlayers)
  .post(playerControllers.createPlayer, firebaseAuthMiddleware.decodeToken);

router
 .route("/player/:id")
 .get(playerControllers.getPlayer)
 /* .put(playerControllers.updatePlayer, firebaseAuthMiddleware.decodeToken) */
 .delete(playerControllers.deletePlayer, firebaseAuthMiddleware.decodeToken);

router
  .route("/player/list/")
  .post(playerControllers.getSpecificPlayers);

router
  .route("/player-matches/:id")
  .get(playerControllers.getPlayerMatches)

router
  .route("/match/")
  .get(matchControllers.getAllMatches)
  .post(matchControllers.createMatch, firebaseAuthMiddleware.decodeToken);

router
  .route("/match/:id")
  .get(matchControllers.getMatch)
  .delete(matchControllers.deleteMatch, firebaseAuthMiddleware.decodeToken);

router
  .route("/match-lineup/:id")
  .get(matchControllers.getMatchLineups)
  .put(matchControllers.updateMatchLineups, firebaseAuthMiddleware.decodeToken);

router
  .route("/match-lineup/player/:id")
  .post(matchControllers.createPlayerLineup, firebaseAuthMiddleware.decodeToken)
  .delete(matchControllers.deletePlayerLineup, firebaseAuthMiddleware.decodeToken)

router
  .route("/team-matches/:id")
  .get(teamControllers.getTeamMatches)

module.exports = router;