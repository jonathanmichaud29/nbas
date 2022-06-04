import { configureStore } from '@reduxjs/toolkit'

import teamReducer from './teamSlice'
import playerReducer from './playerSlice'
import matchReducer from './matchSlice'
export const store = configureStore({
  reducer: {
    teams: teamReducer,
    players: playerReducer,
    matches: matchReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch