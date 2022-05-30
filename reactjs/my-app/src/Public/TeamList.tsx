import { useState, useEffect } from 'react';

import {fetchTeams} from '../ApiCall/teams'

import { ITeam } from '../Interfaces/Team';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addTeams } from "../redux/teamSlice";

function TeamList() {
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const listTeams = useSelector((state: RootState) => state ).teams
  
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
          <li key={`team-${team.id}`}>{team.name}</li>
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
export default TeamList;