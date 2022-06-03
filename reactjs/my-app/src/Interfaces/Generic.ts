import { IPlayer } from './Player';
import { ITeam } from './Team'

export interface IConfirmDeleteProps{
  is_open: boolean;
  context: string;
  selected_team?: ITeam;
  selected_player?: IPlayer;
  callback_close_modal(team?: ITeam, player?: IPlayer): void;
}
