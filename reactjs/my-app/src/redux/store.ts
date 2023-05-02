import { configureStore } from '@reduxjs/toolkit'

import teamReducer from './teamSlice'
import teamSeasonReducer from './teamSeasonSlice'
import playerReducer from './playerSlice'
import teamPlayerReducer from './teamPlayerSlice'
import leagueReducer from './leagueSlice'
import matchPlayerReducer from './matchPlayerSlice'
import matchReducer from './matchSlice'
import leaguePlayerReducer from './leaguePlayerSlice'
import leagueTeamReducer from './leagueTeamSlice'
import leagueSeasonReducer from './leagueSeasonSlice'
import adminContextReducer from './adminContextSlice'
import publicContextReducer from './publicContextSlice'

export const store = configureStore({
  reducer: {
    teams: teamReducer,
    teamSeasons: teamSeasonReducer,
    leagueTeams: leagueTeamReducer,
    players: playerReducer,
    teamPlayers: teamPlayerReducer,
    leagues: leagueReducer,
    leaguePlayers: leaguePlayerReducer,
    leagueSeasons: leagueSeasonReducer,
    matches: matchReducer,
    matchPlayers: matchPlayerReducer,
    adminContext: adminContextReducer,
    publicContext: publicContextReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch