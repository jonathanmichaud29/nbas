
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

// TODO: idSeason should be mandatory
export interface ILeagueTeam {
  idTeam: number;
  idLeague: number;
  idSeason?: number;
}

export interface ILeagueSeason {
  id: number;
  idLeague: number;
  name: string;
  year: number;
}


export interface ILeagueTeamDetails {
  teamId: number;
  teamName: string;
  leagueId: number;
  leagueName: string;
}