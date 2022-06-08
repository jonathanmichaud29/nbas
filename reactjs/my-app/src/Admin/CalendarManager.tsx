import CreateMatch from '../Matchs/CreateMatch';
import ListMatches from '../Matchs/ListMatches';

function CalendarManager() {

  return (
    <div>
      <h2>Calendar Manager</h2>
      <CreateMatch />
      <ListMatches 
        isAdmin={true}
      />
    </div>
  )
}

export default CalendarManager;