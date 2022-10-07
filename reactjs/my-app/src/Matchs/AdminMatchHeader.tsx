import { useState } from 'react';
import { useSelector } from "react-redux";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PageviewIcon from '@mui/icons-material/Pageview';

import { RootState } from "../redux/store";

import { IAdminMatchHeaderProps } from "../Interfaces/match";

import CompleteMatch from '../Modals/CompleteMatch';

import { getStorageLeagueName } from '../utils/localStorage';
import { createHumanDate } from '../utils/dateFormatter';

export default function AdminMatchHeader(props: IAdminMatchHeaderProps) {

  const {match, teamHome, teamAway} = props;

  const listPlayers = useSelector((state: RootState) => state.players )

  /**
   * Handle modals
   */

  const [isModalOpenCompleteMatch, setModalOpenCompleteMatch] = useState(false);
  const handleOpenCompleteMatch = () => {
    setModalOpenCompleteMatch(true);
  }
  const cbCloseCompleteMatch = () => {
    setModalOpenCompleteMatch(false);
  }

  const currentLeagueName = getStorageLeagueName();
  const dateReadable = createHumanDate(match.date);

  return (
    <>
      <Paper component={Box} p={3} m={3}>
        <Stack spacing={3} alignItems="center" >
          <Typography variant="h1" textAlign="center">{currentLeagueName} <br/> {teamHome.name}<br/>vs<br/>{teamAway.name}</Typography>
          <Typography variant="subtitle1">{dateReadable}</Typography>
          <Button 
            variant="contained" 
            startIcon={<FactCheckIcon />} 
            onClick={ () => handleOpenCompleteMatch() }
          >Complete match statistics</Button>
          
          { match.isCompleted === 1 && (
            <Button 
              variant="outlined"
              startIcon={<PageviewIcon />} 
              href={`/match/${match.id}`}
            >View match details</Button>
          )}
        </Stack>
      </Paper>
      
      <CompleteMatch
        key={`modal-complete-match-${match.id}`}
        isOpen={isModalOpenCompleteMatch}
        match={match}
        teamHome={teamHome}
        teamAway={teamAway}
        callbackCloseModal={cbCloseCompleteMatch}
        allPlayers={listPlayers}
      />
    </>
  )
}