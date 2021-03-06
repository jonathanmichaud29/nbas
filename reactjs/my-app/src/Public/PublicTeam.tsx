import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { Alert, Box, CircularProgress  } from "@mui/material";

import { ITeam } from "../Interfaces/team";

import { fetchTeams, IApiFetchTeamsParams } from '../ApiCall/teams';

import ViewTeamProfile from '../Teams/ViewTeamProfile';
import { setMetas } from '../utils/metaTags';

function PublicTeam() {
  let { id } = useParams();
  const idTeam = id ? parseInt(id, 10) : null;

  const [team, setTeam] = useState<ITeam | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = team !== null;

  if( isLoaded ){
    setMetas({
      title:`${team.name} Team profile`,
      description:`NBAS ${team.name} team profile that included its standing, batting stats and each match summary played this season`
    });
  }
  
  /**
   * Fetch Match details
   */
  useEffect( () => {
    if ( idTeam === null ) return;

    const paramsFetchTeams: IApiFetchTeamsParams = {
      teamIds: [idTeam]
    }
    fetchTeams(paramsFetchTeams)
      .then(response => {
        setTeam(response.data[0])
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [idTeam]);

  return (
    <Box p={3}>
      { ! isLoaded && <Box><CircularProgress /></Box>}
      { apiError && <Alert severity="error">{apiError}</Alert> }
      { team && (
        <ViewTeamProfile 
          team={team}
        />
      ) }
    </Box>
  )
}
export default PublicTeam;