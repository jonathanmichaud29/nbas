import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITeam } from '../Interfaces/team';
const initialState = [] as ITeam[];

const teamSlice = createSlice({
  name:"teams",
  initialState,
  reducers: {
    
    addTeams: (state, action: PayloadAction<ITeam[]>) => {
      action.payload.forEach((newTeam: ITeam) => {
        if ( state.find(element => element.id === newTeam.id) === undefined ){
          state.push(newTeam);
        }
      });
    },

    addTeam: {
      reducer: (state, action: PayloadAction<ITeam>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (newTeam: ITeam) => ({
        payload: {
          id: newTeam.id,
          name: newTeam.name
        },
      })
    },
    
    removeTeam(state, action: PayloadAction<number>) {
      const index = state.findIndex((team) => team.id === action.payload);
      state.splice(index, 1);
    },
    resetTeams: () => initialState
  }
});

export const { addTeams, addTeam, removeTeam, resetTeams } = teamSlice.actions;

export default teamSlice.reducer;