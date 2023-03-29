import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ILeaguePlayer } from '../Interfaces/league';

const initialState = [] as ILeaguePlayer[];

const leaguePlayerSlice = createSlice({
  name:"leaguePlayers",
  initialState,
  reducers: {
    addLeaguePlayers: (state, action: PayloadAction<[ILeaguePlayer]>) => {
      action.payload.forEach((leaguePlayer: ILeaguePlayer) => {
        if ( state.find(element => element.idPlayer === leaguePlayer.idPlayer && element.idLeague === leaguePlayer.idLeague) === undefined ){
          state.push(leaguePlayer);
        }
      });
    },

    addLeaguePlayer: {
      reducer: (state, action: PayloadAction<ILeaguePlayer>) => {
        if ( state.find(element => element.idPlayer === action.payload.idPlayer && element.idLeague === action.payload.idLeague) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (leaguePlayer: ILeaguePlayer) => ({
        payload: leaguePlayer,
      })
    },
    removeLeaguePlayer: {
      reducer: (state, action: PayloadAction<ILeaguePlayer>) => {
        const index = state.findIndex((leaguePlayer) => leaguePlayer.idPlayer === action.payload.idPlayer && leaguePlayer.idLeague === action.payload.idLeague);
        state.splice(index, 1);
      },
      prepare: (leaguePlayer: ILeaguePlayer) => ({
        payload: leaguePlayer,
      })
    },
    resetLeaguePlayers: () => initialState
  }
});

export const { addLeaguePlayers, addLeaguePlayer, removeLeaguePlayer, resetLeaguePlayers } = leaguePlayerSlice.actions;

export default leaguePlayerSlice.reducer;