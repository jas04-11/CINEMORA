import express from "express";
import {
  listMovies,
  getMovie,
  listAllMoviesAdmin,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listMovies);
router.get("/admin/all", protect, adminOnly, listAllMoviesAdmin);
router.get("/:id", getMovie);
router.post("/", protect, adminOnly, createMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
