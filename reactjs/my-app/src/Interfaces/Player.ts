import { IMatch, IMatchLineup } from './Match'
import { ITeam } from './Team';

export interface IPlayer{
  id: number;
  name: string;
}

export interface IPlayerProps{
  isAdmin?: boolean;
}

export interface IPlayerProfileProps{
  player: IPlayer;
}

export interface IPlayerMatchResumeProps {
  playerLineup: IMatchLineup;
  match:        IMatch;
  teamHome:     ITeam;
  teamAway:     ITeam;
}
export interface IPlayerYearStatsProps {
  player:       IPlayer;
  playerLineups:IMatchLineup[];
}