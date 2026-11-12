import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./auth/passportConfig.js";
import authRouter from "./routes/auth.js";
import brewsRouter from "./routes/brews.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/brews", brewsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static("../frontend/dist"));

app.listen(PORT, () => {
  console.log(`Cuppa server running on port ${PORT}`);
});
