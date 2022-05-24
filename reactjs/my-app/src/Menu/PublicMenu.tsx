import React/* , { useEffect, useState } */ from "react";
/* import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css"; */

import { Link } from 'react-router-dom';

function PublicMenu() {
  return (
    <div className="main-menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/admin/login">Login</Link></li>
      </ul>
    </div>
  )
}
export default PublicMenu;