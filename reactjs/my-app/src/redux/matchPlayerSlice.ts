import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IMatch, IMatchPlayer, IMatchPlayers, IMatchLineup } from '../Interfaces/Match';

const initialState = [] as IMatchPlayers[];

const matchPlayerSlice = createSlice({
  name:"matchPlayers",
  initialState,
  reducers: {
    addMatchPlayers: {
      reducer: (state, action: PayloadAction<IMatchPlayers>) => {
        if ( state.find(element => element.match.id === action.payload.match.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (match: IMatch, lineupPlayers: Array<IMatchLineup>) => ({
        payload: {
          match,
          lineupPlayers
        },
      })
    },

    addMatchPlayer: {
      reducer: (state, action: PayloadAction<IMatchPlayer>) => {
        const indexState = state.findIndex(element => element.match.id === action.payload.match.id)
        if ( indexState === undefined ){
          state.push({
            match: action.payload.match,
            lineupPlayers: [action.payload.lineupPlayer]
          });
        }
        else {
          const playerFound = state[indexState].lineupPlayers.find((lineupPlayer: IMatchLineup) => lineupPlayer.idPlayer === action.payload.lineupPlayer.id )
          if( playerFound === undefined ) {
            let newMatchPlayers = state[indexState];
            newMatchPlayers.lineupPlayers.push(action.payload.lineupPlayer);
            state.splice(indexState, 1, newMatchPlayers);
          }
        }
      },
      prepare: (match: IMatch, lineupPlayer: IMatchLineup) => ({
        payload: {
          match,
          lineupPlayer
        },
      })
    },
    removeMatchPlayer: {
      reducer: (state, action: PayloadAction<IMatchPlayer>) => {
        const indexState = state.findIndex(element => element.match.id === action.payload.match.id)
        if ( indexState === -1 ) return;
        let newMatchPlayers = state[indexState];
        const playerFoundIndex = newMatchPlayers.lineupPlayers.findIndex((lineupPlayer: IMatchLineup) => lineupPlayer.idPlayer === action.payload.lineupPlayer.idPlayer )
        if( playerFoundIndex === -1 ) return;

        newMatchPlayers.lineupPlayers.splice(playerFoundIndex, 1);
        state.splice(indexState, 1, newMatchPlayers);
      },
      prepare: (match: IMatch, lineupPlayer: IMatchLineup) => ({
        payload: {
          match,
          lineupPlayer
        },
      })
    },
  }
});

export const { addMatchPlayers , addMatchPlayer, removeMatchPlayer } = matchPlayerSlice.actions;

export default matchPlayerSlice.reducer;