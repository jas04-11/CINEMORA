import cron from "node-cron";
import Show from "../models/Show.js";

// Runs every 30 seconds: releases any seat whose lock has expired and was
// never converted into a booking (Worksheet 3: "Transaction Time out ...
// seat will be available for another person ... without freezing the seat").
export const startSeatLockCleanup = () => {
  cron.schedule("*/30 * * * * *", async () => {
    try {
      const now = new Date();
      const result = await Show.updateMany(
        { "seats.status": "locked", "seats.lockExpiresAt": { $lt: now } },
        {
          $set: {
            "seats.$[s].status": "available",
            "seats.$[s].lockedBy": null,
            "seats.$[s].lockedAt": null,
            "seats.$[s].lockExpiresAt": null,
          },
        },
        { arrayFilters: [{ "s.status": "locked", "s.lockExpiresAt": { $lt: now } }] }
      );
      if (result.modifiedCount > 0) {
        console.log(`[seat-lock-cleanup] released expired locks in ${result.modifiedCount} show(s)`);
      }
    } catch (err) {
      console.error("[seat-lock-cleanup] error:", err.message);
    }
  });
};
