import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Alert, Button, IconButton, List, ListItem, Paper, Stack, Typography  } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Delete } from '@mui/icons-material';

import { AppDispatch, RootState } from "../redux/store";
import { removeMatchPlayer } from "../redux/matchPlayerSlice"

import { IMatchLineup, ITeamMatchLineupProps } from '../Interfaces/match';

import { deleteMatchLineup, IApiDeleteMatchLineupParams } from '../ApiCall/matches';

import AddMatchLineup from '../Modals/AddMatchLineup';
import AddTeamPlayersLineup from '../Modals/AddTeamPlayersLineup';
import ConfirmDelete from "../Modals/ConfirmDelete";
import LoaderInfo from '../Generic/LoaderInfo';

import { getPlayerName } from '../utils/dataAssociation';

function TeamMatchLineup (props: ITeamMatchLineupProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { isAdmin, match, team } = props;

  const [apiError, changeApiError] = useState("");

  const listPlayers = useSelector((state: RootState) => state.players )
  const allMatchPlayers = useSelector((state: RootState) => state.matchPlayers ).find((matchPlayers) => matchPlayers.match.id === match.id)
  
  const lineupTeam = allMatchPlayers?.lineupPlayers.filter((lineupPlayer: IMatchLineup) => lineupPlayer.idTeam === team.id ) || []

  /**
   * Handle multiples modals
   */
  const [isModalOpenAddMatchLineup, setOpenAddMatchLineup] = useState(false);
  const [isModalOpenConfirmDeleteLineup, setOpenConfirmDeleteLineup] = useState(false);
  const [isModalOpenAddTeamPlayersLineup, setOpenModalAddTeamPlayersLineup] = useState(false);

  const [currentLineup, setCurrentLineup] = useState<IMatchLineup | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState("");

  const handleOpenAddTeamPlayersLineup = () => {
    setOpenModalAddTeamPlayersLineup(true);
  }
  const cbCloseAddTeamPlayersLineup = () => {
    setOpenModalAddTeamPlayersLineup(false);
  }
  
  const handleOpenAddMatchLineup = () => {
    setOpenAddMatchLineup(true);
  }
  const cbCloseAddMatchLineup = () => {
    setOpenAddMatchLineup(false);
  }

  const handleDeletePlayerLineup = (lineup: IMatchLineup) => {
    setCurrentLineup(lineup);
    setCurrentPlayerName(getPlayerName(lineup.idPlayer, listPlayers));
    setOpenConfirmDeleteLineup(true);
  }
  const cbCloseModalDelete = () => {
    setOpenConfirmDeleteLineup(false);
  }
  const cbCloseConfirmDelete = () => {
    if( currentLineup ){
      confirmDeletePlayerLineup(currentLineup);
      setCurrentLineup(null);
    }
    setOpenConfirmDeleteLineup(false);
  }

  const confirmDeletePlayerLineup = (lineup: IMatchLineup) => {
    // reinitializeApiMessages();

    const paramsDeleteMatchLineup: IApiDeleteMatchLineupParams = {
      matchLineupId: lineup.id,
    }
    deleteMatchLineup(paramsDeleteMatchLineup)
      .then(response => {
        dispatch(removeMatchPlayer(match, lineup))
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }

  return (
    <>
      <Stack component={Paper} p={3} mb={3} justifyContent="center" spacing={2} alignItems="center">
        <Typography variant="h3">
          {team.name}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} >
          <Button 
            variant="contained" 
            startIcon={<AddCircleIcon />}
            onClick={ () => handleOpenAddTeamPlayersLineup() }
          >Rooster</Button>

          <Button 
            variant="contained" 
            startIcon={<AddCircleIcon />} 
            onClick={ () => handleOpenAddMatchLineup() }
          >Sub</Button>
        </Stack>

        { lineupTeam && lineupTeam.length > 0 ? (
          <List>
            { lineupTeam.map((lineup: IMatchLineup) => {
              let listActions = [];
              let actionLabel;
              if( isAdmin ) {
                actionLabel = `Remove player from lineup`;
                listActions.push(
                  <IconButton 
                    key={`action-delete-lineup-${lineup.id}`}
                    aria-label={actionLabel}
                    title={actionLabel}
                    onClick={ () => handleDeletePlayerLineup(lineup)}
                    >
                    <Delete />
                  </IconButton>
                )
              }
              return (
                <ListItem 
                  key={`match-lineup-${lineup.id}`}
                  secondaryAction={ listActions.map((action) => action) }
                  >{getPlayerName(lineup.idPlayer, listPlayers)}</ListItem>
              )
            })}
          </List>
        ) : (
          <Alert severity="info">No Rooster defined</Alert>
        )}
        <LoaderInfo
          msgError={apiError}
        />
      </Stack>
      
      { isAdmin && (
        <AddMatchLineup
          key={`match-lineup-${match.id}-${team.id}`}
          isOpen={isModalOpenAddMatchLineup}
          match={match}
          selectedTeam={team}
          callbackCloseModal={cbCloseAddMatchLineup}
          />
      )}
      { isAdmin && (
        <AddTeamPlayersLineup
          key={`team-players-lineup-${match.id}-${team.id}`}
          isOpen={isModalOpenAddTeamPlayersLineup}
          match={match}
          selectedTeam={team}
          callbackCloseModal={cbCloseAddTeamPlayersLineup}
          />
      )}
      { currentPlayerName && isAdmin && (
        <ConfirmDelete
          key={`match-lineup-remnove-${match.id}-${team.id}`}
          isOpen={isModalOpenConfirmDeleteLineup}
          callbackCloseModal={cbCloseModalDelete}
          callbackConfirmDelete={cbCloseConfirmDelete}
          title={`Remove Player from lineup`}
          description={`Are-you sure you want to remove the player '${currentPlayerName}' from this lineup?`}
          />
      ) }
    </>
  )
}

export default TeamMatchLineup;