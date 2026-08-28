import mongoose from "mongoose";
import Show from "../models/Show.js";
import { emitSeatUpdate } from "../utils/socket.js";

const WINDOW_MIN = Number(process.env.TRANSACTION_WINDOW_MINUTES || 15);

/**
 * @route POST /api/shows/:showId/seats/lock
 * body: { seatNumbers: ["A1","A2"] }
 *
 * Atomically locks the requested seats for the current user for the
 * transaction window. Uses a single conditional findOneAndUpdate per seat
 * so that if two users click the same seat "at the same hmmss" (Case 3),
 * MongoDB's per-document atomicity guarantees only one request can match
 * status:"available" - the loser gets an explicit "already booked/locked"
 * error and is sent back to seat selection (per the worksheet).
 */
export const lockSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const { seatNumbers } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "seatNumbers array is required" });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + WINDOW_MIN * 60 * 1000);

    // First, release any locks (by anyone) that have already expired, so
    // stale locks never block a fresh attempt (worksheet: "seat will be
    // available for another person at the same time without freezing").
    await Show.updateOne(
      { _id: showId },
      {
        $set: {
          "seats.$[expired].status": "available",
          "seats.$[expired].lockedBy": null,
          "seats.$[expired].lockedAt": null,
          "seats.$[expired].lockExpiresAt": null,
        },
      },
      {
        arrayFilters: [
          { "expired.status": "locked", "expired.lockExpiresAt": { $lt: now } },
        ],
      }
    );

    const failed = [];
    for (const seatNumber of seatNumbers) {
      // Condition: seat is available, OR it's already locked by this same
      // user (idempotent re-lock, e.g. on page refresh within the window).
      const result = await Show.findOneAndUpdate(
        {
          _id: showId,
          seats: {
            $elemMatch: {
              seatNumber,
              $or: [{ status: "available" }, { status: "locked", lockedBy: userId }],
            },
          },
        },
        {
          $set: {
            "seats.$[s].status": "locked",
            "seats.$[s].lockedBy": userId,
            "seats.$[s].lockedAt": now,
            "seats.$[s].lockExpiresAt": expiresAt,
          },
        },
        {
          arrayFilters: [{ "s.seatNumber": seatNumber }],
          new: true,
        }
      );

      if (!result) failed.push(seatNumber);
    }

    if (failed.length > 0) {
      return res.status(409).json({
        message:
          "Transaction cancelled: seat(s) already booked or locked by another user. Please select any other seat.",
        seats: failed,
      });
    }

    emitSeatUpdate(showId);
    const show = await Show.findById(showId).select("seats");
    res.json({
      message: "Seat(s) locked",
      expiresAt,
      windowMinutes: WINDOW_MIN,
      seats: show.seats.filter((s) => seatNumbers.includes(s.seatNumber)),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route POST /api/shows/:showId/seats/unlock
 * body: { seatNumbers: ["A1","A2"] }
 * Explicit release - used when the user cancels/goes back, or the frontend
 * countdown hits zero client-side and calls this to release immediately
 * instead of waiting for the cron sweep.
 */
export const unlockSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const { seatNumbers } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "seatNumbers array is required" });
    }

    await Show.updateOne(
      { _id: showId },
      {
        $set: {
          "seats.$[s].status": "available",
          "seats.$[s].lockedBy": null,
          "seats.$[s].lockedAt": null,
          "seats.$[s].lockExpiresAt": null,
        },
      },
      {
        arrayFilters: [
          { "s.seatNumber": { $in: seatNumbers }, "s.lockedBy": userId, "s.status": "locked" },
        ],
      }
    );

    emitSeatUpdate(showId);
    res.json({ message: "Transaction cancelled, seat(s) released for other users" });
  } catch (err) {
    next(err);
  }
};
