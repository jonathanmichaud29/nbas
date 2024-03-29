import { Paper, Link, Typography, Stack } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography";

import { ITeam, IStandingTeam } from '../Interfaces/team';
import { IMatch } from '../Interfaces/match';

import { createHumanDate } from '../utils/dateFormatter'
import { sxGroupStyles } from '../utils/theme';
import { quickLinkMatch, quickLinkTeam } from "../utils/constants";
import { replaceSeasonLink } from "../utils/linksGenerator";

interface IScoreboardProps {
  teamHome:       ITeam;
  teamAway:       ITeam;
  match:          IMatch;
  standingTeams?: IStandingTeam[];
  hasLinkMatchDetails?:boolean;
  titleLevel?:    Variant;
}

function Scoreboard(props: IScoreboardProps) {

  const {titleLevel, teamHome, teamAway, match, standingTeams, hasLinkMatchDetails} = props;

  const dateReadable = match !== null ? createHumanDate(match.date) : '';
  const tableTitle = `${teamHome.name} receives ${teamAway.name}`;
  const teamHomeStanding = standingTeams && standingTeams.find((standingTeam) => standingTeam.id === teamHome.id)
  const teamAwayStanding = standingTeams && standingTeams.find((standingTeam) => standingTeam.id === teamAway.id)

  const isTeamStandings = standingTeams && teamHomeStanding && teamAwayStanding;
  
  const seasonId = match.idSeason.toString();
  // const linkMatchDetails = quickLinkMatch.link.replace(':idSeason', match.idSeason.toString()) + '/' + match.id;
  const linkMatchDetails = replaceSeasonLink(quickLinkMatch.link, seasonId) + `/${match.id}`;
  // const baseLinkTeamDetails = quickLinkTeam.link.replace(':idSeason', match.idSeason.toString()) + '/';
  const baseLinkTeamDetails = replaceSeasonLink(quickLinkTeam.link, seasonId);

  return (
    
    <Stack alignItems="center" spacing={1} sx={{width:'100%'}}>
      <Typography variant={titleLevel || 'h6'} textAlign='center'>
        {hasLinkMatchDetails ? (
        <Link href={linkMatchDetails}>{teamHome.name}<br/>Receives<br/>{teamAway.name}</Link>
        ) : (
          `${teamHome.name} Receives ${teamAway.name}`
        ) }
      </Typography>
      <Typography variant="subtitle1">{dateReadable}</Typography>
      
      <TableContainer component={Paper} sx={sxGroupStyles.tableContainerSmallest}>
        <Table size="small" aria-label={tableTitle}>
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              { match.isCompleted === 1 && <TableCell align="center">Points</TableCell> }
              { isTeamStandings && (
                <>
                  <TableCell align="center">W</TableCell> 
                  <TableCell align="center">L</TableCell>
                  <TableCell align="center">N</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><Link href={`${baseLinkTeamDetails}${teamHome.id}`}>{teamHome.name}</Link></TableCell>
              { match.isCompleted === 1 && (
                <TableCell align="center">{match.teamHomePoints}</TableCell> 
              )}
              { isTeamStandings && (
                <>
                  <TableCell align="center">{teamHomeStanding.nbWins}</TableCell>
                  <TableCell align="center">{teamHomeStanding.nbLosts}</TableCell>
                  <TableCell align="center">{teamHomeStanding.nbNulls}</TableCell>
                </>
              )}
            </TableRow>
            <TableRow>
            <TableCell><Link href={`${baseLinkTeamDetails}${teamAway.id}`}>{teamAway.name}</Link></TableCell>
              { match.isCompleted === 1 && (
                <TableCell align="center">{match.teamAwayPoints}</TableCell> 
              )}
              { isTeamStandings && (
                <>
                  <TableCell align="center">{teamAwayStanding.nbWins}</TableCell>
                  <TableCell align="center">{teamAwayStanding.nbLosts}</TableCell>
                  <TableCell align="center">{teamAwayStanding.nbNulls}</TableCell>
                </>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default Scoreboard;