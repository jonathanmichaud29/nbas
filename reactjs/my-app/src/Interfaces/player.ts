import { ILeague, ILeaguePlayer } from './league';
import { IMatch, IMatchLineup } from './match'
import { ITeam } from './team';

export interface IPlayer{
  id: number;
  name: string;
}

export interface ITeamPlayer{
  idTeam: number;
  idPlayer: number;
  idLeagueSeason: number;
}

export interface IPlayerProps{
  isAdmin?: boolean;
  hasFilter?: boolean;
}



export interface IPlayerMatchResumeProps {
  player:       IPlayer;
  playerLineup: IMatchLineup;
  match:        IMatch;
  teamHome:     ITeam;
  teamAway:     ITeam;
}
export interface IPlayerYearStatsProps {
  player:       IPlayer;
  playerLineups:IMatchLineup[];
}
