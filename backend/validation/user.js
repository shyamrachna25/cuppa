export function validateRegistration({ username, password }) {
  const errors = [];

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters.");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return errors;
}
