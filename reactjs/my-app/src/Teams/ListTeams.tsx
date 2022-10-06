import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Alert, Box, Card, CardActions, CardHeader, Grid, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { Delete } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { AppDispatch, RootState } from "../redux/store";
import { addTeams, removeTeam } from "../redux/teamSlice";
import { addLeagueTeams, removeLeagueTeam } from "../redux/leagueTeamSlice";

import { ITeam, ITeamProps } from "../Interfaces/team";
import { ILeagueTeam } from '../Interfaces/league';

import { fetchTeams, IApiFetchTeamsParams, fetchLeagueTeams, IApiFetchLeagueTeamsParams, deleteLeagueTeam, IApiDeleteLeagueTeamParams } from "../ApiCall/teams";

import ViewTeamPlayers from "../Modals/ViewTeamPlayers";
import AddTeamPlayer from "../Modals/AddTeamPlayer";
import ConfirmDelete from "../Modals/ConfirmDelete";
import InfoDialog from '../Generic/InfoDialog';
import LoaderInfo from '../Generic/LoaderInfo';

function ListTeams(props: ITeamProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");

  const {isAdmin, isAddPlayers, isViewPlayers } = props;

  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )

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

  useMemo(() => {
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
        
      });
  }, [dispatch]);

  useMemo(() => {
    if( listLeagueTeams.length === 0 ) return;

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
        
      });
  }, [dispatch, listLeagueTeams])

  const htmlTeams = ( listTeams.length > 0 ? (
    <Box p={3} width="100%">
      <Grid container spacing={3} flexWrap="wrap"
        sx={{
          flexDirection:{xs:"column", sm:"row"}
        }}
      >
        { listTeams.map((team: ITeam, index:number) => {
          let listActions = [];
          let actionLabel=`${team.name} Profile`;
          listActions.push(
            <Tooltip title={actionLabel} key={`action-view-team-${team.id}`}>
              <IconButton color="primary"
                aria-label={actionLabel}
                href={`/team/${team.id}`}
                >
                <QueryStatsIcon />
              </IconButton>
            </Tooltip>
          )
          if( isViewPlayers ) {
            actionLabel=`View ${team.name} players`;
            listActions.push(
              <Tooltip title={actionLabel} key={`action-view-team-players-${team.id}`}>
                <IconButton color="primary"
                  aria-label={actionLabel}
                  onClick={ () => handleOpenListPlayers(team)}
                  >
                  <PeopleIcon />
                </IconButton>
              </Tooltip>
              
            );
          }
          if( isAddPlayers ) {
            actionLabel=`Add Player to ${team.name}`;
            listActions.push(
              <Tooltip title={actionLabel} key={`action-add-team-player-${team.id}`}>
                <IconButton color="primary"
                  aria-label={actionLabel}
                  onClick={ () => handleOpenAddPlayerToTeam(team)}
                  >
                  <GroupAddIcon />
                </IconButton>
              </Tooltip>
            )
          }
          if( isAdmin ) {
            actionLabel=`Delete Team ${team.name}`
            listActions.push(
              <Tooltip title={actionLabel} key={`action-delete-team-${team.id}`}>
                <IconButton color="primary"
                  aria-label={actionLabel}
                  onClick={ () => handleOpenConfirmDeleteTeam(team) }
                  >
                  <Delete />
                </IconButton>
              </Tooltip>
            )
          }
          return (
            <Grid item 
              key={`team-row-${team.id}`} 
              xs={12} sm={6} md={4} lg={3}
            >
              <Card raised={true}
                sx={{
                  '&:hover' : {
                    backgroundColor:"#efefef"
                  }
                }}
              >
                <CardHeader 
                  title={team.name}
                  titleTypographyProps={{variant:'h6'}}
                />
                <CardActions 
                  disableSpacing={true}
                  sx={{
                    justifyContent:'center',
                    flexWrap:'wrap'
                  }}
                >
                  {listActions}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  ) : (
    <Alert severity='info'>No team found in this league</Alert>
  ));
  

  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center" pb={3}>
        <Typography variant="h2">League Teams</Typography>
        <LoaderInfo
          msgError={apiError}
        />
        { apiSuccess && (
          <InfoDialog
            msgSuccess={apiSuccess}
          />
        )}
        { htmlTeams }
      </Stack>

      
      <ViewTeamPlayers
        isOpen={isModalOpenViewTeamPlayers}
        isAdmin={isAdmin}
        selectedTeam={currentTeamView}
        callbackCloseModal={cbCloseTeamPlayers}
      />

      <AddTeamPlayer
        isOpen={isModalOpenAddPlayerToTeam}
        selectedTeam={currentTeamView}
        callbackCloseModal={cbCloseAddTeamPlayer}
      />

      { currentTeamView && isAdmin && (
        <ConfirmDelete
          isOpen={isModalOpenConfirmDeleteTeam}
          callbackCloseModal={cbCloseModalDelete}
          callbackConfirmDelete={cbCloseConfirmDelete}
          title={`Confirm team delete`}
          description={`Are-you sure you want to delete the team '${currentTeamView.name}'?`}
          />
      ) }
    </Paper>
  )
}
export default ListTeams;