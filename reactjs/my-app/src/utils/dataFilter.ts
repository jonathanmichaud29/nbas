import { IMatchLineup } from "../Interfaces/match";

export const filterTeamLineups = (matchLineups: IMatchLineup[], idTeam: number) => {
  return matchLineups.filter((matchLineup) => matchLineup.idTeam === idTeam);
}