import { useEffect, useState } from "react";

import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { IAllTeamsStandingProps, IStandingTeam }  from '../Interfaces/team'

import { IApiFetchStandingTeamsParams, fetchStandingTeams } from "../ApiCall/teams";

import LoaderInfo from "../Generic/LoaderInfo";

import { getTeamName } from '../utils/dataAssociation'
import { sxGroupStyles } from '../utils/theme';
import { usePublicContext } from "../Public/PublicApp";

function AllTeamsStanding(props: IAllTeamsStandingProps){

  const {teams} = props;
  
  const { isAdmin, leagueSeason } = usePublicContext();

  const [standingTeams, setStandingTeams] = useState<IStandingTeam[] | null>(null);
  const [apiError, changeApiError] = useState("");

  const isLoaded = standingTeams !== null;

  useEffect(() => {
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: teams.map((team) => team.id) || [0],
      seasonId: leagueSeason.id
    }
    fetchStandingTeams(paramsFetchStandingTeams)
      .then(response => {
        const newStandingTeams: IStandingTeam[] = response.data;
        newStandingTeams.sort((a,b) => b.nbWins - a.nbWins || a.nbGamePlayed - b.nbGamePlayed );
        setStandingTeams(newStandingTeams);
      })
      .catch(error => {
        changeApiError(error);
      })
      .finally(() => {
        
      });
  },[leagueSeason.id, teams])

  return (
    <>
      <LoaderInfo
        isLoading={isLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      {isLoaded && (
        <Paper component={Box} m={3} p={1}>
          <Stack spacing={3} alignItems="center" pb={3} >
            <Typography variant="h1" align="center">
              Teams Standing
            </Typography>
            <TableContainer component={Paper} sx={sxGroupStyles.tableContainerSmallest}>
              <Table size="small" aria-label="League team standing">
                <TableHead>
                  <TableRow>
                    <TableCell>Team</TableCell>
                    <TableCell align="center">GP</TableCell>
                    <TableCell align="center">W</TableCell>
                    <TableCell align="center">L</TableCell>
                    <TableCell align="center">N</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standingTeams.map((standingTeam) => {
                    const teamName = getTeamName(standingTeam.id, teams);
                    return (
                      <TableRow key={`team-standing-${standingTeam.id}`}>
                        <TableCell><Link href={`/team/${standingTeam.id}`}>{teamName}</Link></TableCell>
                        <TableCell align="center">{standingTeam.nbGamePlayed}</TableCell>
                        <TableCell align="center">{standingTeam.nbWins}</TableCell>
                        <TableCell align="center">{standingTeam.nbLosts}</TableCell>
                        <TableCell align="center">{standingTeam.nbNulls}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Paper>
      )}
    </>
  )
}

export default AllTeamsStanding;