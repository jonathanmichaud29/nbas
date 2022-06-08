export interface ITeam{
  id: number;
  name: string;
}

export interface ITeamProps{
  isAdmin?: boolean;
  isAddPlayers?: boolean;
  isViewPlayers?: boolean;
}

export interface ITeamPlayers{
  playerId:number;
  playerName:string;
  teamId:number;
  teamName:string;
}

export interface ITeamPlayersProps {
  isOpen: boolean;
  selected_team?: ITeam;
  isAdmin?: boolean;
  callback_close_modal(): void;
}