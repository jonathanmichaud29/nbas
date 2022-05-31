import ListTeams from "../Teams/ListTeams";
import ListPlayers from "../Players/ListPlayers";
function HomePage() {
  return (
    <div className="public-layout">
      <h1>Home Page</h1>
      <ListTeams 
        is_view_players={true}
      />
      <ListPlayers />
    </div>
  )
}
export default HomePage;