import { ILeague } from './league';
import { IMatch, IMatchLineup } from './match'
import { IPlayer } from './player'
import { ITeam } from './team';

export interface IYearStatsProps {
  matchLineups:   IMatchLineup[];
  players:        IPlayer[];
  title:          string;
}

export interface IBattingPercentageStats {
  battingAverage: number;
  onBasePercentage: number;
  sluggingPercentage: number;
  onBaseSluggingPercentage: number;
}

export interface ITeamStats {
  id: number;
  atBats: number;
  single: number;
  double: number;
  triple: number;
  homerun: number;
  out: number;
}
export interface IPlayerStats {
  id: number;
  atBats: number;
  single: number;
  double: number;
  triple: number;
  homerun: number;
  out: number;
  walk: number;
  hitByPitch: number;
  sacrificeFly: number;
  runsBattedIn: number;
}

export interface IBattingStatsExtended extends IPlayerStats, IBattingPercentageStats {};

export const defaultPlayerStats = {
  id: 0,
  atBats: 0,
  single: 0,
  double: 0,
  triple: 0,
  homerun: 0,
  out: 0,
  walk: 0,
  hitByPitch: 0,
  sacrificeFly: 0,
  runsBattedIn: 0,
}
export const defaultBattingPercentageStats = {
  battingAverage: 0,
  onBasePercentage: 0,
  sluggingPercentage: 0,
  onBaseSluggingPercentage: 0,
}
export const defaultBattingStatsExtended = {...defaultPlayerStats, ...defaultBattingPercentageStats}

export interface IPlayerLineupStats {
  lineupId: number;
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

export const defaultPlayerLineupStats:IPlayerLineupStats = {
  lineupId: 0,
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
}

export interface IStatBatResultsProps {
  single: number;
  double: number;
  triple: number;
  homerun: number;
  out: number;
}

export interface IStatBattingPercentageProps {
  stats: Array<IBattingPercentageStats>;
  columns: Array<string>;
}

export interface IProgressionStatsProps {
  matches: IMatch[];
  matchLineups: IMatchLineup[];
  teams: ITeam[];
}

export interface ICompareBattingStatsProps {
  battingStats: IBattingStatsExtended[];
  players?:IPlayer[];
  teams?:ITeam[];
}

export interface IToolComparePlayersProps{
  league: ILeague;
}

export interface IToolCompareTeamsProps{
  league: ILeague;
}
