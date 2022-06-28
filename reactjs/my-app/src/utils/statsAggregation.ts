import { IMatchLineup } from '../Interfaces/match';
import { IPlayerStatsExtended } from '../Interfaces/stats'

export const getStatHits = (single: number, double: number, triple: number, homerun: number) => {
  return single + double + triple + homerun;
}

export const getStatIndexHits = (index: number, single: Array<number>, double: Array<number>, triple: Array<number>, homerun: Array<number>) => {
  return single[index] + double[index] + triple[index] + homerun[index];
}

export const getStatSlugging = (single: number, double: number, triple: number, homerun: number) => {
  return single + 
    ( ( double + 1) * 2 ) - 2 +
    ( ( triple + 1) * 3 ) - 3 + 
    ( ( homerun + 1) * 4 ) - 4;
}
export const getStatIndexSlugging = (index: number, single: Array<number>, double: Array<number>, triple: Array<number>, homerun: Array<number>) => {
  return single[index] + 
    ( ( double[index] + 1) * 2 ) - 2 +
    ( ( triple[index] + 1) * 3 ) - 3 + 
    ( ( homerun[index] + 1) * 4 ) - 4;
}

export const getCombinedPlayersStats = (matchLineups: IMatchLineup[]) => {
  let playersStats = [] as IPlayerStatsExtended[];
  
  matchLineups.forEach((matchLineup) => {
    let playerFound = playersStats.find((playerStats) => playerStats.id === matchLineup.idPlayer )
    if( playerFound === undefined ){
      playersStats.push({
        id: matchLineup.idPlayer,
        atBats: matchLineup.atBats,
        single: matchLineup.single,
        double: matchLineup.double,
        triple: matchLineup.triple,
        homerun: matchLineup.homerun,
        out: matchLineup.out,
        sluggingPercentage: 0,
        battingAverage: 0,
      });
    }
    else {
      playerFound.atBats += matchLineup.atBats;
      playerFound.single += matchLineup.single;
      playerFound.double += matchLineup.double;
      playerFound.triple += matchLineup.triple;
      playerFound.homerun += matchLineup.homerun;
      playerFound.out += matchLineup.out;
    }
  })
  
  setExtendedPlayersStats(playersStats);

  return playersStats;
}

export const setExtendedPlayersStats = (listPlayersStats: IPlayerStatsExtended[]) => {
  listPlayersStats.every((playerStats) => {
    const nbHits = getStatHits(playerStats.single, playerStats.double, playerStats.triple, playerStats.homerun);
    const sluggingTotal = getStatSlugging(playerStats.single, playerStats.double, playerStats.triple, playerStats.homerun);
    playerStats.battingAverage = ( nbHits / playerStats.atBats);
    playerStats.sluggingPercentage = ( sluggingTotal / playerStats.atBats);
    if( isNaN(playerStats.battingAverage) ) {
      playerStats.battingAverage = 0;
    }
    else {
      playerStats.battingAverage = (Math.round(playerStats.battingAverage * 1000) / 1000);
    }
    if( isNaN(playerStats.sluggingPercentage) ) {
      playerStats.sluggingPercentage = 0;
    }
    else {
      playerStats.sluggingPercentage = (Math.round(playerStats.sluggingPercentage * 1000) / 1000);
    }
    return true;
  })
}