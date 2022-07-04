import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { Alert, Box, CircularProgress  } from "@mui/material";

import { IMatch } from "../Interfaces/match";

import { fetchMatches, IApiFetchMatchesParams } from '../ApiCall/matches';

import ViewMatchDetails from '../Matchs/ViewMatchDetails';
import ListMatches from '../Matchs/ListMatches';

function PublicCalendar() {

  return (
    <>
      <ListMatches 
        isAdmin={false}
      />
    </>
  )
}
export default PublicCalendar;