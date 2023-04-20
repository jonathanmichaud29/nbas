import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMatch } from '../Interfaces/match';
const initialState = [] as IMatch[];

const matchSlice = createSlice({
  name:"matches",
  initialState,
  reducers: {
    addMatches: (state, action: PayloadAction<[IMatch]>) => {
      action.payload.forEach((newMatch: IMatch) => {
        if ( state.find(element => element.id === newMatch.id) === undefined ){
          state.push(newMatch);
        }
      });
    },

    addMatch: {
      reducer: (state, action: PayloadAction<IMatch>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (newMatch: IMatch) => ({
        payload: {
          id: newMatch.id,
          idLeague: newMatch.idLeague,
          idSeason: newMatch.idSeason,
          idTeamHome: newMatch.idTeamHome,
          idTeamAway: newMatch.idTeamAway,
          date: newMatch.date,
          isCompleted: newMatch.isCompleted,
          teamHomePoints: newMatch.teamHomePoints,
          teamAwayPoints: newMatch.teamAwayPoints,
          idTeamWon: newMatch.idTeamWon,
          idTeamLost: newMatch.idTeamLost,
        }
      })
    },
    removeMatch(state, action: PayloadAction<number>) {
      const index = state.findIndex((match) => match.id === action.payload);
      state.splice(index, 1);
    },
    resetMatches: () => initialState
  }
});

export const { addMatches, addMatch, removeMatch, resetMatches } = matchSlice.actions;

export default matchSlice.reducer;