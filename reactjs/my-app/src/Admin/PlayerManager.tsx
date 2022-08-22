import CreatePlayer from '../Players/CreatePlayer';
import ListPlayers from '../Players/ListPlayers';

function PlayerManager() {
  return (
    <>
      <CreatePlayer />
      <ListPlayers 
        isAdmin={true}
      />
    </>
  )
}

export default PlayerManager;