import { IPlayer } from './player';
import { IMatch, IMatchLineup } from './match';
import { ILeague } from './league';

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
  league: ILeague;
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



export interface IStandingTeamProps {
  team: ITeam;
  matches: IMatch[];
}

export interface IStandingTeam {
  id: number;
  nbGamePlayed: number;
  nbWins: number;
  nbLosts: number;
  nbNulls: number;
}


export interface IAllTeamsStandingProps {
  /* standingTeams: IStandingTeam[]; */
  teams: ITeam[];
}

export interface IAllTeamsStatsProps {
  teams: ITeam[];
  matchesLineups?: IMatchLineup[]; // TODO DEPRECATED
}

export interface ITeamMatchResumeProps {
  matchLineups: IMatchLineup[];
  match:        IMatch;
  players:      IPlayer[];
  teamHome:     ITeam;
  teamAway:     ITeam;
}