import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    posterUrl: { type: String, default: "" },
    genre: [{ type: String }],
    language: { type: String, default: "English" },
    durationMinutes: { type: Number, required: true },
    releaseDate: { type: Date },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
