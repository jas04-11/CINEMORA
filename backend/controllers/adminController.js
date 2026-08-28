import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

// @route GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [movieCount, theaterCount, showCount, bookingCount, revenueAgg] = await Promise.all([
      Movie.countDocuments({ isActive: true }),
      Theater.countDocuments(),
      Show.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.aggregate([
        { $match: { status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      movieCount,
      theaterCount,
      showCount,
      bookingCount,
      totalRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};
