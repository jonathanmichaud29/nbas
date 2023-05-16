import { ILeague, ILeaguePlayer, ILeagueSeason, ILeagueTeam } from "../Interfaces/league";
import { IMatch, IMatchLineup, IMatchPlayers } from "../Interfaces/match";
import { IPlayer, ITeamPlayer } from "../Interfaces/player";
import { IOrderPlayers, ITeam, ITeamSeason } from "../Interfaces/team";

export const filterPlayersByName = (listPlayers: IPlayer[], searchTerm: string) => {
  if( searchTerm === ''){
    return listPlayers;
  }
  return listPlayers.filter((player:IPlayer) => player.name.toLowerCase().includes(searchTerm.toLowerCase()) ) || []
}

export const filterTeamsBySeason = (listTeams: ITeam[], listLeagueTeams: ILeagueTeam[], listTeamSeasons: ITeamSeason[], leagueSeason: ILeagueSeason | null) => {
  const teamIds = listTeamSeasons.filter((teamSeason) => {
    return ( teamSeason.idLeagueSeason === leagueSeason?.id )
  }).map((teamSeason) => teamSeason.idTeam);

  return listTeams.filter((team) => teamIds.includes(team.id))

}

export const filterTeamsNotInSeason = (listTeams: ITeam[], listLeagueTeams: ILeagueTeam[], listTeamSeasons: ITeamSeason[], leagueSeason: ILeagueSeason | null) => {
  const teamIds = listTeamSeasons.filter((teamSeason) => {
    return ( teamSeason.idLeagueSeason === leagueSeason?.id )
  }).map((teamSeason) => teamSeason.idTeam);

  return listTeams.filter((team) => ! teamIds.includes(team.id))
  
}

export const filterTeamLineups = (matchLineups: IMatchLineup[], idTeam: number) => {
  return matchLineups.filter((matchLineup) => matchLineup.idTeam === idTeam);
}

export const filterLeague = (idLeague: number, listLeagues: Array<ILeague>): ILeague | null => {
  if( listLeagues ){
    return listLeagues.find((league) => league.id === idLeague) || null;
  }
  return null;
}

export const filterMatchesByLeague = (listMatches:IMatch[], idLeague:number): IMatch[] => {
  if(listMatches === null ) return [];
  if(idLeague === 0) return listMatches 
  return listMatches?.filter((match) => match.idLeague === idLeague) || []
}
export const filterMatchesBySeason = (leagueSeason: ILeagueSeason | null, listMatches:IMatch[]): IMatch[] => {
  if(listMatches === null || leagueSeason === null  ) return [];
  
  return listMatches.filter((match) => match.idSeason === leagueSeason.id) || []
}

export const filterMatchesLineupsByLeague = (listMatchLineups: IMatchLineup[], idLeague:number): IMatchLineup[] => {
  if(listMatchLineups === null ) return [];
  if(idLeague === 0) return listMatchLineups; 
  return listMatchLineups?.filter((matchLineup) => matchLineup.idLeague === idLeague) || []
}

export const filterPlayersByLeague = (players: IPlayer[], leaguesPlayers: ILeaguePlayer[], league: ILeague) => {
  const leaguePlayerIds = leaguesPlayers.filter((leaguePlayer) => leaguePlayer.idLeague === league.id).map((leaguePlayer) => leaguePlayer.idPlayer)
  return players.filter((player) => leaguePlayerIds.includes(player.id) )
}

export const filterTeamsByLeague = (teams: ITeam[], leaguesTeams: ILeagueTeam[], league: ILeague) => {
  const leagueTeamIds = leaguesTeams.filter((leagueTeam) => leagueTeam.idLeague === league.id).map((leagueTeam) => leagueTeam.idTeam)
  return teams.filter((team) => leagueTeamIds.includes(team.id) )
}

export const findAvailabilityMatchPlayers = (matchPlayers: IMatchPlayers | null, listTeamPlayers: ITeamPlayer[], selectedTeam: ITeam) => {
  const assignedLineupPlayerIds = matchPlayers?.lineupPlayers?.map((lineupPlayer) => lineupPlayer.idPlayer) || [];
  const unassignedLineupPlayerIds = listTeamPlayers
    .filter((teamPlayer) => {
      return matchPlayers?.match.idSeason === teamPlayer.idLeagueSeason 
        && teamPlayer.idTeam === selectedTeam.id 
        && ! assignedLineupPlayerIds.includes(teamPlayer.idPlayer)
    })
    .map((teamPlayer) => teamPlayer.idPlayer) || []
  
  return {
    assignedLineupPlayerIds,
    unassignedLineupPlayerIds
  }
}

export const findAvailabilityMatchAllPlayers = (matchPlayers: IMatchPlayers | null, listPlayers: IPlayer[], selectedTeam: ITeam) => {
  const assignedLineupPlayerIds = matchPlayers?.lineupPlayers?.map((lineupPlayer) => lineupPlayer.idPlayer) || [];
  const unassignedLineupPlayerIds = listPlayers
    .filter((player) => {
      return ! assignedLineupPlayerIds.includes(player.id)
    })
    .map((player) => player.id) || []
  
  return {
    assignedLineupPlayerIds,
    unassignedLineupPlayerIds
  }
}

/**
 * Remove Players that are actually in this match lineup
 * Then set Player's Categorisation and add new attributes helping to sort them in the list
 * Sort players by the following: team association, team name, player name
 */ 
export const sortPlayersPerTeams = (listPlayers:IPlayer[], listTeams:ITeam[], matchPlayers:IMatchPlayers | null, listTeamPlayers: ITeamPlayer[], unassignedLineupPlayerIds: Array<number>) : IOrderPlayers[] => {
  return listPlayers
    .filter((player) => unassignedLineupPlayerIds.includes(player.id))
    .map((player: IPlayer) => {
      const teamPlayerFound = listTeamPlayers.find((teamPlayer) => teamPlayer.idLeagueSeason === matchPlayers?.match.idSeason && teamPlayer.idPlayer === player.id) || null;
      const groupName = ( teamPlayerFound !== null ? listTeams.find((team) => team.id === teamPlayerFound.idTeam)?.name : 'Reservist');
      
      return {
        currentTeamName: groupName,
        priority: ( teamPlayerFound !== null ? 1 : 0 ),
        ...player
      } as IOrderPlayers
    })
    .sort((a,b) => a.priority - b.priority || -(b.currentTeamName).localeCompare(a.currentTeamName) || -(b.name).localeCompare(a.name) );
}

export function getLeagueAndSeason(leagues:ILeague[], leagueSeasons: ILeagueSeason[], idLeagueSeason:number): [ILeague | null, ILeagueSeason| null] {
  let leagueSeason = leagueSeasons.find((myLeagueSeason) => myLeagueSeason.id === idLeagueSeason) || null; 
  let league = leagues.find((myLeague) => myLeague.id === leagueSeason?.idLeague) || null;
  return [league, leagueSeason]
}