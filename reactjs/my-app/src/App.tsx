import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
} from "react-router-dom";

/**
 * Public Components
 */
import PublicApp from './Public/PublicApp';
import HomeLeague from "./Public/HomeLeague";
import PublicCalendar from "./Public/PublicCalendar";
import PublicCompare from './Public/PublicCompare'
import PublicMatch from './Public/PublicMatch'
import PublicPlayer from './Public/PublicPlayer'
import PublicPlayersStats from './Public/PublicPlayersStats'
import PublicTeamsStats from './Public/PublicTeamsStats'
import PublicTeam from './Public/PublicTeam'

/**
 * Admin Components
 */
import AdminApp from './Admin/AdminApp';
import DashboardHome from './Admin/DashboardHome';
import PlayerManager from './Admin/PlayerManager';
import MatchManager from './Admin/MatchManager';
import Login from './Firebase/Login';
import TeamManager from './Admin/TeamManager';
import LeagueManager from './Admin/LeagueManager';
import CalendarManager from './Admin/CalendarManager';

import { setDefaultMetas } from './utils/metaTags';
import { quickLinkCompare, quickLinkMatch, quickLinkPlayer, quickLinkTeam } from "./utils/constants";
import SelectLeague from "./League/SelectLeague";



function App() {
  setDefaultMetas();
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={<PublicApp />}>
            <Route path="" element={<SelectLeague />} />
            <Route path=":idSeason">
              <Route path="" element={<HomeLeague />} />
              
              <Route path={quickLinkMatch.link}>
                <Route path="" element={<PublicCalendar />} />
                <Route path=":id" element={<PublicMatch />} />
              </Route>

              <Route path={quickLinkPlayer.link}>
                <Route path="" element={<PublicPlayersStats />} />
                <Route path=":id" element={<PublicPlayer />} />
              </Route>
              
              <Route path={quickLinkTeam.link}>
                <Route path="" element={<PublicTeamsStats />} />
                <Route path=":id" element={<PublicTeam />} />
              </Route>
              
              <Route path={quickLinkCompare.link} element={<PublicCompare />} />
            </Route>
            
          </Route>

          <Route path="/admin/" element={<AdminApp />}>
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="leagues" element={<LeagueManager />} />
            <Route path="teams" element={<TeamManager />} />
            <Route path="players" element={<PlayerManager />} />
            <Route path="calendar" element={<CalendarManager />} />
            <Route path="match/:id" element={<MatchManager />} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
