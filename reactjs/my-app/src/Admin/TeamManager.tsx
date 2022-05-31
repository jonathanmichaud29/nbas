import CreateTeam from '../Teams/CreateTeam';
import ListTeams from '../Teams/ListTeams';

function TeamManager() {

  return (
    <div>
      <h2>Team Manager</h2>
      <CreateTeam />
      <ListTeams 
        is_admin={true}
      />
    </div>
  )
}

export default TeamManager;