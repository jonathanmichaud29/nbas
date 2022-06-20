import { IPlayer } from './Player';
import { IMatch, IMatchLineup } from './Match';

export interface ITeam{
  id: number;
  name: string;
}

export interface ITeamProps{
  isAdmin?: boolean;
  isAddPlayers?: boolean;
  isViewPlayers?: boolean;
}

export interface ITeamPlayers{
  playerId:number;
  playerName:string;
  teamId:number;
  teamName:string;
}

export interface ITeamProfileProps{
  team: ITeam;
}

export interface ITeamPlayersProps {
  isOpen: boolean;
  selectedTeam?: ITeam;
  isAdmin?: boolean;
  callbackCloseModal(): void;
}

export interface IOrderTeamPlayers {
  currentTeamName:string;
  priority: number;
}

export interface IOrderPlayers extends IPlayer, IOrderTeamPlayers {};

export interface ITeamStandingProps {
  team: ITeam;
  matches: IMatch[];
}

export interface ITeamMatchResumeProps {
  team:         ITeam;
  matchLineups: IMatchLineup[];
  match:        IMatch;
  players:      IPlayer[];
  teamHome:     ITeam;
  teamAway:     ITeam;
}