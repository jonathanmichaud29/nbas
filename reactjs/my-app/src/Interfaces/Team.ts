export interface ITeam{
  id: number;
  name: string;
}

export interface ITeamProps{
  is_admin?: boolean;
  is_add_players?: boolean;
  is_view_players?: boolean;
}

export interface ITeamPlayers{
  player_id:number;
  player_name:string;
  team_id:number;
  team_name:string;
}

export interface ITeamPlayersProps {
  is_open: boolean;
  selected_team?: ITeam;
}