export interface IMatch{
  id: number;
  idTeamHome: number;
  idTeamAway: number;
  date: Date;
  isCompleted: number;
  team_home_points: number;
  team_away_points: number;
  idTeamWon: number;
  idTeamLost: number;
}

export interface IMatchProps{
  idMatch: number;
  isAdmin?: boolean;
}

export interface IListMatchProps{
  isAdmin?: boolean;
}