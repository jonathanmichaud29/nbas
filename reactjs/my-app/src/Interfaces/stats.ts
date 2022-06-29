import { IMatch, IMatchLineup } from './match'
import { IPlayer } from './player'

export interface IYearStatsProps {
  matchLineups:   IMatchLineup[];
  players:        IPlayer[];
}

export interface IBattingPercentageStats {
  battingAverage: number;
  // onBasePercentage: number;
  sluggingPercentage: number;
  // onBaseSluggingPercentage: number;
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
}
export const defaultBattingPercentageStats = {
  battingAverage: 0,
  // onBasePercentage: 0,
  sluggingPercentage: 0,
  // onBaseSluggingPercentage: 0,
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
  single: Array<number>;
  double: Array<number>;
  triple: Array<number>;
  homerun: Array<number>;
  atBats: Array<number>;
  columns: Array<string>;
}

export interface IProgressionStatsProps {
  matches: IMatch[];
  matchLineups: IMatchLineup[];
}