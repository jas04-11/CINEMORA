import express from "express";
import {
  getPaymentConfig,
  createBooking,
  myBookings,
  getBooking,
  downloadReceipt,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/config", getPaymentConfig);
router.post("/", protect, createBooking);
router.get("/mine", protect, myBookings);
router.get("/:id", protect, getBooking);
router.get("/:id/receipt", protect, downloadReceipt);

export default router;
