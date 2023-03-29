import CreateSeason from '../Seasons/CreateSeason';
import ListSeasons from '../Seasons/ListSeasons';

function SeasonManager() {
  
  return (
    <>
      <CreateSeason />
      <ListSeasons 
        isAdmin={true}
      />
    </>
  )
}

export default SeasonManager;