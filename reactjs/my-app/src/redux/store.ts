import { configureStore } from '@reduxjs/toolkit'

import teamReducer from './teamSlice'
import playerReducer from './playerSlice'
import matchPlayerReducer from './matchPlayerSlice'
import matchReducer from './matchSlice'
import leaguePlayerReducer from './leaguePlayerSlice'
export const store = configureStore({
  reducer: {
    teams: teamReducer,
    players: playerReducer,
    leaguePlayers: leaguePlayerReducer,
    matches: matchReducer,
    matchPlayers: matchPlayerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch