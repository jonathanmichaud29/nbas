import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ILeague, ILeagueSeason } from '../Interfaces/league';
const initialState = {
  leagues : [] as ILeague[],
  leagueSeasons : [] as ILeagueSeason[],
  currentLeague: null as ILeague | null,
  currentLeagueSeason: null as ILeagueSeason | null,
}

const adminContextSlice = createSlice({
  name:"adminContext",
  initialState,
  reducers: {
    addAdminLeagues: (state, action: PayloadAction<ILeague[]>) => {
      let newState = {...state};
      action.payload.forEach((league: ILeague) => {
        if ( newState.leagues.find(element => element.id === league.id) === undefined ){
          newState.leagues.push(league);
        }
      });
      state = newState;
    },

    addAdminLeagueSeasons: (state, action: PayloadAction<ILeagueSeason[]>) => {
      let newState = {...state};
      action.payload.forEach((leagueSeason: ILeagueSeason) => {
        if ( newState.leagueSeasons.find(element => element.id === leagueSeason.id) === undefined ){
          newState.leagueSeasons.push(leagueSeason);
        }
      });
      state = newState;
    },

    setAdminLeague: {
      reducer: (state, action: PayloadAction<ILeague | null>) => {
        state.currentLeague = action.payload;
      },
      prepare: (league: ILeague | null) => ({
        payload: league
      })
    },

    setAdminLeagueSeason: {
      reducer: (state, action: PayloadAction<ILeagueSeason | null>) => {
        state.currentLeagueSeason = action.payload;
      },
      prepare: (leagueSeason: ILeagueSeason | null) => ({
        payload: leagueSeason
      })
    },

    /* removeLeague(state, action: PayloadAction<number>) {
      const index = state.findIndex((league) => league.id === action.payload);
      state.splice(index, 1);
    }, */
    resetAdminContext: () => initialState
  }
});

export const { addAdminLeagues, addAdminLeagueSeasons, setAdminLeague, setAdminLeagueSeason, resetAdminContext } = adminContextSlice.actions;

export default adminContextSlice.reducer;