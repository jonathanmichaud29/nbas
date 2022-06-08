import { IPlayer } from './Player';
import { ITeam } from './Team'
import { IMatch } from './Match'

/**
 * TODO: change 'context' key because it is a reserved keyword for React
 */

export interface IConfirmDeleteProps{
  is_open: boolean;
  context: string;
  selected_team?: ITeam;
  selected_player?: IPlayer;
  selected_match?: IMatch;
  callback_close_modal(team?: ITeam, player?: IPlayer, match?: IMatch): void;
}
