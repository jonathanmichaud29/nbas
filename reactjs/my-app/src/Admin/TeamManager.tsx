import CreateTeam from '../Teams/CreateTeam';
import ListTeams from '../Teams/ListTeams';

function TeamManager() {

  return (
    <div>
      <h2>TeamManager</h2>
      <CreateTeam />
      <ListTeams 
        is_admin={true}
      />
    </div>
  )
}

export default TeamManager;