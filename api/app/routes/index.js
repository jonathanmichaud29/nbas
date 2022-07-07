const express = require("express");
const router = express.Router();

const firebaseAuthMiddleware = require("../middlewares/firebase-auth-middleware");

const teamControllers = require("../controllers/team");
const playerControllers = require("../controllers/player");
const matchControllers = require("../controllers/match");
const teamPlayerControllers = require("../controllers/teamPlayer");
const matchLineupControllers = require("../controllers/matchLineup");

const userControllers = require("../controllers/user");

/**
 * User routes
 */
router
  .route("/r/user-leagues/")
  .post(userControllers.fetchUserLeagues, firebaseAuthMiddleware.decodeToken);

router
  .route("/m/user/token/")
  .post(userControllers.userFirebaseToken, firebaseAuthMiddleware.decodeToken);




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
  .post(playerControllers.getPlayers);

/**
 * Teams routes
 */
router
  .route("/r/team/")
  .post(teamControllers.getTeams);

router
  .route("/r/team/standing/")
  .post(teamControllers.getStandingTeams);

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
  .route("/r/match/")
  .post(matchControllers.getMatches);

router
  .route("/r/history-matches/")
  .post(matchControllers.getHistoryMatches);

router
  .route("/m/match/")
  .post(matchControllers.createMatch, firebaseAuthMiddleware.decodeToken);

router
  .route('/m/match/:matchId')
  .delete(matchControllers.deleteMatch, firebaseAuthMiddleware.decodeToken);

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
 * Match Lineup routes
 */
router
 .route("/r/match-lineup/")
 .post(matchLineupControllers.getMatchLineups);

router
  .route("/m/match-lineup/")
  .post(matchLineupControllers.createMatchLineups, firebaseAuthMiddleware.decodeToken)
  .put(matchLineupControllers.updateMatchLineups, firebaseAuthMiddleware.decodeToken);

router
  .route("/m/match-lineup/:matchLineupId")
  .delete(matchLineupControllers.deleteMatchLineup, firebaseAuthMiddleware.decodeToken);


module.exports = router;