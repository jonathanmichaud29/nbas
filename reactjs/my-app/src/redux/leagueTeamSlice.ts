import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ILeagueTeam } from '../Interfaces/league';

const initialState = [] as ILeagueTeam[];

const leagueTeamSlice = createSlice({
  name:"leagueTeams",
  initialState,
  reducers: {
    addLeagueTeams: (state, action: PayloadAction<[ILeagueTeam]>) => {
      action.payload.forEach((leagueTeam: ILeagueTeam) => {
        if ( state.find(element => element === leagueTeam) === undefined ){
          state.push(leagueTeam);
        }
      });
    },

    addLeagueTeam: {
      reducer: (state, action: PayloadAction<ILeagueTeam>) => {
        if ( state.find(element => element === action.payload) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (leagueTeam: ILeagueTeam) => ({
        payload: leagueTeam,
      })
    },
    removeLeagueTeam: {
      reducer: (state, action: PayloadAction<ILeagueTeam>) => {
        const index = state.findIndex((leagueTeam) => leagueTeam.idTeam === action.payload.idTeam && leagueTeam.idLeague === action.payload.idLeague);
        state.splice(index, 1);
      },
      prepare: (leagueTeam: ILeagueTeam) => ({
        payload: leagueTeam,
      })
    },
    resetLeagueTeams: () => initialState
  }
});

export const { addLeagueTeams, addLeagueTeam, removeLeagueTeam, resetLeagueTeams } = leagueTeamSlice.actions;

export default leagueTeamSlice.reducer;