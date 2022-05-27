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

    /* addTeam: {
      reducer: (state, action: PayloadAction<ITeam>) => {
        if ( state.find(element => element.id === action.payload.id) === undefined ){
          state.push(action.payload);
        }
      },
      prepare: (id: number, name: string) => ({
        payload: {
          id,
          name
        } as ITeam,
      })
    }, */
    removeTeam(state, action: PayloadAction<number>) {
      const index = state.findIndex((team) => team.id === action.payload);
      state.splice(index, 1);
    },

    /*updateListTeams: (state, action: PayloadAction<ITeam>) => {
      let updated_list = state
      action.payload.forEach((payload_elem) => {
        const item_found = updated_list.find((item, index) => {
          if( item.id === payload_elem.id ) {
            updated_list[index] = payload_elem;
            return item
          }
        })
        if( ! item_found ){
          updated_list.push(payload_elem)
        }
      });
      state = updated_list;
      // state.push();
    }, */
  }
});

export const { addTeams, addTeam, removeTeam/* , updateListTeams */ } = teamSlice.actions;

export default teamSlice.reducer;