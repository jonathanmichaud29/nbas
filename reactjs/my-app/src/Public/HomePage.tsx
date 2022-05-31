import ListTeams from "../Teams/ListTeams";
import ListPlayers from "../Players/ListPlayers";
function HomePage() {
  return (
    <div className="public-layout">
      <h1>Home Page</h1>
      <ListTeams />
      <ListPlayers />
    </div>
  )
}
export default HomePage;