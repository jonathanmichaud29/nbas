export interface IMatch{
  id: number;
  id_team_home: number;
  id_team_away: number;
  date: Date;
  is_completed: number;
  team_home_points: number;
  team_away_points: number;
  id_team_won: number;
  id_team_lost: number;
}

export interface IMatchProps{
  is_admin?: boolean;
}