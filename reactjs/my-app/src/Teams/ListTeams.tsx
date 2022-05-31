import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Button } from "@mui/material";

import { addTeams, removeTeam } from "../redux/teamSlice";
import { fetchTeams, deleteTeam } from "../ApiCall/teams";
import { ITeam, ITeamProps } from "../Interfaces/Team";

import ViewTeamPlayers from "../Modals/ViewTeamPlayers";
import AddTeamPlayer from "../Modals/AddTeamPlayer";

function ListTeams(props: ITeamProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const {is_admin, is_add_players, is_view_players } = props;

  const listTeams = useSelector((state: RootState) => state ).teams

  const clickDeleteTeam = (team: ITeam) => {
    deleteTeam(team.id)
      .then(response => {
        dispatch(removeTeam(team.id));
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }

  /**
   * Handle multiples modals
   */
  const [currentTeamView, setCurrentTeamView] = useState<ITeam>();
  const [isModalOpenAddPlayerToTeam, setOpenAddPlayerToTeam] = useState(false);
  const [isModalOpenViewTeamPlayers, setOpenViewTeamPlayers] = useState(false);

  const handleOpenListPlayers = (team: ITeam) => {
    setOpenAddPlayerToTeam(false);
    setOpenViewTeamPlayers(true);
    setCurrentTeamView(team);
  }
  const handleOpenAddPlayerToTeam = (team: ITeam) => {
    setOpenViewTeamPlayers(false);
    setOpenAddPlayerToTeam(true);
    setCurrentTeamView(team);
  }

  useEffect(() => {
    fetchTeams()
      .then(response => {
        dispatch(addTeams(response.data));
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }, [dispatch])

  const htmlTeams = ( listTeams.length > 0 ? (
    <ul>
      {listTeams.map((team: ITeam) => {
        
        return (
          <li key={`team-${team.id}`}>
            <span className="label">{team.name}</span>
            { is_admin ? (
              <Button 
                onClick={() => clickDeleteTeam(team)}
                variant="outlined"
                >Delete</Button>
            ) : '' }
            { is_view_players ? (
              <Button onClick={() => handleOpenListPlayers(team)}>View Players</Button>
            ) : '' }
            { is_add_players ? (
              <Button onClick={() => handleOpenAddPlayerToTeam(team)}>Add Player to team</Button>
            ) : '' }
          </li>
        )
      })}
      
    </ul>
  ) : '' );
  const htmlError = ( error !== null ? (
    <div>Error: {error}</div>
  ) : '' );

  const htmlLoading = ( ! isLoaded ? (
    <div>Loading...</div>
  ) : '' )


  return (
    <div className="public-layout">
      <h2>Team List</h2>
      { htmlLoading }
      { htmlError }
      { htmlTeams }
      { is_view_players ? (
        <ViewTeamPlayers
          is_open={isModalOpenViewTeamPlayers}
          selected_team={currentTeamView}
          />
      ) : '' }
      { is_add_players ? (
        <AddTeamPlayer
          is_open={isModalOpenAddPlayerToTeam}
          selected_team={currentTeamView}
          />
      ) : '' }
    </div>
  )
}
export default ListTeams;