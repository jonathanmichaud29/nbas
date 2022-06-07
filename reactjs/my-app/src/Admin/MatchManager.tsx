/* import CreateMatch from '../Matchs/CreateMatch'; */
import{ useParams } from 'react-router-dom'
function MatchManager() {
  const { id } = useParams();
  return (
    <div>
      <h2>Match Manager</h2>
      {/* <ViewMatch
        id_match={id}
        is_admin={true}
      /> */}
    </div>
  )
}

export default MatchManager;