import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Alert, Box, CircularProgress, IconButton, List, ListItem } from "@mui/material";
import { Delete } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { addTeams, removeTeam } from "../redux/teamSlice";
import { fetchTeams, deleteTeam } from "../ApiCall/teams";
import { ITeam, ITeamProps } from "../Interfaces/team";

import ViewTeamPlayers from "../Modals/ViewTeamPlayers";
import AddTeamPlayer from "../Modals/AddTeamPlayer";
import ConfirmDelete from "../Modals/ConfirmDelete";

function ListTeams(props: ITeamProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const {isAdmin, isAddPlayers, isViewPlayers } = props;

  const listTeams = useSelector((state: RootState) => state.teams )

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeleteTeam = (team: ITeam) => {
    reinitializeApiMessages();

    deleteTeam(team.id)
      .then(response => {
        dispatch(removeTeam(team.id));
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
    fetchTeams()
      .then(response => {
        dispatch(addTeams(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }, [dispatch])

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
    <div className="public-layout">
      <h2>Team List</h2>
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
    </div>
  )
}
export default ListTeams;