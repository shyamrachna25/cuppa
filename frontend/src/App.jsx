import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import BrewsPage from "./pages/BrewsPage.jsx";
import TastingsPage from "./pages/TastingsPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/brews"
            element={
              <ProtectedRoute>
                <BrewsPage />
              </ProtectedRoute>
            }
          />
          {/* Tasting Board is public to browse; posting/editing is checked server-side */}
          <Route path="/tastings" element={<TastingsPage />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
