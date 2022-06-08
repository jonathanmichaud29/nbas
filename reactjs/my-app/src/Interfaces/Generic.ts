import { IPlayer } from './Player';
import { ITeam } from './Team'
import { IMatch } from './Match'

/**
 * TODO: change 'context' key because it is a reserved keyword for React
 */

export interface IConfirmDeleteProps{
  is_open: boolean;
  title: string;
  description: string;
  callback_confirm_delete(): void;
  callback_close_modal(): void;
}
