import { useEffect, useState } from "react";
import { batch } from "react-redux";

import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { usePublicContext } from "../Public/PublicApp";

import { IAllTeamsStandingProps, IStandingTeam }  from '../Interfaces/team'

import { IApiFetchStandingTeamsParams, fetchStandingTeams } from "../ApiCall/teams";

import LoaderInfo from "../Generic/LoaderInfo";

import { getTeamName } from '../utils/dataAssociation'
import { sxGroupStyles } from '../utils/theme';
import { quickLinkTeam } from '../utils/constants';


function AllTeamsStanding(props: IAllTeamsStandingProps){

  const { teams } = props;
  
  const { league, leagueSeason } = usePublicContext();

  const [standingTeams, setStandingTeams] = useState<IStandingTeam[]>([]);
  const [apiError, changeApiError] = useState<string>("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    let newError: string = '';
    let newStandingTeams: IStandingTeam[] = [];

    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: teams.map((team) => team.id) || [0],
      seasonId: leagueSeason.id
    }
    fetchStandingTeams(paramsFetchStandingTeams)
      .then(response => {
        newStandingTeams = response.data;
        newStandingTeams.sort((a,b) => b.nbWins - a.nbWins || a.nbGamePlayed - b.nbGamePlayed );
      })
      .catch(error => {
        newError = error;
      })
      .finally(() => {
        batch(() => {
          setStandingTeams(newStandingTeams);
          changeApiError(newError);
          setDataLoaded(true);
        })
      });
  },[leagueSeason.id, teams])

  return (
    <>
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      {dataLoaded ? (
        <Paper component={Box} m={3} p={1}>
          <Stack spacing={3} alignItems="center" pb={3} >
            <Box>
              <Typography variant="h1" align="center">Teams Standing</Typography>
              <Typography variant="subtitle1" align="center">{league.name} - {leagueSeason.name}</Typography>
            </Box>
            { standingTeams.length ? (
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
                          <TableCell><Link href={`${quickLinkTeam.link}/${standingTeam.id}`}>{teamName}</Link></TableCell>
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
            ) : (
              <LoaderInfo
                msgWarning="There is no teams for the current league and/or season"
              />
            ) }
          </Stack>
        </Paper>
      ) : ''}
    </>
  )
}

export default AllTeamsStanding;