import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(username, password) {
    await register(username, password);
    navigate("/");
  }

  return <AuthForm mode="register" onSubmit={handleRegister} />;
}