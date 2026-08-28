import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import generateBookingCode from "../utils/generateCode.js";
import { streamReceiptPDF } from "../utils/generateReceiptPDF.js";
import { emitSeatUpdate } from "../utils/socket.js";

const PAYMENT_MODE = (process.env.PAYMENT_MODE || "PDF").toUpperCase(); // "CODE" (Act1) or "PDF" (Act2)

// @route GET /api/bookings/config  (public - lets the frontend know which
// of the two "Pay at Counter" behaviours from the worksheet is active)
export const getPaymentConfig = (req, res) => {
  res.json({ paymentMode: PAYMENT_MODE });
};

/**
 * @route POST /api/bookings
 * body: { showId, seatNumbers: [...] }
 *
 * This is the single "Pay at Counter" action. It only succeeds if every
 * requested seat is still locked by the current user and the lock has not
 * expired - otherwise the transaction is rejected and the seat(s) are freed
 * for other users, matching the worksheet's timeout/rejection behaviour.
 */
export const createBooking = async (req, res, next) => {
  try {
    const { showId, seatNumbers } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "seatNumbers array is required" });
    }

    const show = await Show.findById(showId)
      .populate("movie", "title")
      .populate("theater", "name");
    if (!show) return res.status(404).json({ message: "Show not found" });

    const now = new Date();
    const targetSeats = show.seats.filter((s) => seatNumbers.includes(s.seatNumber));

    if (targetSeats.length !== seatNumbers.length) {
      return res.status(400).json({ message: "One or more seats do not exist on this show" });
    }

    const invalid = targetSeats.find(
      (s) =>
        s.status !== "locked" ||
        String(s.lockedBy) !== String(userId) ||
        !s.lockExpiresAt ||
        s.lockExpiresAt < now
    );

    if (invalid) {
      // Release whatever this user did still hold, then send them back to
      // seat selection, per the worksheet's timeout/rejection flow.
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
      return res.status(409).json({
        message:
          "Transaction timed out or seat no longer available. Please try again - seat has been released for other users.",
      });
    }

    const amount = show.price * seatNumbers.length;
    const bookingCode = generateBookingCode();

    const booking = await Booking.create({
      user: userId,
      show: showId,
      seatNumbers,
      amount,
      bookingCode,
      paymentMode: PAYMENT_MODE,
    });

    // Freeze the seats permanently (Case 1: "transaction complete ... seat
    // frozen for another users permanently").
    await Show.updateOne(
      { _id: showId },
      {
        $set: {
          "seats.$[s].status": "booked",
          "seats.$[s].bookingId": booking._id,
          "seats.$[s].lockExpiresAt": null,
        },
      },
      { arrayFilters: [{ "s.seatNumber": { $in: seatNumbers } }] }
    );
    emitSeatUpdate(showId);

    res.status(201).json({
      message:
        PAYMENT_MODE === "CODE"
          ? "The seat is booked. You can show/provide the below code at the counter to pay and get ticket."
          : "Receipt generated. Show this receipt at the counter to pay and get the ticket.",
      booking: {
        _id: booking._id,
        bookingCode: booking.bookingCode,
        seatNumbers: booking.seatNumbers,
        amount: booking.amount,
        paymentMode: booking.paymentMode,
        movieTitle: show.movie.title,
        theaterName: show.theater.name,
        screenName: show.screenName,
        showDate: show.showDate,
        showTime: show.showTime,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/bookings/mine
export const myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title posterUrl" },
          { path: "theater", select: "name city" },
        ],
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/bookings/:id
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "show",
      populate: [
        { path: "movie", select: "title posterUrl" },
        { path: "theater", select: "name city" },
      ],
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      String(booking.user) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/bookings/:id/receipt  (Act 2 - PDF receipt download)
export const downloadReceipt = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name" },
        ],
      });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      String(booking.user._id) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    streamReceiptPDF(res, {
      bookingCode: booking.bookingCode,
      seatNumbers: booking.seatNumbers,
      amount: booking.amount,
      movieTitle: booking.show.movie.title,
      theaterName: booking.show.theater.name,
      screenName: booking.show.screenName,
      showDate: booking.show.showDate,
      showTime: booking.show.showTime,
      userName: booking.user.name,
    });
  } catch (err) {
    next(err);
  }
};

// ----- Admin -----

// @route GET /api/admin/bookings
export const listAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "show",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/admin/bookings/:id/mark-paid
export const markPaidAtCounter = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paidAtCounter: true },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};
