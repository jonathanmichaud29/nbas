import { IPlayer } from './player';
import { IMatch, IMatchLineup } from './match';
import { ILeague, ILeagueSeason } from './league';

export interface ITeam{
  id: number;
  name: string;
}

export interface ITeamSeason{
  idTeam: number;
  idLeagueSeason: number;
}



export interface ITeamProps{
  isAdmin?: boolean;
  isAddPlayers?: boolean;
  isViewPlayers?: boolean;
  leagueSeason: ILeagueSeason | null;
}

export interface ITeamPlayers{
  playerId:number;
  playerName:string;
  teamId:number;
  teamName:string;
}



export interface ITeamPlayersProps {
  isOpen: boolean;
  selectedTeam: ITeam | null;
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
  leagueSeason: ILeagueSeason;
}

export interface ITeamMatchResumeProps {
  matchLineups: IMatchLineup[];
  match:        IMatch;
  players:      IPlayer[];
  teamHome:     ITeam;
  teamAway:     ITeam;
}