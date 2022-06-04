import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMatch } from '../Interfaces/Match';
const initialState = [] as IMatch[];

const matchSlice = createSlice({
  name:"matches",
  initialState,
  reducers: {
    addMatches: (state, action: PayloadAction<[IMatch]>) => {
      action.payload.forEach((new_match: IMatch) => {
        if ( state.find(element => element.id === new_match.id) === undefined ){
          state.push(new_match);
        }
      });
    },

    addMatch: {
      reducer: (state, action: PayloadAction<IMatch>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (new_match: IMatch) => ({
        payload: {
          id: new_match.id,
          id_team_home: new_match.id_team_home,
          id_team_away: new_match.id_team_away,
          date: new_match.date,
          is_completed: new_match.is_completed,
          team_home_points: new_match.team_home_points,
          team_away_points: new_match.team_away_points,
          id_team_won: new_match.id_team_won,
          id_team_lost: new_match.id_team_lost,
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