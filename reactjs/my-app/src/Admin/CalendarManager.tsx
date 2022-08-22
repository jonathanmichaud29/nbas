import CreateMatch from '../Matchs/CreateMatch';
import ListMatches from '../Matchs/ListMatches';

function CalendarManager() {
  return (
    <>
      <CreateMatch />
      
      <ListMatches 
        isAdmin={true}
      />
    </>
  )
}

export default CalendarManager;