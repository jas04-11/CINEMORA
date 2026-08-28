import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  if (!state?.booking) {
    navigate("/", { replace: true });
    return null;
  }

  const { booking, message } = state;
  const isPdfMode = booking.paymentMode === "PDF";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/bookings/${booking._id}/receipt`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${booking.bookingCode}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint/15 text-3xl text-mint">
        ✓
      </div>
      <h1 className="font-display text-3xl text-cream">Booking confirmed</h1>
      <p className="mt-1 text-sm text-muted">{message}</p>

      <div className="ticket-perforation mt-8 w-full rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-display text-xl text-gold">{booking.movieTitle}</h2>
        <p className="mt-1 text-xs text-muted">
          {booking.theaterName} · {booking.screenName}
        </p>
        <p className="text-xs text-muted">
          {booking.showDate} · {booking.showTime}
        </p>

        <div className="my-4 border-t border-dashed border-line" />

        <div className="flex justify-between text-sm">
          <span className="text-muted">Seats</span>
          <span className="text-cream">{booking.seatNumbers.join(", ")}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted">Amount</span>
          <span className="text-cream">₹{booking.amount}</span>
        </div>

        <div className="my-4 border-t border-dashed border-line" />

        <p className="text-xs text-muted uppercase tracking-[0.2em]">Booking code</p>
        <p className="mt-1 font-display text-3xl tracking-wider text-crimson">
          {booking.bookingCode}
        </p>
      </div>

      {isPdfMode && (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="focus-ring mt-6 w-full rounded-full bg-gold py-3 font-semibold text-ink hover:bg-gold/90 disabled:opacity-60"
        >
          {downloading ? "Preparing receipt..." : "Download receipt PDF"}
        </button>
      )}

      <p className="mt-6 text-xs text-muted">
        Show this {isPdfMode ? "receipt" : "code"} at the counter to pay and collect your ticket.
      </p>

      <Link to="/my-bookings" className="mt-6 text-sm text-gold hover:underline">
        View my bookings
      </Link>
    </div>
  );
};

export default BookingConfirmation;
