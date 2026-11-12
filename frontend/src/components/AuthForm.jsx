import React, { useState } from "react";
import PropTypes from "prop-types";

export default function AuthForm({ mode, onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(username, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>{mode === "login" ? "Log in" : "Create an account"}</h1>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      {error && (
        <p className="auth-form__error" role="status">
          {error}
        </p>
      )}

      <button type="submit">{mode === "login" ? "Log in" : "Register"}</button>
    </form>
  );
}

AuthForm.propTypes = {
  mode: PropTypes.oneOf(["login", "register"]).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
