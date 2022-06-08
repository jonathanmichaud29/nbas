import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Alert, Box, CircularProgress, IconButton, List, ListItem  } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { IMatch, IMatchProps } from "../Interfaces/Match";
import { ITeam } from '../Interfaces/Team';

import { fetchTeam } from '../ApiCall/teams';
import { fetchMatch } from '../ApiCall/matches';

function ViewMatch(props: IMatchProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {idMatch, isAdmin} = props;

  const [match, setMatch] = useState<IMatch>();
  const [teamHome, setTeamHome] = useState<ITeam>();
  const [teamAway, setTeamAway] = useState<ITeam>();

  const [isLoaded, setIsLoaded] = useState(false);

  /* useEffect(() => {
    fetchMatch(idMatch)
      .then(response => {
        dispatch(addMatches(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
    
  }, [dispatch]) */

  return (
    <h1>View Match #{idMatch}</h1>
  )
}

export default ViewMatch;