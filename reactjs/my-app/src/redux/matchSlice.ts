import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMatch } from '../Interfaces/Match';
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
          idTeamHome: newMatch.idTeamHome,
          idTeamAway: newMatch.idTeamAway,
          date: newMatch.date,
          isCompleted: newMatch.isCompleted,
          team_home_points: newMatch.team_home_points,
          team_away_points: newMatch.team_away_points,
          idTeamWon: newMatch.idTeamWon,
          idTeamLost: newMatch.idTeamLost,
        }
      })
    },
    removeMatch(state, action: PayloadAction<number>) {
      const index = state.findIndex((match) => match.id === action.payload);
      state.splice(index, 1);
    },
  }
});

export const { addMatches, addMatch, removeMatch } = matchSlice.actions;

export default matchSlice.reducer;