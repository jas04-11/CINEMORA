import express from "express";
import { getStats } from "../controllers/adminController.js";
import { listAllBookings, markPaidAtCounter } from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/bookings", listAllBookings);
router.patch("/bookings/:id/mark-paid", markPaidAtCounter);

export default router;
