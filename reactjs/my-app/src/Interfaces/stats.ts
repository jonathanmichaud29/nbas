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

export interface IPlayerStatsExtended extends IPlayerStats, IBattingPercentageStats {};

export interface IPlayerLineupStats {
  lineupId: number;
  atBats: number;
  single: number;
  double: number;
  triple: number;
  homerun: number;
  out: number;
  hitOrder: number;
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