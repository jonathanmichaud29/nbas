import { useEffect, useState } from 'react';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material'

import { IAllTeamsStatsProps } from '../Interfaces/team'
import { IBattingStatsExtended } from '../Interfaces/stats';
import { IMatchLineup } from '../Interfaces/match';

import { IApiFetchMatchLineups, fetchMatchLineups } from '../ApiCall/matches';

import LoaderInfo from '../Generic/LoaderInfo';
import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getTeamName } from '../utils/dataAssociation'
import { getCombinedTeamsStats } from '../utils/statsAggregation';

function AllTeamsStats(props: IAllTeamsStatsProps) {

  const {teams} = props;

  const [matchesLineups, setMatchesLineups] = useState<IMatchLineup[] | null>(null);
  const [allTeamsStats, setAllTeamsStats] = useState<IBattingStatsExtended[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = allTeamsStats !== null;

  /**
   * Fetch Matches Lineups
   */
  useEffect( () => {
    
    const paramsMatchLineups: IApiFetchMatchLineups = {
      teamIds: teams.map((team) => team.id),
    }
    fetchMatchLineups(paramsMatchLineups)
      .then(response => {
        setMatchesLineups(response.data)
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  }, [teams]);

  useEffect(() => {
    if(  matchesLineups === null ) return;

    const teamsStats = getCombinedTeamsStats(matchesLineups);
    setAllTeamsStats(teamsStats);

  }, [matchesLineups, teams]);

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { isLoaded && (
        <Paper component={Box} p={1} pt={3} pb={3} m={3}>
          <Stack alignItems="center" spacing={3}>
            <Typography variant="h2">
              Teams Batting Stats
            </Typography>
            <Grid 
              container 
              direction="row"
              wrap="wrap"
              alignItems="center"
              justifyContent="center"
              rowSpacing={5}
            >
              { isLoaded && allTeamsStats.map((teamStats, index) => {
                const teamName = getTeamName(teamStats.id, teams);
                return (
                  <Grid item 
                    key={`wrap-team-stats-${teamStats.id}`}
                    xs={12} sm={6} md={3}
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}
                  >
                    <Stack spacing={3} alignItems="center" sx={{width:'100%'}}>
                      <Typography variant="h6" component="h3">
                        {teamName}
                      </Typography>
                      <StatBatResults
                        single={teamStats.single}
                        double={teamStats.double}
                        triple={teamStats.triple}
                        homerun={teamStats.homerun}
                        out={teamStats.out}
                      />
                      <StatBattingPercentage
                        stats={[teamStats]}
                        columns={["Season stats"]}
                      />
                    </Stack>
                  </Grid>
                )
              })}
            </Grid>
          </Stack>
        </Paper>
      )}
    </>
  )
}

export default AllTeamsStats;