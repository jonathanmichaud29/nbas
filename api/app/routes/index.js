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
  .post(firebaseAuthMiddleware.decodeToken, userControllers.fetchUserLeagues);

router
  .route("/m/user-token/")
  .post(firebaseAuthMiddleware.decodeToken, userControllers.userFirebaseToken);




/**
 * Players routes
 */

router
  .route("/m/player/")
  .post(firebaseAuthMiddleware.decodeToken, playerControllers.createPlayer);

router
  .route("/m/player/:id")
  .delete(firebaseAuthMiddleware.decodeToken, playerControllers.deletePlayer);

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
  .post(firebaseAuthMiddleware.decodeToken, teamControllers.createTeam);

router
  .route("/m/team/:id")
  .delete(firebaseAuthMiddleware.decodeToken, teamControllers.deleteTeam);

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
  .post(firebaseAuthMiddleware.decodeToken, matchControllers.createMatch);

router
  .route('/m/match/:matchId')
  .delete(firebaseAuthMiddleware.decodeToken, matchControllers.deleteMatch);

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
  .post(firebaseAuthMiddleware.decodeToken, teamPlayerControllers.createTeamPlayer);

router
  .route('/m/team-player/:teamId/:playerId')
  .delete(firebaseAuthMiddleware.decodeToken, teamPlayerControllers.deleteTeamPlayer);


/**
 * Match Lineup routes
 */
router
 .route("/r/match-lineup/")
 .post(matchLineupControllers.getMatchLineups);

router
  .route("/m/match-lineup/")
  .post(firebaseAuthMiddleware.decodeToken, matchLineupControllers.createMatchLineups)
  .put(firebaseAuthMiddleware.decodeToken, matchLineupControllers.updateMatchLineups);

router
  .route("/m/match-lineup/:matchLineupId")
  .delete(firebaseAuthMiddleware.decodeToken, matchLineupControllers.deleteMatchLineup);


module.exports = router;