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
  selectedTeam?: ITeam;
  isAdmin?: boolean;
  callbackCloseModal(): void;
}