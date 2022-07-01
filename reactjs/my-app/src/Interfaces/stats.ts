import { IMatch, IMatchLineup } from './match'
import { IPlayer } from './player'

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
}