import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { findByUsername, findById } from "../db/users.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username or password." });
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return done(null, false, { message: "Incorrect username or password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
