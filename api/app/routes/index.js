const express = require("express");
const router = express.Router();

const firebaseAuthMiddleware = require("../middlewares/firebase-auth-middleware");
const { validateUserLeague } = require("../utils/validation")
const teamControllers = require("../controllers/team");
const playerControllers = require("../controllers/player");
const playerLeagueControllers = require("../controllers/playerLeague");
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
 * Player League routes
 */
router
  .route("/r/player-league/")
  .post(playerLeagueControllers.getLeaguePlayers);

router
  .route("/m/player-league/:idPlayer")
  .delete(firebaseAuthMiddleware.decodeToken, validateUserLeague, playerLeagueControllers.deleteLeaguePlayer);

/**
 * Players routes
 */

router
  .route("/m/player/")
  .post(firebaseAuthMiddleware.decodeToken, validateUserLeague, playerControllers.createPlayer);

router
  .route("/m/player/:id")
  .delete(firebaseAuthMiddleware.decodeToken, validateUserLeague, playerControllers.deletePlayer);

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
  .post(firebaseAuthMiddleware.decodeToken, validateUserLeague, teamControllers.createTeam);

router
  .route("/m/team/:id")
  .delete(firebaseAuthMiddleware.decodeToken, validateUserLeague, teamControllers.deleteTeam);

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
  .post(firebaseAuthMiddleware.decodeToken, validateUserLeague, matchControllers.createMatch);

router
  .route('/m/match/:matchId')
  .delete(firebaseAuthMiddleware.decodeToken, validateUserLeague, matchControllers.deleteMatch);

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
  .post(firebaseAuthMiddleware.decodeToken, validateUserLeague, teamPlayerControllers.createTeamPlayer);

router
  .route('/m/team-player/:teamId/:playerId')
  .delete(firebaseAuthMiddleware.decodeToken, validateUserLeague, teamPlayerControllers.deleteTeamPlayer);


/**
 * Match Lineup routes
 */
router
 .route("/r/match-lineup/")
 .post(matchLineupControllers.getMatchLineups);

router
  .route("/m/match-lineup/")
  .post(firebaseAuthMiddleware.decodeToken, validateUserLeague, matchLineupControllers.createMatchLineups)
  .put(firebaseAuthMiddleware.decodeToken, validateUserLeague, matchLineupControllers.updateMatchLineups);

router
  .route("/m/match-lineup/:matchLineupId")
  .delete(firebaseAuthMiddleware.decodeToken, validateUserLeague, matchLineupControllers.deleteMatchLineup);


module.exports = router;