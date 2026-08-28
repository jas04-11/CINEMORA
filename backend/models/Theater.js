import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    screens: [
      {
        screenName: { type: String, required: true },
        rows: { type: Number, required: true, default: 8 },
        seatsPerRow: { type: Number, required: true, default: 10 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Theater", theaterSchema);
