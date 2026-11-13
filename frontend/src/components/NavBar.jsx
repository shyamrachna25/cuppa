import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function BrandMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="brand-mark">
      <path d="M4 10h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6v-5z" />
      <path d="M16 11h2a2.5 2.5 0 0 1 0 5h-2" fill="none" strokeWidth="1.6" stroke="currentColor" />
      <path
        d="M8 7c-.8-1 .8-1.6 0-3"
        fill="none"
        strokeWidth="1.3"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path
        d="M12 7c-.8-1 .8-1.6 0-3"
        fill="none"
        strokeWidth="1.3"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

function navLinkClass({ isActive }) {
  return isActive ? "nav-bar__links-active" : undefined;
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="nav-bar">
      <NavLink to="/" className="nav-bar__brand">
        <BrandMark />
        Cuppa
      </NavLink>
      <div className="nav-bar__links">
        <NavLink to="/brews" className={navLinkClass}>
          My Brews
        </NavLink>
        <NavLink to="/tastings" className={navLinkClass}>
          Tasting Board
        </NavLink>
        {user ? (
          <>
            <span className="nav-bar__user">{user.username}</span>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>
              Log in
            </NavLink>
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
