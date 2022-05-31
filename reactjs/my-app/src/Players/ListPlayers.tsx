import { useState, useEffect } from 'react';

import { deletePlayer, fetchPlayers } from '../ApiCall/players'

import { IPlayer, IPlayerProps } from '../Interfaces/Player';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addPlayers, removePlayer } from "../redux/playerSlice";

function ListPlayers(props: IPlayerProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { is_admin } = props;

  const listPlayers = useSelector((state: RootState) => state )

  const clickDeletePlayer = (player: IPlayer) => {
    deletePlayer(player.id)
      .then(response => {
        dispatch(removePlayer(player.id));
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoaded(true)
      });
  }
  
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
      {listPlayers.players.map((player: IPlayer) => {
        return (
          <li key={`player-${player.id}`}>
            <span className="label">{player.name}</span>
            { is_admin ? (
              <button onClick={() => clickDeletePlayer(player)}>Delete</button>
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
      <h2>Player List</h2>
      { htmlLoading }
      { htmlError }
      { htmlPlayers }
    </div>
  )
}
export default ListPlayers;