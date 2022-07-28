import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addTeams, removeTeam } from "../redux/teamSlice";
import { addLeagueTeams, removeLeagueTeam } from "../redux/leagueTeamSlice";

import { Alert, Box, CircularProgress, IconButton, List, ListItem, Typography } from "@mui/material";
import { Delete } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { ITeam, ITeamProps } from "../Interfaces/team";

import { fetchTeams, IApiFetchTeamsParams, fetchLeagueTeams, IApiFetchLeagueTeamsParams, deleteLeagueTeam, IApiDeleteLeagueTeamParams } from "../ApiCall/teams";

import ViewTeamPlayers from "../Modals/ViewTeamPlayers";
import AddTeamPlayer from "../Modals/AddTeamPlayer";
import ConfirmDelete from "../Modals/ConfirmDelete";
import { ILeagueTeam } from '../Interfaces/league';

function ListTeams(props: ITeamProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLeagueTeamsLoaded, setIsLeagueTeamsLoaded] = useState(false);
  const [isTeamsLoaded, setIsTeamsLoaded] = useState(false);

  const {isAdmin, isAddPlayers, isViewPlayers } = props;

  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )

  const isLoaded = isLeagueTeamsLoaded && isTeamsLoaded;

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeleteTeam = (team: ITeam) => {
    reinitializeApiMessages();

    const paramsDeleteLeagueTeam: IApiDeleteLeagueTeamParams = {
      idTeam: team.id
    }
    deleteLeagueTeam(paramsDeleteLeagueTeam)
      .then(response => {
        dispatch(removeTeam(team.id));
        const leagueTeamToRemove: ILeagueTeam = {
          idTeam: response.data.idTeam,
          idLeague: response.data.idLeague,
        }
        dispatch(removeLeagueTeam(leagueTeamToRemove));
        changeApiSuccess(response.message);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }

  /**
   * Handle multiples modals
   */
  const [currentTeamView, setCurrentTeamView] = useState<ITeam | null>(null);
  const [isModalOpenAddPlayerToTeam, setOpenAddPlayerToTeam] = useState(false);
  const [isModalOpenViewTeamPlayers, setOpenViewTeamPlayers] = useState(false);
  const [isModalOpenConfirmDeleteTeam, setOpenConfirmDeleteTeam] = useState(false);

  const handleOpenListPlayers = (team: ITeam) => {
    setCurrentTeamView(team);
    setOpenAddPlayerToTeam(false);
    setOpenViewTeamPlayers(true);
    setOpenConfirmDeleteTeam(false);
  }
  const handleOpenAddPlayerToTeam = (team: ITeam) => {
    setCurrentTeamView(team);
    setOpenViewTeamPlayers(false);
    setOpenAddPlayerToTeam(true);
    setOpenConfirmDeleteTeam(false);
  }

  const handleOpenConfirmDeleteTeam = (team: ITeam) => {
    setCurrentTeamView(team);
    setOpenViewTeamPlayers(false);
    setOpenAddPlayerToTeam(false);
    setOpenConfirmDeleteTeam(true);
  }

  const cbCloseTeamPlayers = () => {
    setOpenViewTeamPlayers(false);
  }
  const cbCloseAddTeamPlayer = () => {
    setOpenAddPlayerToTeam(false);
  }
  const cbCloseModalDelete = () => {
    setOpenConfirmDeleteTeam(false);
  }
  const cbCloseConfirmDelete = () => {
    if( currentTeamView ){
      confirmDeleteTeam(currentTeamView);
      setCurrentTeamView(null);
    }
    setOpenConfirmDeleteTeam(false);
  }

  useEffect(() => {
    const paramsFetchLeagueTeams: IApiFetchLeagueTeamsParams = {
      
    }
    fetchLeagueTeams(paramsFetchLeagueTeams)
      .then(response => {
        dispatch(addLeagueTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLeagueTeamsLoaded(true);
      });
  }, [dispatch]);

  useEffect(() => {
    if( ! isLeagueTeamsLoaded || isTeamsLoaded ) return;

    const teamIds = listLeagueTeams.map((leagueTeam) => leagueTeam.idTeam);
    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: teamIds
    }

    fetchTeams(paramsFetchTeams)
      .then(response => {
        dispatch(addTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsTeamsLoaded(true)
      });
  }, [dispatch, isLeagueTeamsLoaded, isTeamsLoaded, listLeagueTeams])

  const htmlTeams = ( listTeams.length > 0 ? (
    <List>
      {listTeams.map((team: ITeam) => {
        let listActions = [];
        listActions.push(
          <IconButton 
            key={`action-view-team-${team.id}`}
            aria-label={`${team.name} Profile`}
            title={`${team.name} Profile`}
            >
            <Link to={`/team/${team.id}`}>
              <QueryStatsIcon />
            </Link>
          </IconButton>
        )
        if( isAdmin ) {
          listActions.push(
            <IconButton 
              key={`action-delete-team-${team.id}`}
              aria-label={`Delete Team ${team.name}`}
              title={`Delete Team ${team.name}`}
              /* onClick={ () => clickDeleteTeam(team)} */
              onClick={ () => handleOpenConfirmDeleteTeam(team) }
              >
              <Delete />
            </IconButton>
          )
        }
        if( isViewPlayers ) {
          listActions.push(
            <IconButton 
              key={`action-view-players-${team.id}`}
              aria-label={`View ${team.name} players`}
              title={`View ${team.name} players`}
              onClick={ () => handleOpenListPlayers(team)}
              >
              <PeopleIcon />
            </IconButton>
          );
        }
        if( isAddPlayers ) {
          listActions.push(
            <IconButton 
              key={`action-add-player-${team.id}`}
              aria-label={`Add Player to ${team.name}`}
              title={`Add Player to ${team.name}`}
              onClick={ () => handleOpenAddPlayerToTeam(team)}
              >
              <GroupAddIcon />
            </IconButton>
          )
        }
        return (
          <ListItem 
            key={`team-${team.id}`}
            secondaryAction={ listActions.map((action) => action) }
            >{team.name}</ListItem>
        )
      })}
    </List>
  ) : '' );
  

  return (
    <>
      <Typography variant="h4" align="center">
        Team List
      </Typography>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { apiSuccess && <Alert severity="success">{apiSuccess}</Alert> }
      { htmlTeams }
      { currentTeamView && isViewPlayers && (
        <ViewTeamPlayers
          isOpen={isModalOpenViewTeamPlayers}
          isAdmin={isAdmin}
          selectedTeam={currentTeamView}
          callbackCloseModal={cbCloseTeamPlayers}
          />
      ) }
      { currentTeamView && isAddPlayers && (
        <AddTeamPlayer
          isOpen={isModalOpenAddPlayerToTeam}
          selectedTeam={currentTeamView}
          callbackCloseModal={cbCloseAddTeamPlayer}
          />
      ) }
      { currentTeamView && isAdmin && (
        <ConfirmDelete
          isOpen={isModalOpenConfirmDeleteTeam}
          callbackCloseModal={cbCloseModalDelete}
          callbackConfirmDelete={cbCloseConfirmDelete}
          title={`Confirm team delete`}
          description={`Are-you sure you want to delete the team '${currentTeamView?.name}'?`}
          />
      ) }
    </>
  )
}
export default ListTeams;