import { useState } from 'react';
import { useSelector } from "react-redux";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PageviewIcon from '@mui/icons-material/Pageview';

import { RootState } from "../redux/store";

import { IAdminMatchHeaderProps } from "../Interfaces/match";

import CompleteMatch from '../Modals/CompleteMatch';

import { createHumanDate } from '../utils/dateFormatter';
import { quickLinkMatch } from '../utils/constants';

export default function AdminMatchHeader(props: IAdminMatchHeaderProps) {
console.info(props);
  const {match, teamHome, teamAway} = props;

  const stateAdminContext = useSelector((state: RootState) => state.adminContext )
  
  const currentLeagueName = stateAdminContext.currentLeague?.name || '';
  const currentSeasonName = stateAdminContext.currentLeagueSeason?.name || '';

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

  const dateReadable = createHumanDate(match.date);

  return (
    <>
      <Paper component={Box} p={3} m={3}>
        <Stack spacing={3} alignItems="center" >
          <Typography variant="h1" textAlign="center">{currentLeagueName}</Typography>
          <Typography variant="h3" textAlign="center">{currentSeasonName}</Typography>
          <Typography variant="h6" textAlign="center">{teamHome.name}<br/>receives<br/>{teamAway.name}</Typography>
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
              href={`${quickLinkMatch.link}/${match.id}`}
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