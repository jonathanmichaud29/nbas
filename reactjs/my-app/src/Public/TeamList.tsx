import { useState, useEffect } from 'react';

import {fetchTeams} from '../ApiCall/teams'
interface ITeamData {
  id: number;
  name: string;
}

function TeamList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [teams, setTeams] = useState<ITeamData[]>([]);

  useEffect(() => {
    fetchTeams()
      .then((data) => {
        setTeams(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
    
  }, [])

  const htmlTeams = ( teams.length > 0 ? (
    <ul>
      {teams.map(team => {
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