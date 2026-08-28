import express from "express";
import {
  listShows,
  getShow,
  createShow,
  updateShow,
  deleteShow,
  listShowsAdmin,
} from "../controllers/showController.js";
import { lockSeats, unlockSeats } from "../controllers/seatController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listShows);
router.get("/admin/all", protect, adminOnly, listShowsAdmin);
router.get("/:id", getShow);
router.post("/", protect, adminOnly, createShow);
router.put("/:id", protect, adminOnly, updateShow);
router.delete("/:id", protect, adminOnly, deleteShow);

// Seat transaction endpoints
router.post("/:showId/seats/lock", protect, lockSeats);
router.post("/:showId/seats/unlock", protect, unlockSeats);

export default router;
