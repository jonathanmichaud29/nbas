import { useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material'

import { IAllTeamsStatsProps } from '../Interfaces/team'
import { ITeamStats } from '../Interfaces/stats';

import StatBatResults from '../Stats/StatBatResults';
import StatBattingPercentage from '../Stats/StatBattingPercentage';

import { getTeamName } from '../utils/dataAssociation'

const wrapChart = {position: "relative", width:"100%", height:"300px"};

function AllTeamsStats(props: IAllTeamsStatsProps) {

  const {teams, matchesLineups} = props;

  const [allTeamsStats, setAllTeamsStats] = useState<ITeamStats[] | null>(null);

  const isLoaded = allTeamsStats !== null;

  useEffect(() => {
    if( allTeamsStats !== null ) return;

    let teamsStats = [] as ITeamStats[];
    teams.forEach((team) => {
      let teamStats: ITeamStats = {
        id: team.id,
        atBats: 0,
        single: 0,
        double: 0,
        triple: 0,
        homerun: 0,
        out: 0,
      };
      matchesLineups.filter((matchLineup) => matchLineup.idTeam === team.id).forEach((matchLineup) => {
        teamStats.atBats += matchLineup.atBats;
        teamStats.single += matchLineup.single;
        teamStats.double += matchLineup.double;
        teamStats.triple += matchLineup.triple;
        teamStats.homerun += matchLineup.homerun;
        teamStats.out += matchLineup.out;
      })
      teamsStats.push(teamStats);
    })
    setAllTeamsStats(teamsStats);
  }, [allTeamsStats, matchesLineups, teams]);

  const bgColors = [
    "blue",
    "beige",
    "red",
    "green"
  ]


  return (
    <Grid 
      container 
      /* spacing={4} */
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
              <Grid item  style={{width:'100%'}}>
                
                <StatBatResults
                  single={teamStats.single}
                  double={teamStats.double}
                  triple={teamStats.triple}
                  homerun={teamStats.homerun}
                  out={teamStats.out}
                />
              </Grid>
              <Grid item style={{width:'100%'}}>
                <StatBattingPercentage
                  single={[teamStats.single]}
                  double={[teamStats.double]}
                  triple={[teamStats.triple]}
                  homerun={[teamStats.homerun]}
                  atBats={[teamStats.atBats]}
                  columns={["year long stats"]}
                />
              </Grid>
            </Grid>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default AllTeamsStats;