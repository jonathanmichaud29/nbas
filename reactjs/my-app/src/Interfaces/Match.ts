export interface IMatch{
  id: number;
  idTeamHome: number;
  idTeamAway: number;
  date: Date;
  isCompleted: number;
  teamHomePoints: number;
  teamAwayPoints: number;
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