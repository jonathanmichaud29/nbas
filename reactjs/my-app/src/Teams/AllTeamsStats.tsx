import { useEffect, useState } from 'react';

import { Box, Card, CardContent, Grid, Typography } from '@mui/material'

import { IAllTeamsStatsProps } from '../Interfaces/team'
import { IBattingStatsExtended } from '../Interfaces/stats';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getTeamName } from '../utils/dataAssociation'
import { getCombinedTeamsStats } from '../utils/statsAggregation';

function AllTeamsStats(props: IAllTeamsStatsProps) {

  const {teams, matchesLineups} = props;

  const [allTeamsStats, setAllTeamsStats] = useState<IBattingStatsExtended[] | null>(null);

  const isLoaded = allTeamsStats !== null;

  useEffect(() => {
    if( allTeamsStats !== null ) return;

    const teamsStats = getCombinedTeamsStats(matchesLineups);
    setAllTeamsStats(teamsStats);

  }, [allTeamsStats, matchesLineups, teams]);

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Grid container>
            <Grid item xs={12} style={{width:'100%'}}>
              <Typography component="h1" variant="h3" align="center">
                Teams Batting Stats
              </Typography>
            </Grid>
            <Grid item xs={12} style={{width:'100%'}}>
              <Grid 
                container 
                direction="row"
                wrap="wrap"
                alignItems="center"
                justifyContent="center"
                style={{margin:"40px 0px"}}
              >
                { isLoaded && allTeamsStats.map((teamStats, index) => {
                  const teamName = getTeamName(teamStats.id, teams);
                  return (
                    <Grid item key={`wrap-team-stats-${teamStats.id}`}
                      md={3}
                      sm={6}
                      xs={12}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography variant="h6" component="h4" align="center">
                        {teamName}
                      </Typography>
                      <Grid container direction="column">
                        <Grid item  style={{width:'100%'}} pb={3}>
                          <StatBatResults
                            single={teamStats.single}
                            double={teamStats.double}
                            triple={teamStats.triple}
                            homerun={teamStats.homerun}
                            out={teamStats.out}
                          />
                        </Grid>
                        <Grid item style={{width:'100%'}}  pb={3}>
                          <StatBattingPercentage
                            stats={[teamStats]}
                            columns={["Season stats"]}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AllTeamsStats;