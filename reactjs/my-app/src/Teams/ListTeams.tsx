import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Alert, Box, 
  Card, CardActions, CardHeader, 
  Grid, IconButton, Paper, 
  Stack, Tooltip, Typography } from "@mui/material";
import { Delete } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { AppDispatch, RootState } from "../redux/store";
import { removeTeamSeason } from '../redux/teamSeasonSlice';

import { ITeam, ITeamProps, ITeamSeason } from "../Interfaces/team";

import { IApiDeleteTeamSeasonParams, deleteTeamSeason } from "../ApiCall/teams";

import ViewTeamPlayers from "../Modals/ViewTeamPlayers";
import AddTeamPlayer from "../Modals/AddTeamPlayer";
import ConfirmDelete from "../Modals/ConfirmDelete";
import InfoDialog from '../Generic/InfoDialog';
import LoaderInfo from '../Generic/LoaderInfo';

import { filterTeamsBySeason } from '../utils/dataFilter';
import { quickLinkTeam } from '../utils/constants';


function ListTeams(props: ITeamProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {isAdmin, isAddPlayers, isViewPlayers, leagueSeason } = props;
  
  const listTeams = useSelector((state: RootState) => state.teams )
  const listLeagueTeams = useSelector((state: RootState) => state.leagueTeams )
  const listTeamSeasons = useSelector((state: RootState) => state.teamSeasons )

  const currentLeagueSeasonName = leagueSeason?.name || '';

  const [apiError, changeApiError] = useState("");
  const [apiSuccess, changeApiSuccess] = useState("");
  
  const filteredTeams = filterTeamsBySeason(listTeams, listLeagueTeams, listTeamSeasons, leagueSeason);
  filteredTeams.sort((a, b) => a.name.localeCompare(b.name));
  

  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeleteTeam = (team: ITeam) => {
    reinitializeApiMessages();

    const paramsDeleteTeamSeason: IApiDeleteTeamSeasonParams = {
      idTeam: team.id
    }
    deleteTeamSeason(paramsDeleteTeamSeason)
      .then(response => {
        
        const teamSeasonToRemove: ITeamSeason = {
          idTeam: response.data.teamId,
          idLeagueSeason: response.data.seasonId,
        }
        
        dispatch(removeTeamSeason(teamSeasonToRemove));
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
    setOpenAddPlayerToTeam(true);
    setOpenViewTeamPlayers(false);
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
    setCurrentTeamView(null);
  }
  const cbCloseAddTeamPlayer = () => {
    setOpenAddPlayerToTeam(false);
    setCurrentTeamView(null);
  }
  const cbCloseModalDelete = () => {
    setOpenConfirmDeleteTeam(false);
    setCurrentTeamView(null);
  }
  const cbCloseConfirmDelete = () => {
    if( currentTeamView ){
      confirmDeleteTeam(currentTeamView);
    }
    setOpenConfirmDeleteTeam(false);
    setCurrentTeamView(null);
  }

  const htmlTeams = ( filteredTeams.length > 0 ? (
    <Box p={3} width="100%">
      <Grid container spacing={3} flexWrap="wrap"
        sx={{
          flexDirection:{xs:"column", sm:"row"}
        }}
      >
        { filteredTeams.map((team: ITeam, index:number) => {
          let listActions = [];
          let actionLabel=`${team.name} Profile`;
          listActions.push(
            <Tooltip title={actionLabel} key={`action-view-team-${team.id}`}>
              <IconButton color="primary"
                aria-label={actionLabel}
                href={`${quickLinkTeam.link}/${team.id}`}
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
        <Typography variant="h2">{currentLeagueSeasonName} Teams</Typography>
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
          warning={`The '${currentTeamView.name}' players will also be removed for this season`}
          title={`Confirm team delete`}
          description={`Are-you sure you want to delete the team '${currentTeamView.name}' for the current season?`}
          />
      ) }
    </Paper>
  )
}
export default ListTeams;