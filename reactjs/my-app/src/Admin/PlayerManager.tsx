import { useSelector } from 'react-redux';

import { RootState } from '../redux/store';

import CreatePlayer from '../Players/CreatePlayer';
import ListPlayers from '../Players/ListPlayers';


function PlayerManager() {
  
  const stateAdminContext = useSelector((state: RootState) => state.adminContext );

  return (
    <>
      { stateAdminContext.currentLeague ? (
        <CreatePlayer /> 
      ) : ''}
      { stateAdminContext.currentLeague ? (
        <ListPlayers 
          isAdmin={true}
          hasFilter={true}
        />
      ) : ''}
    </>
  )
}

export default PlayerManager;