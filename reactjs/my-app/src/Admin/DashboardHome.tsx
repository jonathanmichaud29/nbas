import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../Firebase/firebase";
function DashboardHome() {
  const [user, loading/* , error */] = useAuthState(auth);
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
    </div>
  );
}

export default DashboardHome;