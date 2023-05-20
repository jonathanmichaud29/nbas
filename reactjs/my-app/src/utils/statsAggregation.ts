import { EBatResult, IMatchLineup, IPlayerBatResult } from '../Interfaces/match';
import { IPlayer } from '../Interfaces/player';
import { defaultBattingStatsExtended, defaultPlayerLineupStats, IBattingStatsExtended, IPlayerLineupStats } from '../Interfaces/stats'
import { getPlayerName } from './dataAssociation';

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
  let playersStats = [] as IBattingStatsExtended[];
  
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
        walk: matchLineup.walk,
        hitByPitch: matchLineup.hitByPitch,
        sacrificeFly: matchLineup.sacrificeFly,
        sluggingPercentage: 0,
        battingAverage: 0,
        onBasePercentage: 0,
        onBaseSluggingPercentage: 0,
        runsBattedIn: matchLineup.runsBattedIn,
        plateAppearance: matchLineup.plateAppearance,
      });
    }
    else {
      playerFound.atBats += matchLineup.atBats;
      playerFound.single += matchLineup.single;
      playerFound.double += matchLineup.double;
      playerFound.triple += matchLineup.triple;
      playerFound.homerun += matchLineup.homerun;
      playerFound.out += matchLineup.out;
      playerFound.walk += matchLineup.walk;
      playerFound.hitByPitch += matchLineup.hitByPitch;
      playerFound.sacrificeFly += matchLineup.sacrificeFly;
      playerFound.runsBattedIn += matchLineup.runsBattedIn;
      playerFound.plateAppearance += matchLineup.plateAppearance;
    }
  })
  
  setExtendedStats(playersStats);

  return playersStats;
}

export const getCombinedTeamsStats = (matchLineups: IMatchLineup[]) => {
  let teamsStats = [] as IBattingStatsExtended[];
  
  matchLineups.forEach((matchLineup) => {
    let teamFound = teamsStats.find((teamStats) => teamStats.id === matchLineup.idTeam )
    if( teamFound === undefined ){
      teamsStats.push({
        id: matchLineup.idTeam,
        atBats: matchLineup.atBats,
        single: matchLineup.single,
        double: matchLineup.double,
        triple: matchLineup.triple,
        homerun: matchLineup.homerun,
        out: matchLineup.out,
        walk: matchLineup.walk,
        hitByPitch: matchLineup.hitByPitch,
        sacrificeFly: matchLineup.sacrificeFly,
        sluggingPercentage: 0,
        battingAverage: 0,
        onBasePercentage: 0,
        onBaseSluggingPercentage: 0,
        runsBattedIn: 0,
        plateAppearance: matchLineup.plateAppearance,
      });
    }
    else {
      teamFound.atBats += matchLineup.atBats;
      teamFound.single += matchLineup.single;
      teamFound.double += matchLineup.double;
      teamFound.triple += matchLineup.triple;
      teamFound.homerun += matchLineup.homerun;
      teamFound.out += matchLineup.out;
      teamFound.walk += matchLineup.walk;
      teamFound.hitByPitch += matchLineup.hitByPitch;
      teamFound.sacrificeFly += matchLineup.sacrificeFly;
      teamFound.runsBattedIn += matchLineup.runsBattedIn;
      teamFound.plateAppearance += matchLineup.plateAppearance;
    }
  })
  
  setExtendedStats(teamsStats);

  return teamsStats;
}

export const getCombinedStats = (matchLineups: IMatchLineup[]) => {
  let stats: IBattingStatsExtended = {...defaultBattingStatsExtended};
  
  matchLineups.forEach((matchLineup) => {
    stats.atBats += matchLineup.atBats;
    stats.single += matchLineup.single;
    stats.double += matchLineup.double;
    stats.triple += matchLineup.triple;
    stats.homerun += matchLineup.homerun;
    stats.out += matchLineup.out;
    stats.walk += matchLineup.walk;
    stats.hitByPitch += matchLineup.hitByPitch;
    stats.sacrificeFly += matchLineup.sacrificeFly;
    stats.runsBattedIn += matchLineup.runsBattedIn;
    stats.plateAppearance += matchLineup.plateAppearance;
  });


  setExtendedStats([stats]);

  return stats;
}

export const getAverageBattingStats = (battingStats: IBattingStatsExtended[], nbEntities: number) => {
  let stats: IBattingStatsExtended = {...defaultBattingStatsExtended};

  battingStats.forEach((battingStat) => {
    stats.battingAverage += battingStat.battingAverage;
    stats.onBasePercentage += battingStat.onBasePercentage;
    stats.onBaseSluggingPercentage += battingStat.onBaseSluggingPercentage;
    stats.sluggingPercentage += battingStat.sluggingPercentage;
  })
  stats.battingAverage = stats.battingAverage / nbEntities;
  stats.onBasePercentage = stats.onBasePercentage / nbEntities;
  stats.onBaseSluggingPercentage = stats.onBaseSluggingPercentage / nbEntities;
  stats.sluggingPercentage = stats.sluggingPercentage / nbEntities;

  return stats;
}

export const setExtendedStats = (listPlayersStats: IBattingStatsExtended[]) => {
  listPlayersStats.every((playerStats) => {
    const nbHits = getStatHits(playerStats.single, playerStats.double, playerStats.triple, playerStats.homerun);
    const sluggingTotal = getStatSlugging(playerStats.single, playerStats.double, playerStats.triple, playerStats.homerun);

    // Batting Average
    playerStats.battingAverage = ( nbHits / playerStats.atBats);
    if( isNaN(playerStats.battingAverage) ) {
      playerStats.battingAverage = 0;
    }
    else {
      playerStats.battingAverage = (Math.round(playerStats.battingAverage * 1000) / 1000);
    }

    // Slugging Percentage
    playerStats.sluggingPercentage = ( sluggingTotal / playerStats.atBats);
    if( isNaN(playerStats.sluggingPercentage) ) {
      playerStats.sluggingPercentage = 0;
    }
    else {
      playerStats.sluggingPercentage = (Math.round(playerStats.sluggingPercentage * 1000) / 1000);
    }

    // On Base Percentage
    playerStats.onBasePercentage = (nbHits + playerStats.walk + playerStats.hitByPitch) / ( playerStats.atBats + playerStats.walk + playerStats.hitByPitch + playerStats.sacrificeFly);
    if( isNaN(playerStats.onBasePercentage) ) {
      playerStats.onBasePercentage = 0;
    }
    else {
      playerStats.onBasePercentage = (Math.round(playerStats.onBasePercentage * 1000) / 1000);
    }

    // On Base Slugging Percentage
    playerStats.onBaseSluggingPercentage = playerStats.onBasePercentage + playerStats.sluggingPercentage;
    if( isNaN(playerStats.onBaseSluggingPercentage) ) {
      playerStats.onBaseSluggingPercentage = 0;
    }
    else {
      playerStats.onBaseSluggingPercentage = (Math.round(playerStats.onBaseSluggingPercentage * 1000) / 1000);
    }

    return true;
  })
}

export const groupBatResultsPerLineup = (playerBatResults: IPlayerBatResult[]) => {
  let combinedLineupStats: IPlayerLineupStats[] = [];

  playerBatResults.every((playerBatResult: IPlayerBatResult) => {
    
    let indexCombinedLineup = combinedLineupStats.findIndex((combineLineupStat) => combineLineupStat.lineupId === playerBatResult.lineupId)
    
    if( indexCombinedLineup === -1 ){
      indexCombinedLineup = combinedLineupStats.push(Object.assign({},defaultPlayerLineupStats));
      indexCombinedLineup--;
      combinedLineupStats[indexCombinedLineup].lineupId = playerBatResult.lineupId;
    }
    const combinedStats = combinedLineupStats[indexCombinedLineup];

    combinedStats.plateAppearance++;
    switch(playerBatResult.batResults){
      case EBatResult.single:
        combinedStats.single++;
        combinedStats.atBats++;
        combinedStats.hit++;
        break;
      case EBatResult.double:
        combinedStats.double++;
        combinedStats.atBats++;
        combinedStats.hit++;
        break;
      case EBatResult.triple:
        combinedStats.triple++;
        combinedStats.atBats++;
        combinedStats.hit++;
        break;
      case EBatResult.homerun:
        combinedStats.homerun++;
        combinedStats.atBats++;
        combinedStats.hit++;
        break;
      case EBatResult.sacrificeBunt:
        combinedStats.sacrificeBunt++;
        /* combinedStats.out++; */
        break;
      case EBatResult.sacrificeFly:
        combinedStats.sacrificeFly++;
        /* combinedStats.out++; */
        break;
      case EBatResult.out:
        combinedStats.atBats++;
        combinedStats.out++;
        break;
      case EBatResult.strikeOut:
        combinedStats.atBats++;
        combinedStats.strikeOut++;
        break;
      case EBatResult.hitByPitch:
        combinedStats.hitByPitch++;
        break;
      case EBatResult.walk:
        combinedStats.walk++;
        break;
    }
    return true;
  })
  /* console.log(combinedLineupStats); */
  return combinedLineupStats;
}

export const generateDatagridPlayerRows = (allStats: IBattingStatsExtended[], listPlayers: IPlayer[], idLeagueSeason: number) => {
  return allStats.map((battingStats) => {
    return {
      idLeagueSeason: idLeagueSeason,
      id: battingStats.id,
      playerName: getPlayerName(battingStats.id, listPlayers),
      atBats: battingStats.atBats,
      out: battingStats.out,
      single: battingStats.single,
      double: battingStats.double,
      triple: battingStats.triple,
      homerun: battingStats.homerun,
      runsBattedIn: battingStats.runsBattedIn,
      battingAverage: battingStats.battingAverage,
      onBasePercentage: battingStats.onBasePercentage,
      sluggingPercentage: battingStats.sluggingPercentage,
      onBaseSluggingPercentage: battingStats.onBaseSluggingPercentage,
    }
  }) || [];
}