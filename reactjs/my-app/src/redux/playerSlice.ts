import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IPlayer } from '../Interfaces/Player';
const initialState = [] as IPlayer[];

const playerSlice = createSlice({
  name:"players",
  initialState,
  reducers: {
    addPlayers: (state, action: PayloadAction<[IPlayer]>) => {
      action.payload.forEach((newPlayer: IPlayer) => {
        if ( state.find(element => element.id === newPlayer.id) === undefined ){
          state.push(newPlayer);
        }
      });
    },

    addPlayer: {
      reducer: (state, action: PayloadAction<IPlayer>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (newPlayer: IPlayer) => ({
        payload: {
          id: newPlayer.id,
          name: newPlayer.name
        },
      })
    },
    removePlayer(state, action: PayloadAction<number>) {
      const index = state.findIndex((player) => player.id === action.payload);
      state.splice(index, 1);
    },
  }
});

export const { addPlayers, addPlayer, removePlayer } = playerSlice.actions;

export default playerSlice.reducer;