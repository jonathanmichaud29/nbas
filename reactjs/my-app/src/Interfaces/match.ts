import { ITeam } from './team'
import {IPlayer} from './player'

export interface IMatch{
  id: number;
  idTeamHome: number;
  idTeamAway: number;
  date: Date;
  isCompleted: number;
  teamHomePoints: number;
  teamAwayPoints: number;
  idTeamWon: number;
  idTeamLost: number;
}

export interface IMatchProps{
  match: IMatch;
  isAdmin?: boolean;
}

export interface IMatchResumeProps {
  title: string;
  match: IMatch;
}


export interface IMatchDetailsProps {
  match: IMatch;
}

export interface IListMatchProps{
  isAdmin?: boolean;
}

export interface IAddMatchLineupProps{
  isOpen: boolean;
  match: IMatch;
  selectedTeam: ITeam;
  callbackCloseModal(): void;
  allPlayers: Array<IPlayer>;
}

export interface IMatchLineup {
  id: number;
  idMatch: number;
  idTeam: number;
  idPlayer: number;
  atBats: number;
  single: number;
  double: number;
  triple: number;
  homerun: number;
  out: number;
  hitOrder: number;
  hitByPitch: number;
  walk: number;
  strikeOut: number;
  stolenBase: number;
  caughtStealing: number;
  plateAppearance: number;
  sacrificeBunt: number;
  sacrificeFly: number;
  runsBattedIn: number;
  hit: number;
}

export interface IMatchPlayers {
  match: IMatch;
  lineupPlayers: Array<IMatchLineup>
}
export interface IMatchPlayer {
  match: IMatch;
  lineupPlayer: IMatchLineup
}

export interface ITeamMatchLineupProps {
  isAdmin?: boolean;
  isHomeTeam: boolean;
  match: IMatch;
  team: ITeam;
  allPlayers: Array<IPlayer>;
}

export interface ICompleteMatchProps{
  isOpen: boolean;
  match: IMatch;
  callbackCloseModal(): void;
  teamHome: ITeam;
  teamAway: ITeam;
  allPlayers: Array<IPlayer>;
}