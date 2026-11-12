import express from "express";
import {
  findBrewsByUser,
  findBestBrew,
  findBrewById,
  createBrew,
  updateBrew,
  deleteBrew,
} from "../db/brews.js";
import { validateBrew } from "../validation/brew.js";

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ errors: ["You must be logged in."] });
  }
  next();
}

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const { method, start, end } = req.query;
    const brews = await findBrewsByUser(req.user._id.toString(), { method, start, end });
    res.json(brews);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not load brews."] });
  }
});

router.get("/best", async (req, res) => {
  try {
    const best = await findBestBrew(req.user._id.toString());
    res.json(best || null);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not load your best brew."] });
  }
});

router.post("/", async (req, res) => {
  const errors = validateBrew(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const brew = await createBrew(req.user._id.toString(), req.body);
    res.status(201).json(brew);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not save brew."] });
  }
});

router.put("/:id", async (req, res) => {
  const errors = validateBrew(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const existing = await findBrewById(req.params.id);
    if (!existing || existing.userId !== req.user._id.toString()) {
      return res.status(404).json({ errors: ["Brew not found."] });
    }

    const updated = await updateBrew(req.params.id, req.user._id.toString(), req.body);
    res.json(updated);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not update brew."] });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteBrew(req.params.id, req.user._id.toString());
    if (!deleted) return res.status(404).json({ errors: ["Brew not found."] });
    res.json({ message: "Deleted." });
  } catch (_err) {
    res.status(500).json({ errors: ["Could not delete brew."] });
  }
});

export default router;
