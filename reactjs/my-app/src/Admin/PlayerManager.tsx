import CreatePlayer from '../Players/CreatePlayer';
import ListPlayers from '../Players/ListPlayers';

function PlayerManager() {

  return (
    <div>
      <h2>Player Manager</h2>
      <CreatePlayer />
      <ListPlayers 
        isAdmin={true}
      />
    </div>
  )
}

export default PlayerManager;