import { IMatchLineup } from './match'
import { IPlayer } from './player'

export interface IYearStatsProps {
  matchLineups:   IMatchLineup[];
  players:        IPlayer[];
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
  out: Array<number>;
  atBats: Array<number>;
  columns: Array<string>;
}