import { useEffect, useState } from "react";
import { batch } from "react-redux";

import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

import { usePublicContext } from "../Public/PublicApp";

import { IStandingTeam, ITeam, defaultStandingTeam }  from '../Interfaces/team'

import { IApiFetchStandingTeamsParams, fetchStandingTeams } from "../ApiCall/teams";

import LoaderInfo from "../Generic/LoaderInfo";

import { getTeamName } from '../utils/dataAssociation'
import { sxGroupStyles } from '../utils/theme';
import { quickLinkTeam } from '../utils/constants';
import { replaceSeasonLink } from "../utils/linksGenerator";

interface IAllTeamsStandingProps {
  /* standingTeams: IStandingTeam[]; */
  teams: ITeam[];
}

function AllTeamsStanding(props: IAllTeamsStandingProps){

  const { teams } = props;
  
  const { league, leagueSeason } = usePublicContext();

  const [standingTeams, setStandingTeams] = useState<IStandingTeam[]>([]);
  const [apiError, changeApiError] = useState<string>("");
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    let newError: string = '';
    let newStandingTeams: IStandingTeam[] = [];
    const listTeamIds = teams.map((team) => team.id);
    const paramsFetchStandingTeams: IApiFetchStandingTeamsParams = {
      teamIds: listTeamIds || [0],
      seasonId: leagueSeason.id
    }
    fetchStandingTeams(paramsFetchStandingTeams)
      .then(response => {
        newStandingTeams = response.data;
        if( newStandingTeams.length < teams.length ){
          newStandingTeams = teams.map((team) => {
            const standingTeam = newStandingTeams.find((standingTeam) => standingTeam.id === team.id) || null
            if( standingTeam !== null ){
              return standingTeam;
            }
            else {
              return {...defaultStandingTeam, id:team.id}
            }
            
          })
        }
        newStandingTeams.sort((a,b) => b.nbWins - a.nbWins || b.nbGamePlayed - a.nbGamePlayed );
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
                      const linkTeamDetails = replaceSeasonLink(quickLinkTeam.link, leagueSeason.id.toString());
                      // const linkTeamDetails = `${quickLinkTeam.link}/${standingTeam.id}`.replace(':idSeason', leagueSeason.id.toString())
                      return (
                        <TableRow key={`team-standing-${standingTeam.id}`}>
                          <TableCell><Link href={linkTeamDetails}>{teamName}</Link></TableCell>
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