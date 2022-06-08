import React from 'react';
import ViewMatch from '../Matchs/ViewMatch';
import{ useParams } from 'react-router-dom'

function MatchManager() {
  let { id } = useParams();
  const idMatch = id ? parseInt(id, 10) : null;
  return (
    <div>
      <h2>Match Manager</h2>
      { idMatch && (
        <ViewMatch
          idMatch={idMatch}
          isAdmin={true}
        />
      ) }
    </div>
  )
}

export default MatchManager;