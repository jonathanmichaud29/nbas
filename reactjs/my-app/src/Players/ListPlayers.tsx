import { useState, useEffect } from 'react';

import { fetchPlayers } from '../ApiCall/players'

import { IPlayer } from '../Interfaces/Player';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addPlayers } from "../redux/playerSlice";

function ListPlayers(props: any) {
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { is_admin } = props;

  const listPlayers = useSelector((state: RootState) => state )
  
  useEffect(() => {
    fetchPlayers()
      .then(response => {
        dispatch(addPlayers(response.data));
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }, [dispatch])

  const htmlPlayers = ( listPlayers.players.length > 0 ? (
    <ul>
      {listPlayers.players.map((team: IPlayer) => {
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
      <h2>Player List</h2>
      { htmlLoading }
      { htmlError }
      { htmlPlayers }
    </div>
  )
}
export default ListPlayers;