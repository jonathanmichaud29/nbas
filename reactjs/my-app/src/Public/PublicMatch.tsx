import { useState, useMemo } from 'react';
import { useParams} from 'react-router-dom'
import { batch } from 'react-redux';

import { Alert } from '@mui/material';

import { usePublicContext } from './PublicApp';

import { IMatch, IMatchEncounter, IMatchLineup } from "../Interfaces/match";
import { ITeam } from '../Interfaces/team';

import { fetchMatches, fetchMatchLineups, IApiFetchMatchesParams, IApiFetchMatchLineups } from '../ApiCall/matches';

import Breadcrumb from '../Menu/Breadcrumb';
import PublicMenu from '../Menu/PublicMenu';
import ViewMatchDetails from '../Matchs/ViewMatchDetails';
import LoaderInfo from '../Generic/LoaderInfo';

import { castNumber } from '../utils/castValues';
import { setMetas } from '../utils/metaTags';

function PublicMatch() {
  let { id } = useParams();
  const idMatch = castNumber(id);

  const { league, leagueSeason, leaguePlayers, leagueSeasonTeams } = usePublicContext();
  
  const [apiError, changeApiError] = useState("");
  const [matchEncounter, setMatchEncounter] = useState<IMatchEncounter | null>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  
  /**
   * Fetch Match details
   */
  useMemo( () => {
    let newError: string = ''
    let matchData: IMatch;
    let teamHomeData: ITeam;
    let teamAwayData: ITeam;
    let matchLineups: IMatchLineup[] = [];
    const paramsFetchMatches: IApiFetchMatchesParams = {
      matchIds: [idMatch]
    }
    const paramsMatchLineups: IApiFetchMatchLineups = {
      matchId: idMatch
    }
    Promise.all([
      fetchMatches(paramsFetchMatches),
      fetchMatchLineups(paramsMatchLineups)
    ])
      .catch((error) => {
        newError = error;
      })
      .then((values) => {
        if( ! values ) return;
        matchData = values[0].data[0];
        leagueSeasonTeams.forEach((team: ITeam) => {
          if ( team.id === matchData.idTeamHome) {
            teamHomeData = team;
          }
          else if (team.id === matchData.idTeamAway) {
            teamAwayData = team
          }
        })

        matchLineups = values[1].data; 
      })
      .finally(() => {
        batch(() => {
          changeApiError(newError);
          
          setMatchEncounter({
            match: matchData,
            teamHome: teamHomeData,
            teamAway: teamAwayData,
            players: leaguePlayers,
            matchLineups: matchLineups
          })
          setDataLoaded(true);
        })
      })
  }, [idMatch, leaguePlayers, leagueSeasonTeams]);

  useMemo(() => {
    if( matchEncounter === null) return;

    setMetas({
      title:`Match #${idMatch} - ${matchEncounter.teamHome.name} receives ${matchEncounter.teamAway.name} - ${league.name} ${leagueSeason.name}`,
      description:`Match details about ${matchEncounter.teamHome.name} receives ${matchEncounter.teamAway.name}, it included the teams standing and batting stats for this encounter`
    });
  }, [idMatch, league.name, leagueSeason.name, matchEncounter])

  return (
    <>
      <PublicMenu />
      <Breadcrumb />
      
      <LoaderInfo
        isLoading={dataLoaded}
        msgError={apiError}
        hasWrapper={true}
      />
      { matchEncounter !== null ? (
        <ViewMatchDetails 
          matchEncounter={matchEncounter}
        />
      ) : (
        <Alert severity='info'>There is no match details</Alert>
      ) }
    </>
  )
}
export default PublicMatch;