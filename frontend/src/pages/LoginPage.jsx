import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(username, password) {
    await login(username, password);
    navigate("/");
  }

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}
