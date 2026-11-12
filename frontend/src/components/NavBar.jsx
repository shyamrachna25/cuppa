import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-bar__brand">
        Cuppa
      </Link>
      <div className="nav-bar__links">
        <Link to="/brews">My Brews</Link>
        <Link to="/tastings">Tasting Board</Link>
        {user ? (
          <>
            <span className="nav-bar__user">{user.username}</span>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
