import TeamList from "./TeamList";
import PlayerList from "./PlayerList";
function HomePage() {
  return (
    <div className="public-layout">
      <h1>Home Page</h1>
      <TeamList />
      <PlayerList />
    </div>
  )
}
export default HomePage;