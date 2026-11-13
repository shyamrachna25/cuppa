# Handoff Notes — Brew Log → Tasting Board

Quick reference for adding the Tasting Board without touching the Brew Log.

## Running locally

```
# Terminal 1
cd backend
npm install
node --env-file=.env server.js

# Terminal 2
cd frontend
npm install
npm run dev
```

Your own `.env` (in `backend/`, never committed) needs:

```
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=any long random string
```

## Auth — already built, just use it

Every route you add should check `req.isAuthenticated()` the same way
`routes/brews.js` does, via a small middleware at the top of your router
file:

```js
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ errors: ["You must be logged in."] });
  }
  next();
}
```

Apply it with `router.use(requireAuth)` — but only on routes that actually
need login. Per the proposal, **anyone can browse the Tasting Board**
without logging in, so only apply `requireAuth` to your create/edit/delete
routes, not your GET/browse routes.

The logged-in user is available as `req.user` on any authenticated
request — `req.user._id` (a MongoDB ObjectId) and `req.user.username` are
what you'll want for ownership checks (e.g., only the review's author can
edit/delete it — see `routes/brews.js` for the exact pattern, since Brews
does the same "author can only touch their own records" check).

## Session response format

The frontend's `AuthContext` expects these exact shapes from `/api/auth/*`:

- Success: `{ username: "..." }`
- Failure: `{ errors: ["some message"] }`

Keep your own routes' error responses in this same `{ errors: [...] }`
array shape — the frontend's existing error-display pattern (see
`BrewForm.jsx`'s `catch (err) { setError(err.message) }`) assumes it.

## MongoDB connection convention

Always import `getDb` from `db/connection.js` — never create your own
`MongoClient`. This keeps the whole app on one shared connection.

```js
import { getDb } from "../db/connection.js";

async function tastingsCollection() {
  const db = await getDb();
  return db.collection("tastings");
}
```

Note the function name is `getDb()` / `closeDb()` — lowercase `b` in `Db`,
consistently, everywhere. (This tripped us up on a different project
before, so it's deliberately consistent here.)

## API response patterns to match

- Success on GET: return the data directly (an array or object), not wrapped
- Success on POST/PUT: return the created/updated document
- Validation errors: `400` with `{ errors: [...] }`
- Not found / wrong owner: `404` with `{ errors: [...] }`
- Not logged in: `401` with `{ errors: [...] }`

## Frontend styling conventions

- Color variables are all in `frontend/src/index.css`'s `:root` block —
  reuse `var(--color-espresso)`, `var(--color-caramel)`, etc. rather than
  hardcoding new hex values, so the Tasting Board visually matches the
  Brew Log.
- Component class names follow `component-name__part` (e.g.
  `brew-card__heading`) — keep that same pattern for your own components
  (e.g. `tasting-card__heading`).
- `CupRating.jsx` (coffee-cup icons instead of stars) is reusable as-is
  for displaying ratings/averages on the Tasting Board — no need to build
  a second rating component.

## Adding your routes

1. Create `backend/db/tastings.js`, `backend/validation/tasting.js`,
   `backend/routes/tastings.js` — same structure as the matching `brews`
   files.
2. In `backend/server.js`, add your import and mount line where the
   comment already marks the spot:
   ```js
   import tastingsRouter from "./routes/tastings.js";
   app.use("/api/tastings", tastingsRouter);
   ```
3. Build out `frontend/src/pages/TastingsPage.jsx` (currently a
   placeholder) the same way `BrewsPage.jsx` is built — fetch on mount,
   a form component, a list of card components.
4. Your own seed script: `backend/scripts/seedTastings.js`, following the
   same idempotent, demo-user-scoped pattern as `scripts/seedBrews.js` —
   never touch real user data, only ever reset data tied to your own demo
   account.

None of this requires modifying any Brew Log file.
