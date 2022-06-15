import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from 'reselect'

import { Alert, IconButton, List, ListItem  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';

import { AppDispatch, RootState } from "../redux/store";
import { removeMatchPlayer } from "../redux/matchPlayerSlice"

import { IMatchLineup, ITeamMatchLineupProps } from '../Interfaces/Match';
import { IPlayer } from '../Interfaces/Player';

import { deletePlayerLineup } from '../ApiCall/matches';

import AddMatchLineup from '../Modals/AddMatchLineup';
import AddTeamPlayersLineup from '../Modals/AddTeamPlayersLineup';
import ConfirmDelete from "../Modals/ConfirmDelete";

function TeamMatchLineup (props: ITeamMatchLineupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin, match, isHomeTeam, team, allPlayers } = props;

  const [apiError, changeApiError] = useState("");
  const [lineupTeam, setLineupTeam] = useState<IMatchLineup[] | null>(null);

  const selectCurrentMatchPlayers = createSelector(
    (state: RootState) => state.matchPlayers,
    (matchPlayers) => matchPlayers.find((myMatchPlayers) => myMatchPlayers.match.id === match.id)
  )
  const allMatchPlayers = useSelector(selectCurrentMatchPlayers) || null;
  
  
  const getPlayerName = (idPlayer: number): string => {
    const defaultReturn = "Player not found in lineup";
    if( allPlayers ){
      const playerFound = allPlayers.find((player: IPlayer) => player.id === idPlayer);
      if( playerFound ) return playerFound.name;
    }
    return defaultReturn;
  }

  /**
   * Handle multiples modals
   */
  const [isModalOpenAddMatchLineup, setOpenAddMatchLineup] = useState(false);
  const [isModalOpenConfirmDeleteLineup, setOpenConfirmDeleteLineup] = useState(false);
  const [isModalOpenAddTeamPlayersLineup, setOpenModalAddTeamPlayersLineup] = useState(false);

  const [currentLineup, setCurrentLineup] = useState<IMatchLineup | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState("");

  const handleOpenAddTeamPlayersLineup = () => {
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
    setCurrentPlayerName(getPlayerName(lineup.idPlayer));
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

    deletePlayerLineup(lineup.id)
      .then(response => {
        dispatch(removeMatchPlayer(match, lineup))
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }

  

  useEffect( () => {
    if( allMatchPlayers === null ) return;
    const teamPlayers = allMatchPlayers.lineupPlayers.filter((lineupPlayer: IMatchLineup) => lineupPlayer.idTeam === team.id )
    setLineupTeam(teamPlayers);
  }, [allMatchPlayers, team.id]);

  return (
    <>
      <h3>{team.name} : { isHomeTeam ? 'Home' : 'Away'} Team</h3>
      { apiError && <Alert severity="error">{apiError}</Alert> }
      <IconButton 
        key={`action-add-match-lineup-${match.id}-${team.id}`}
        aria-label={`Add Player to ${team.name} lineup`}
        title={`Add Player to ${team.name} lineup`}
        onClick={ () => handleOpenAddMatchLineup() }
        >
        <PeopleIcon />
      </IconButton>
      <IconButton 
        key={`action-add-team-lineup-${match.id}-${team.id}`}
        aria-label={`Add all ${team.name} Players to lineup`}
        title={`Add all ${team.name} Players to lineup`}
        onClick={ () => handleOpenAddTeamPlayersLineup() }
        >
        <GroupsIcon />
      </IconButton>

      { lineupTeam && lineupTeam.length > 0 ? (
          <List>
            { lineupTeam.map((lineup: IMatchLineup) => {
              let listActions = [];
              if( isAdmin ) {
                listActions.push(
                  <IconButton 
                    key={`action-delete-lineup-${lineup.id}`}
                    aria-label={`Remove player from lineup`}
                    title={`Remove player from lineup`}
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
                  >{getPlayerName(lineup.idPlayer)}</ListItem>
              )
            })}
          </List>
      ) : 'No lineup' }

      { isAdmin && isModalOpenAddMatchLineup && (
        <AddMatchLineup
          key={`match-lineup-${match.id}-${team.id}`}
          isOpen={isModalOpenAddMatchLineup}
          match={match}
          selectedTeam={team}
          callbackCloseModal={cbCloseAddMatchLineup}
          allPlayers={allPlayers}
          />
      )}
      { currentPlayerName && isAdmin && (
        <ConfirmDelete
          key={`match-lineup-remnove-${match.id}-${team.id}`}
          isOpen={isModalOpenConfirmDeleteLineup}
          callbackCloseModal={cbCloseModalDelete}
          callbackConfirmDelete={cbCloseConfirmDelete}
          title={`Confirm lineup delete`}
          description={`Are-you sure you want to remove the player '${currentPlayerName}' from this lineup?`}
          />
      ) }
      { isAdmin && isModalOpenAddTeamPlayersLineup && (
        <AddTeamPlayersLineup
          key={`team-players-lineup-${match.id}-${team.id}`}
          isOpen={isModalOpenAddTeamPlayersLineup}
          match={match}
          selectedTeam={team}
          callbackCloseModal={cbCloseAddTeamPlayersLineup}
          allPlayers={allPlayers}
          />
      )}
    </>
  )
}

export default TeamMatchLineup;