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