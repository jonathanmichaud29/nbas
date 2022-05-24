import React from 'react';
import './App.css';

import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
} from "react-router-dom";

import PublicMenu from './Menu/PublicMenu';
import Login from './Firebase/Login';
import AdminApp from './Admin/AdminApp';
import DashboardHome from './Admin/DashboardHome';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<PublicMenu />}>
            
          </Route>
          <Route path="/admin/" element={<AdminApp />}>
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<DashboardHome />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
