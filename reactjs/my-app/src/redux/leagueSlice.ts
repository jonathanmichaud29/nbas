import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ILeague } from '../Interfaces/league';
const initialState = [] as ILeague[];

const leagueSlice = createSlice({
  name:"leagues",
  initialState,
  reducers: {
    addLeagues: (state, action: PayloadAction<[ILeague]>) => {
      action.payload.forEach((newLeague: ILeague) => {
        if ( state.find(element => element.id === newLeague.id) === undefined ){
          state.push(newLeague);
        }
      });
    },

    addLeague: {
      reducer: (state, action: PayloadAction<ILeague>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (newLeague: ILeague) => ({
        payload: {
          id: newLeague.id,
          name: newLeague.name
        },
      })
    },
    removeLeague(state, action: PayloadAction<number>) {
      const index = state.findIndex((league) => league.id === action.payload);
      state.splice(index, 1);
    },
    resetLeagues: () => initialState
  }
});

export const { addLeagues, addLeague, removeLeague, resetLeagues } = leagueSlice.actions;

export default leagueSlice.reducer;