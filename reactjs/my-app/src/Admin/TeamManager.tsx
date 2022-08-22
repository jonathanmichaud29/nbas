import CreateTeam from '../Teams/CreateTeam';
import ListTeams from '../Teams/ListTeams';

function TeamManager() {
  
  return (
    <>
      <CreateTeam />
      <ListTeams 
        isAdmin={true}
        isAddPlayers={true}
        isViewPlayers={true}
      />
    </>
  )
}

export default TeamManager;