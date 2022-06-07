
import './App.css';

import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
} from "react-router-dom";

/**
 * Public Components
 */
import PublicApp from './Public/PublicApp';
import HomePage from './Public/HomePage'

/**
 * Admin Components
 */
import AdminApp from './Admin/AdminApp';
import DashboardHome from './Admin/DashboardHome';
import PlayerManager from './Admin/PlayerManager';
import MatchManager from './Admin/MatchManager';
import Login from './Firebase/Login';
import TeamManager from './Admin/TeamManager';
import CalendarManager from './Admin/CalendarManager';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={<PublicApp />}>
            <Route path="" element={<HomePage />} />
          </Route>

          <Route path="/admin/" element={<AdminApp />}>
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<DashboardHome />} />
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
