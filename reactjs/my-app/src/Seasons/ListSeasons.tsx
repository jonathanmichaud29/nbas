import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { Alert, Box, Card, CardActions, CardHeader, Grid, IconButton, Paper, Stack, Tooltip, Typography  } from "@mui/material";
import { Delete } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { AppDispatch, RootState } from "../redux/store";
import { addLeagueSeasons, removeLeagueSeason } from "../redux/leagueSeasonSlice";

import { 
  deleteLeagueSeason, fetchLeagueSeasons, 
  IApiDeleteLeagueSeasonParams, IApiFetchLeagueSeasonsParams
} from '../ApiCall/seasons'

import { ILeagueSeasonProps } from '../Interfaces/season';
import { ILeagueSeason } from '../Interfaces/league';

import ConfirmDelete from "../Modals/ConfirmDelete";

import InfoDialog from '../Generic/InfoDialog';
import LoaderInfo from '../Generic/LoaderInfo';

function ListSeasons(props: ILeagueSeasonProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { isAdmin } = props;

  const [apiError, changeApiError] = useState<string>("");
  const [apiSuccess, changeApiSuccess] = useState<string>("");
  
  const listLeagueSeasons = useSelector((state: RootState) => state.leagueSeasons )

  const orderedSeasons = [...listLeagueSeasons]
  orderedSeasons.sort((a:ILeagueSeason, b:ILeagueSeason) => b.id - a.id);
  
  const reinitializeApiMessages = () => {
    changeApiError('');
    changeApiSuccess('');
  }

  const confirmDeleteLeagueSeason = (leagueSeason: ILeagueSeason) => {
    reinitializeApiMessages()

    const paramsDeleteLeagueSeason: IApiDeleteLeagueSeasonParams = {
      idSeason: leagueSeason.id
    }
    deleteLeagueSeason(paramsDeleteLeagueSeason)
      .then(response => {
        dispatch(removeLeagueSeason(response.data.id));
        changeApiSuccess(response.message)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {

      });
  }
  
  useMemo(() => {
    const paramsFetchLeagueSeasons: IApiFetchLeagueSeasonsParams = {
      
    }
    fetchLeagueSeasons(paramsFetchLeagueSeasons)
      .then(response => {
        dispatch(addLeagueSeasons(response.data));
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [dispatch]);

  /**
   * Handle multiples modals
   */
  const [currentLeagueSeasonView, setCurrentLeagueSeasonView] = useState<ILeagueSeason | null>(null);
  const [isModalOpenConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleOpenConfirmDelete = (leagueSeason: ILeagueSeason) => {
    setCurrentLeagueSeasonView(leagueSeason);
    setOpenConfirmDelete(true);
  }
  
  const cbCloseModalDelete = () => {
    setOpenConfirmDelete(false);
  }
  const cbCloseConfirmDelete = () => {
    if( currentLeagueSeasonView ){
      confirmDeleteLeagueSeason(currentLeagueSeasonView);
      setCurrentLeagueSeasonView(null);
    }
    setOpenConfirmDelete(false);
  }

  
  const htmlSeasons = ( orderedSeasons && orderedSeasons.length > 0 ? (
    <Box p={3} width="100%">
      <Grid container spacing={3} flexWrap="wrap"
        sx={{
          flexDirection:{xs:"column", sm:"row"}
        }}
      >
        { orderedSeasons.map((leagueSeason: ILeagueSeason) => {
          let listActions = [];
          let actionLabel=`${leagueSeason.name} Profile`;
          
          if( isAdmin ) {
            actionLabel=`Delete Season ${leagueSeason.name}`
            listActions.push(
              <Tooltip title={actionLabel} key={`action-delete-leagueSeason-${leagueSeason.id}`}>
                <IconButton color="primary"
                  key={`action-delete-leagueSeason-${leagueSeason.id}`}
                  aria-label={actionLabel}
                  onClick={ () => handleOpenConfirmDelete(leagueSeason) }
                  >
                  <Delete />
                </IconButton>
              </Tooltip>
              
            )
          }
          return (
            <Grid item 
              key={`league-season-row-${leagueSeason.id}`} 
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
                  title={leagueSeason.name}
                  titleTypographyProps={{variant:'h6'}}
                />
                <CardActions 
                  sx={{
                    justifyContent:'center'
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
    <Alert severity='info'>{ 'No season found in this league'}</Alert>
  ));
  
  return (
    <Paper component={Box} p={3} m={3}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h2">League Seasons</Typography>
        
        <LoaderInfo
          msgError={apiError}
        />
        { apiSuccess && (
          <InfoDialog
            msgSuccess={apiSuccess}
          />
        )}
        
        { htmlSeasons }

        { currentLeagueSeasonView && isAdmin && (
          <ConfirmDelete
            isOpen={isModalOpenConfirmDelete}
            callbackCloseModal={cbCloseModalDelete}
            callbackConfirmDelete={cbCloseConfirmDelete}
            title={`Confirm League Season deletion`}
            description={`Are-you sure you want to delete the ${currentLeagueSeasonView.year} season '${currentLeagueSeasonView.name}'?`}
            />
        ) }
      </Stack>
    </Paper>
  )
}
export default ListSeasons;