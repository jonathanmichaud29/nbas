import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITeam } from '../Interfaces/Team';
const initialState = [] as ITeam[];

const teamSlice = createSlice({
  name:"teams",
  initialState,
  reducers: {
    
    addTeams: (state, action: PayloadAction<[ITeam]>) => {
      action.payload.forEach((new_team: ITeam) => {
        if ( state.find(element => element.id === new_team.id) === undefined ){
          state.push(new_team);
        }
      });
    },

    addTeam: {
      reducer: (state, action: PayloadAction<ITeam>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (new_team: ITeam) => ({
        payload: {
          id: new_team.id,
          name: new_team.name
        },
      })
    },
    
    removeTeam(state, action: PayloadAction<number>) {
      const index = state.findIndex((team) => team.id === action.payload);
      state.splice(index, 1);
    },
  }
});

export const { addTeams, addTeam, removeTeam } = teamSlice.actions;

export default teamSlice.reducer;