import { ITeam } from './team'
import { IPlayer } from './player'
import { ILeague } from './league';
import { IBattingStatsExtended } from './stats';

export interface IMatch{
  id: number;
  idLeague: number;
  idSeason: number;
  idTeamHome: number;
  idTeamAway: number;
  date: Date;
  isCompleted: number;
  teamHomePoints: number;
  teamAwayPoints: number;
  idTeamWon: number;
  idTeamLost: number;
}

export type IMatchEncounter = {
  match : IMatch,
  teamHome: ITeam,
  teamAway: ITeam,
  players: IPlayer[],
  matchLineups: IMatchLineup[],
}

export interface IMatchProps{
  match: IMatch;
  isAdmin?: boolean;
}

export interface IAdminMatchHeaderProps{
  match: IMatch;
  teamHome: ITeam;
  teamAway: ITeam;
}

export interface IListMatchProps{
  league?: ILeague;
  isAdmin?: boolean;
}

export interface IAddMatchLineupProps{
  isOpen: boolean;
  match: IMatch;
  selectedTeam: ITeam;
  callbackCloseModal(): void;
}

export interface IMatchLineup {
  id: number;
  idMatch: number;
  idTeam: number;
  idPlayer: number;
  idLeague: number;
  idSeason: number;
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
  allPlayers?: Array<IPlayer>;
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

export const defaultMatchLineupData = {
  id: 0,
  idMatch: 0,
  idTeam: 0,
  idPlayer: 0,
  idLeague: 0,
  idSeason: 0,
  atBats: 0,
  single: 0,
  double: 0,
  triple: 0,
  homerun: 0,
  out: 0,
  hitOrder: 0,
  hitByPitch: 0,
  walk: 0,
  strikeOut: 0,
  stolenBase: 0,
  caughtStealing: 0,
  plateAppearance: 0,
  sacrificeBunt: 0,
  sacrificeFly: 0,
  runsBattedIn: 0,
  hit: 0,
} as IMatchLineup