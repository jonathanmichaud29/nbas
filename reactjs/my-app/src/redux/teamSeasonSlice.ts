import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITeamSeason } from '../Interfaces/team';
const initialState = [] as ITeamSeason[];

const teamSeasonSlice = createSlice({
  name:"teamSeasons",
  initialState,
  reducers: {
    
    addTeamSeasons: (state, action: PayloadAction<ITeamSeason[]>) => {
      action.payload.forEach((newTeamSeason: ITeamSeason) => {
        if ( state.find(element => element.idTeam === newTeamSeason.idTeam && element.idLeagueSeason === newTeamSeason.idLeagueSeason) === undefined ){
          state.push(newTeamSeason);
        }
      });
    },

    addTeamSeason: {
      reducer: (state, action: PayloadAction<ITeamSeason>) => {
        if ( state.find(element => element.idTeam === action.payload.idTeam && element.idLeagueSeason === action.payload.idLeagueSeason) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (newTeamSeason: ITeamSeason) => ({
        payload: {
          idTeam: newTeamSeason.idTeam,
          idLeagueSeason: newTeamSeason.idLeagueSeason
        },
      })
    },
    
    removeTeamSeason(state, action: PayloadAction<ITeamSeason>) {
      const index = state.findIndex((team) => team.idTeam === action.payload.idTeam && team.idLeagueSeason === action.payload.idLeagueSeason);
      state.splice(index, 1);
    },
    resetTeams: () => initialState
  }
});

export const { addTeamSeasons, addTeamSeason, removeTeamSeason, resetTeams } = teamSeasonSlice.actions;

export default teamSeasonSlice.reducer;