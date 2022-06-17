import ListTeams from "../Teams/ListTeams";
import ListPlayers from "../Players/ListPlayers";
import ListMatches from "../Matchs/ListMatches";
function HomePage() {
  return (
    <div className="public-layout">
      <h1>Home Page</h1>
      <ListTeams 
        isViewPlayers={true}
      />
      <ListPlayers />
      <ListMatches />
    </div>
  )
}
export default HomePage;