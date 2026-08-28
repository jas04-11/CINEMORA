import express from "express";
import {
  listTheaters,
  getTheater,
  createTheater,
  updateTheater,
  deleteTheater,
} from "../controllers/theaterController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listTheaters);
router.get("/:id", getTheater);
router.post("/", protect, adminOnly, createTheater);
router.put("/:id", protect, adminOnly, updateTheater);
router.delete("/:id", protect, adminOnly, deleteTheater);

export default router;
