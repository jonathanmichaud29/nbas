import { ILeague, ILeaguePlayer, ILeagueSeason, ILeagueTeam } from "../Interfaces/league";
import { IMatch, IMatchLineup } from "../Interfaces/match";
import { IPlayer } from "../Interfaces/player";
import { ITeam, ITeamSeason } from "../Interfaces/team";

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