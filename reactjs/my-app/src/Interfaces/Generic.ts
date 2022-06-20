import { IMatchLineup } from './Match'
import { IPlayer } from './Player'

export interface IConfirmDeleteProps{
  isOpen:         boolean;
  title:          string;
  description:    string;
  callbackConfirmDelete(): void;
  callbackCloseModal(): void;
}

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