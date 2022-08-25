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

export interface IPlayerBatResult {
  lineupId: number;
  batResults:EBatResult;
}

export enum EBatResult {
  none = "None",
  single = "Single",
  double = "Double",
  triple = "Triple",
  homerun = "Homerun",
  out = "Out",
  hitByPitch = "Hit By Pitch",
  walk = "Walk",
  strikeOut = "Strike Out",
  sacrificeBunt = "Sacrifice Bunt",
  sacrificeFly = "Sacrifice Fly"
}

export const batResultOptions = [
  {value:EBatResult.none, label:"-- None --"},
  {value:EBatResult.single, label:"Single"},
  {value:EBatResult.double, label:"Double"},
  {value:EBatResult.triple, label:"Triple"},
  {value:EBatResult.homerun, label:"Homerun"},
  {value:EBatResult.out, label:"Out"},
  {value:EBatResult.hitByPitch, label:"Hit By Pitch"},
  {value:EBatResult.walk, label:"Walk"},
  {value:EBatResult.strikeOut, label:"Strike Out"},
  {value:EBatResult.sacrificeBunt, label:"Sacrifice Bunt"},
  {value:EBatResult.sacrificeFly, label:"Sacrifice Fly"}
]