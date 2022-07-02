const express = require("express");
const router = express.Router();

const firebaseAuthMiddleware = require("../middlewares/firebase-auth-middleware");

const teamControllers = require("../controllers/team");
const playerControllers = require("../controllers/player");
const matchControllers = require("../controllers/match");
const teamPlayerControllers = require("../controllers/teamPlayer");



/**
 * Players routes
 */

router
  .route("/m/player/")
  .post(playerControllers.createPlayer, firebaseAuthMiddleware.decodeToken);

router
  .route("/m/player/:id")
  .delete(playerControllers.deletePlayer, firebaseAuthMiddleware.decodeToken);

router
  .route("/r/player/")
  .post(playerControllers.getPlayers)

/**
 * Teams routes
 */
router
  .route("/r/team/")
  .post(teamControllers.getTeams)

router
  .route("/r/team/standing/")
  .post(teamControllers.getStandingTeams)

router
  .route("/m/team/")
  .post(teamControllers.createTeam, firebaseAuthMiddleware.decodeToken);

router
  .route("/m/team/:id")
  .delete(teamControllers.deleteTeam, firebaseAuthMiddleware.decodeToken);

/**
 * Matches routes
 */

 router
 .route("/r/history-matches/")
 .post(matchControllers.getHistoryMatches);


/**
 * Teams Players routes
 */

router
  .route('/r/team-player/')
  .post(teamPlayerControllers.getTeamsPlayers);

router
  .route("/r/team-player/unassigned/")
  .post(teamPlayerControllers.getUnassignedPlayers);

router
  .route('/m/team-player/')
  .post(teamPlayerControllers.createTeamPlayer, firebaseAuthMiddleware.decodeToken);

router
  .route('/m/team-player/:teamId/:playerId')
  .delete(teamPlayerControllers.deleteTeamPlayer, firebaseAuthMiddleware.decodeToken);










/**
 * OLD ROUTES
 */


/**
 * Teams routes
 */
router
  .route("/team-players/:id")
  .get(teamControllers.getTeamPlayers)
  /* .post(teamControllers.createTeamPlayer, firebaseAuthMiddleware.decodeToken) */

/* router
  .route('/team-player/')
  .get(teamControllers.getAllTeamPlayers)
  .delete(teamControllers.deleteTeamPlayer, firebaseAuthMiddleware.decodeToken) */

/* router
 .route("/unassigned-players/")
 .get(teamControllers.getUnassignedPlayers) */

/**
 * Matches routes
 */

router
  .route("/match/")
  .get(matchControllers.getAllMatches)
  .post(matchControllers.createMatch, firebaseAuthMiddleware.decodeToken);

router
  .route("/single-match/")
  .post(matchControllers.getSingleMatch)

router
  .route("/match/:id")
  .get(matchControllers.getMatch)
  .delete(matchControllers.deleteMatch, firebaseAuthMiddleware.decodeToken);

router
  .route("/match-lineup/:idMatch")
  .get(matchControllers.getMatchLineups)
  .put(matchControllers.updateMatchLineups, firebaseAuthMiddleware.decodeToken);

router
  .route("/match-lineup/:idMatch/:idTeam")
  .get(matchControllers.getMatchLineups)

router
  .route("/match-lineup/player/:id")
  .post(matchControllers.createPlayerLineup, firebaseAuthMiddleware.decodeToken)
  .delete(matchControllers.deletePlayerLineup, firebaseAuthMiddleware.decodeToken);

router
  .route("/matches-lineups/")
  .get(matchControllers.getMatchesLineups);

router
  .route("/players-lineups/")
  .post(matchControllers.getPlayersMatchLineups)

router
  .route("/team-matches/:id")
  .get(teamControllers.getTeamMatches)

module.exports = router;