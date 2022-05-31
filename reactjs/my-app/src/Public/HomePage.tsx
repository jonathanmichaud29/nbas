import ListTeams from "../Teams/ListTeams";
import PlayerList from "./PlayerList";
function HomePage() {
  return (
    <div className="public-layout">
      <h1>Home Page</h1>
      <ListTeams />
      <PlayerList />
    </div>
  )
}
export default HomePage;