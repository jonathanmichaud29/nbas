import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { Button } from "@mui/material";

import { addTeams, removeTeam } from "../redux/teamSlice";
import { fetchTeams, deleteTeam } from '../ApiCall/teams'
import { ITeam, ITeamProps } from '../Interfaces/Team';

function ListTeams(props: ITeamProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const {is_admin} = props;

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
    </div>
  )
}
export default ListTeams;