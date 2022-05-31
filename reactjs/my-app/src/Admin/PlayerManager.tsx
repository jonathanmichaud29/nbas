/* import CreatePlayer from '../Players/CreatePlayer'; */
import ListPlayers from '../Players/ListPlayers';

function PlayerManager() {

  return (
    <div>
      <h2>Player Manager</h2>
      {/* <CreateTeam /> */}
      <ListPlayers 
        is_admin={true}
      />
    </div>
  )
}

export default PlayerManager;