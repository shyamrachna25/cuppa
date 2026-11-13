import bcrypt from "bcryptjs";
import { getDb, closeDb } from "../db/connection.js";
import { findByUsername, createUser } from "../db/users.js";
import { VALID_METHODS } from "../validation/brew.js";

const DEMO_USERNAME = "demo_brewer";
const DEMO_PASSWORD = "demo12345"; // for local/demo login only

// Defaults to 1200 for the real submission, but you can pass a smaller
// number while testing, e.g.: node --env-file=.env scripts/seedBrews.js 20
const RECORD_COUNT = Number(process.argv[2]) || 1200;

const BEAN_NAMES = [
  "Ethiopia Yirgacheffe",
  "Colombia Huila",
  "Guatemala Antigua",
  "Kenya AA",
  "Sumatra Mandheling",
  "Costa Rica Tarrazu",
  "Brazil Cerrado",
  "Honduras Marcala",
  "Rwanda Nyungwe",
  "Panama Geisha",
  "Peru Cajamarca",
  "Mexico Chiapas",
];

const ROASTERS = [
  "Counter Culture",
  "Stumptown",
  "Intelligentsia",
  "Blue Bottle",
  "George Howell",
  "Onyx Coffee Lab",
  "PT's Coffee",
  "Heart Coffee",
];

const ORIGINS = [
  "Ethiopia",
  "Colombia",
  "Guatemala",
  "Kenya",
  "Indonesia",
  "Costa Rica",
  "Brazil",
  "Honduras",
  "Rwanda",
  "Panama",
  "Peru",
  "Mexico",
];

const GRIND_SIZES = ["Coarse", "Medium-Coarse", "Medium", "Medium-Fine", "Fine"];

const TASTING_NOTES = [
  "Bright acidity with notes of blueberry and jasmine.",
  "Heavy body, dark chocolate and toasted walnut.",
  "Clean citrus finish, light floral aroma.",
  "Caramel sweetness with a hint of stone fruit.",
  "Earthy and full-bodied, slight spice on the finish.",
  "Juicy, almost wine-like, with red apple notes.",
  "Mellow and balanced, cocoa and brown sugar.",
  "Crisp and tea-like, delicate honey sweetness.",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinLastDays(days) {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * days) * 24 * 60 * 60 * 1000;
  return new Date(past).toISOString().slice(0, 10);
}

function buildSyntheticBrew(userId) {
  const method = randomFrom(VALID_METHODS);
  return {
    userId,
    beanName: `${randomFrom(ROASTERS)} ${randomFrom(BEAN_NAMES)}`,
    origin: randomFrom(ORIGINS),
    method,
    grindSize: randomFrom(GRIND_SIZES),
    ratio: `1:${15 + Math.floor(Math.random() * 4)}`,
    brewTime: `${1 + Math.floor(Math.random() * 4)}:${String(
      Math.floor(Math.random() * 60),
    ).padStart(2, "0")}`,
    waterTemp: 195 + Math.floor(Math.random() * 10),
    rating: 1 + Math.floor(Math.random() * 5),
    notes: randomFrom(TASTING_NOTES),
    date: randomDateWithinLastDays(180),
    createdAt: new Date(),
  };
}

async function seed() {
  const db = await getDb();

  let demoUser = await findByUsername(DEMO_USERNAME);
  if (!demoUser) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    demoUser = await createUser({ username: DEMO_USERNAME, passwordHash });
    console.log(`Created demo user "${DEMO_USERNAME}" (password: ${DEMO_PASSWORD})`);
  } else {
    console.log(`Demo user "${DEMO_USERNAME}" already exists — reusing it.`);
  }

  const demoUserId = demoUser._id.toString();
  const brews = db.collection("brews");

  // Idempotent: only clears this demo user's own previously-seeded brews,
  // never anyone else's real data.
  const deleted = await brews.deleteMany({ userId: demoUserId });
  console.log(`Cleared ${deleted.deletedCount} previously-seeded demo brews.`);

  const records = Array.from({ length: RECORD_COUNT }, () => buildSyntheticBrew(demoUserId));
  const result = await brews.insertMany(records);
  console.log(`Inserted ${result.insertedCount} synthetic brews for "${DEMO_USERNAME}".`);
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });