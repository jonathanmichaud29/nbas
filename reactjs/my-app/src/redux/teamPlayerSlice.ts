import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITeamPlayer } from '../Interfaces/player';

const initialState = [] as ITeamPlayer[];



const teamPlayerSlice = createSlice({
  name:"teamPlayers",
  initialState,
  reducers: {
    addTeamPlayers: (state, action: PayloadAction<ITeamPlayer[]>) => {
      action.payload.forEach((teamPlayer: ITeamPlayer) => {
        if ( state.find(element => 
          element.idPlayer === teamPlayer.idPlayer 
          && element.idLeagueSeason === teamPlayer.idLeagueSeason
          && element.idTeam === teamPlayer.idTeam
          ) === undefined ){
          state.push(teamPlayer);
        }
      });
    },

    addTeamPlayer: {
      reducer: (state, action: PayloadAction<ITeamPlayer>) => {
        if ( state.find(element => 
          element.idPlayer === action.payload.idPlayer 
          && element.idLeagueSeason === action.payload.idLeagueSeason
          && element.idTeam === action.payload.idTeam 
          ) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (teamPlayer: ITeamPlayer) => ({
        payload: teamPlayer,
      })
    },
    removeTeamPlayer: {
      reducer: (state, action: PayloadAction<ITeamPlayer>) => {
        const index = state.findIndex((teamPlayer) => 
          teamPlayer.idPlayer === action.payload.idPlayer 
          && teamPlayer.idLeagueSeason === action.payload.idLeagueSeason
          && teamPlayer.idTeam === action.payload.idTeam
          );
        state.splice(index, 1);
      },
      prepare: (teamPlayer: ITeamPlayer) => ({
        payload: teamPlayer,
      })
    },
    resetTeamPlayers: () => initialState
  }
});

export const { addTeamPlayers, addTeamPlayer, removeTeamPlayer, resetTeamPlayers } = teamPlayerSlice.actions;

export default teamPlayerSlice.reducer;