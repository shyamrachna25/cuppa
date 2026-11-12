import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>Cuppa</h1>
      <p>Log your brews, discover your next favorite bag of beans.</p>
      {user ? (
        <p>Welcome back, {user.username}.</p>
      ) : (
        <p>Log in or register to start logging your brews.</p>
      )}
    </div>
  );
}
