import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ILeagueSeason } from '../Interfaces/league';

const initialState = [] as ILeagueSeason[];

const leagueSeasonSlice = createSlice({
  name:"leagueSeasons",
  initialState,
  reducers: {
    addLeagueSeasons: (state, action: PayloadAction<[ILeagueSeason]>) => {
      action.payload.forEach((leagueSeason: ILeagueSeason) => {
        if ( state.find(element => element.id === leagueSeason.id) === undefined ){
          state.push(leagueSeason);
        }
      });
    },

    addLeagueSeason: {
      reducer: (state, action: PayloadAction<ILeagueSeason>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (leagueSeason: ILeagueSeason) => ({
        payload: leagueSeason,
      })
    },
    removeLeagueSeason: {
      reducer: (state, action: PayloadAction<ILeagueSeason>) => {
        const index = state.findIndex((leagueSeason) => leagueSeason.id === action.payload.id && leagueSeason.idLeague === action.payload.idLeague);
        state.splice(index, 1);
      },
      prepare: (leagueSeason: ILeagueSeason) => ({
        payload: leagueSeason,
      })
    },
    resetLeagueSeasons: () => initialState
  }
});

export const { addLeagueSeasons, addLeagueSeason, removeLeagueSeason, resetLeagueSeasons } = leagueSeasonSlice.actions;

export default leagueSeasonSlice.reducer;