import { IPlayer } from './Player';
import { ITeam } from './Team'
import { IMatch } from './Match'

export interface IConfirmDeleteProps{
  isOpen: boolean;
  title: string;
  description: string;
  callbackConfirmDelete(): void;
  callbackCloseModal(): void;
}
