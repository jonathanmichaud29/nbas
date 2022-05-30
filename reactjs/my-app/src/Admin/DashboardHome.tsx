import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../Firebase/firebase";
import TeamManager from "./TeamManager";

function DashboardHome() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [user, loading, navigate]);

  return (
    <div className="admin">
      <h2>Hello user!</h2>
      <button className="dashboard__btn" onClick={logout}>
        Logout
      </button>
      <TeamManager />
    </div>
  );
}

export default DashboardHome;