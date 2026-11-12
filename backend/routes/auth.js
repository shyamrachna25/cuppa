import express from "express";
import bcrypt from "bcryptjs";
import passport from "../auth/passportConfig.js";
import { findByUsername, createUser } from "../db/users.js";
import { validateRegistration } from "../validation/user.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const errors = validateRegistration({ username, password });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existing = await findByUsername(username.trim());
    if (existing) {
      return res.status(409).json({ errors: ["That username is already taken."] });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ username: username.trim(), passwordHash });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ errors: ["Registered, but login failed."] });
      return res.status(201).json({ username: user.username });
    });
  } catch (_err) {
    res.status(500).json({ errors: ["Something went wrong. Please try again."] });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ errors: [info?.message || "Login failed."] });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({ username: user.username });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out." });
  });
});

router.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ username: req.user.username });
  }
  res.status(401).json({ errors: ["Not logged in."] });
});

export default router;
