import mongoose from "mongoose";

// Each seat tracks its own lock lifecycle so we can implement Worksheet 3's
// three concurrency cases atomically at the database level.
const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true }, // e.g. "A1"
    row: { type: String, required: true },
    col: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "locked", "booked"],
      default: "available",
    },
    lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    lockedAt: { type: Date, default: null },
    lockExpiresAt: { type: Date, default: null },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    screenName: { type: String, required: true },
    showDate: { type: String, required: true }, // "YYYY-MM-DD"
    showTime: { type: String, required: true }, // "HH:mm"
    price: { type: Number, required: true },
    seats: [seatSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

showSchema.index({ movie: 1, theater: 1, showDate: 1 });

export default mongoose.model("Show", showSchema);
