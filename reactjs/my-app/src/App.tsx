import React from 'react';
import './App.css';

import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
} from "react-router-dom";

import Login from './Firebase/Login';
import DashboardHome from './Dashboard/DashboardHome';


function App() {
  console.log(process.env);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
