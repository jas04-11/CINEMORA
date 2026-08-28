import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seatNumbers: [{ type: String, required: true }],
    amount: { type: Number, required: true },
    bookingCode: { type: String, required: true, unique: true }, // random code shown/printed
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    paymentMode: { type: String, enum: ["CODE", "PDF"], required: true },
    paidAtCounter: { type: Boolean, default: false }, // admin marks true once counter payment collected
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
