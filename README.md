# Cuppa - Coffee Brew Log & Tasting Board

Cuppa helps home brewers improve their coffee and find beans worth buying.
It has two independent features: a private **Brew Log** and a public
**Tasting Board**.

## Author

- Sree Rachnae Shyam
- Sai Venkatesh Varun Muruganandam Murali Krishnan

## Class Link

[CS5610 Web Development — add the course link here]

## Project Status

- **Shared authentication** (Passport, sessions) — built
- **Brew Log** (Rachna's feature) — complete
- **Tasting Board** (Sai's feature) — in progress
- **Deployment link** — to be added once deployed
- **Screenshots** — to be added before final submission

This README currently documents the Brew Log side in full. Sai will
extend this file with the Tasting Board section, the live deployment
link, and final submission details.

---

## Tech Stack

- **Frontend:** React 18 (with Hooks), built with Vite, React Router,
  PropTypes, Fetch API
- **Backend:** Node.js, Express (ES modules)
- **Authentication:** Passport (local strategy), `express-session`,
  sessions stored in MongoDB via `connect-mongo`, passwords hashed with
  `bcryptjs`
- **Database:** MongoDB, native Node.js driver (no Mongoose)
- Separate `package.json` files for `backend/` and `frontend/`
- No Axios, no CORS package — Express serves the built React app directly

---

## Setup / Instructions to Build

### Backend

```
cd backend
npm install
```

Create a `.env` file in `backend/` (never committed):

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/cuppa?retryWrites=true&w=majority
SESSION_SECRET=<any long random string>
```

Run it:

```
node --env-file=.env server.js
```

### Frontend

```
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`, proxying `/api` requests to the backend
on port 3000 during local development.

---

## Authentication

Passport local strategy with sessions stored in MongoDB (`connect-mongo`),
so logins persist across server restarts and page refreshes. Passwords
are hashed with `bcryptjs` — never stored in plain text.

| Endpoint             | Method | Description                                    |
| -------------------- | ------ | ---------------------------------------------- |
| `/api/auth/register` | POST   | Create an account, logs in immediately         |
| `/api/auth/login`    | POST   | Log in                                         |
| `/api/auth/logout`   | POST   | Log out                                        |
| `/api/auth/session`  | GET    | Check whether the current session is logged in |

Every authenticated request has `req.user` available server-side
(`req.user._id`, `req.user.username`).

---

## Brew Log (Rachna's feature)

A private, per-user log of coffee brews. Only the logged-in user can see
or modify their own brews — enforced server-side on every route, not just
hidden in the UI.

### Features

- Create, edit, and delete brew entries: bean/roaster, origin, brew
  method, grind size, ratio, brew time, water temperature, rating (1-5),
  tasting notes, and date
- Filter the log by brew method and/or a date range
- A "Best Brew" banner automatically surfaces the single highest-rated
  entry, and updates immediately after any save or delete
- Ratings are shown and entered as coffee-cup icons rather than generic
  stars, with click-to-rate and hover preview in the logging form

### Data model

```js
// brews collection
{
  (_id,
    userId, // string form of the owning user's ObjectId
    beanName, // required
    origin, // optional
    method, // one of: Pour Over, French Press, Espresso,
    // AeroPress, Cold Brew, Other
    grindSize,
    ratio, // e.g. "1:16"
    brewTime, // e.g. "3:30"
    waterTemp, // number, °F
    rating, // 1-5, required
    notes,
    date, // required
    createdAt);
}
```

### API

All brew routes require login.

| Endpoint                         | Method | Description                                          |
| -------------------------------- | ------ | ---------------------------------------------------- |
| `/api/brews?method=&start=&end=` | GET    | List the logged-in user's brews, optionally filtered |
| `/api/brews/best`                | GET    | The logged-in user's single highest-rated brew       |
| `/api/brews`                     | POST   | Create a brew                                        |
| `/api/brews/:id`                 | PUT    | Update a brew (only if you own it)                   |
| `/api/brews/:id`                 | DELETE | Delete a brew (only if you own it)                   |

### Seed script

```
cd backend
node --env-file=.env scripts/seedBrews.js [count]
```

- Creates a demo account (`demo_brewer` / `demo12345`) if it doesn't
  already exist
- Generates `count` synthetic brews (defaults to 1200 if no count is
  given) for that demo account only
- **Idempotent and safe to re-run** — it only ever clears and replaces
  the demo account's own previously-seeded brews, never any other user's
  real data

---

## Frontend structure (Brew Log side)

```
frontend/src/
├── components/
│   ├── BestBrewBanner.jsx   — the hero "best brew" display
│   ├── BrewCard.jsx         — one logged brew, ticket-style
│   ├── BrewFilterBar.jsx    — method + date range filters
│   ├── BrewForm.jsx         — create/edit form
│   ├── CupRating.jsx        — coffee-cup rating, display or interactive
│   ├── NavBar.jsx           — shared nav (used by both features)
│   ├── AuthForm.jsx         — shared login/register form
│   └── ProtectedRoute.jsx   — shared login-required route guard
├── constants/
│   └── brewMethods.js       — method list + method→color mapping
├── context/
│   └── AuthContext.jsx      — shared session state
└── pages/
    ├── HomePage.jsx
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    └── BrewsPage.jsx        — the Brew Log page itself
```

Color palette and shared conventions are documented in `HANDOFF.md`, for
whoever is extending this with the Tasting Board.

---

## Use of GenAI Tools

Used Claude (Anthropic) for planning, debugging, and implementation
assistance on the authentication system, Brew Log feature, UI styling,
and this documentation. Sai will disclose his own usage for the Tasting
Board in this same section.

---

## License

MIT — see [LICENSE](./LICENSE)
