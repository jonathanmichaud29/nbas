
export interface ILeague {
  id: number;
  name: string;
}

export interface IUserLeague {
  idUser: number;
  idLeague: number;
}

export interface ILeaguePlayer {
  idPlayer: number;
  idLeague: number;
}

export interface ILeaguePlayerDetails {
  playerId: number;
  playerName: string;
  leagueId: number;
  leagueName: string;
}

export interface ILeagueTeam {
  idTeam: number;
  idLeague: number;
}


export interface ILeagueTeamDetails {
  teamId: number;
  teamName: string;
  leagueId: number;
  leagueName: string;
}