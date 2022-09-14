import { ILeague } from "../Interfaces/league";
import { IMatchLineup } from "../Interfaces/match";

export const filterTeamLineups = (matchLineups: IMatchLineup[], idTeam: number) => {
  return matchLineups.filter((matchLineup) => matchLineup.idTeam === idTeam);
}

export const filterLeague = (idLeague: number, listLeagues: Array<ILeague>): ILeague | null => {
  if( listLeagues ){
    return listLeagues.find((league) => league.id === idLeague) || null;
  }
  return null;
}