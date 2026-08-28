import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import CountdownTimer from "../components/CountdownTimer.jsx";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);

  if (!state) {
    navigate("/", { replace: true });
    return null;
  }

  const { showId, seatNumbers, expiresAt, movieTitle, theaterName, showTime, showDate, price } =
    state;

  const releaseAndReturn = useCallback(
    async (message) => {
      try {
        await api.post(`/shows/${showId}/seats/unlock`, { seatNumbers });
      } catch {
        // best-effort release; the server-side cron will clean it up regardless
      }
      navigate(`/shows/${showId}/seats`, { replace: true, state: { message } });
    },
    [showId, seatNumbers, navigate]
  );

  const handleExpire = () => {
    setExpired(true);
    releaseAndReturn(
      "Transaction timed out. The seat was released - please try again."
    );
  };

  const handleCancel = () => {
    releaseAndReturn("Transaction cancelled - seat is available again.");
  };

  const handlePay = async () => {
    setPaying(true);
    setError("");
    try {
      const res = await api.post("/bookings", { showId, seatNumbers });
      navigate("/booking-confirmation", { state: { booking: res.data.booking, message: res.data.message } });
    } catch (err) {
      setError(err.response?.data?.message || "Payment could not be completed.");
      if (err.response?.status === 409) {
        setTimeout(() => navigate(`/shows/${showId}/seats`, { replace: true }), 2000);
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-10 text-center">
      <p className="text-xs tracking-[0.3em] text-muted uppercase">Complete your booking</p>
      <h1 className="mt-2 font-display text-3xl text-cream">{movieTitle}</h1>
      <p className="mt-1 text-sm text-muted">
        {theaterName} · {showDate} {showTime}
      </p>

      <div className="mt-6">
        <CountdownTimer expiresAt={expiresAt} onExpire={handleExpire} />
      </div>

      <div className="mt-8 w-full rounded-2xl border border-line bg-panel p-6">
        <p className="text-sm text-muted">Seats</p>
        <p className="mt-1 font-display text-xl text-gold">{seatNumbers.join(", ")}</p>
        <div className="my-4 border-t border-dashed border-line" />
        <p className="text-sm text-muted">Amount payable at counter</p>
        <p className="mt-1 font-display text-3xl text-cream">
          ₹{price * seatNumbers.length}
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-2 text-sm text-crimson">
          {error}
        </p>
      )}

      <div className="mt-8 flex w-full gap-3">
        <button
          onClick={handleCancel}
          disabled={paying || expired}
          className="focus-ring flex-1 rounded-full border border-line py-3 text-sm text-cream hover:border-crimson hover:text-crimson disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePay}
          disabled={paying || expired}
          className="focus-ring flex-[2] rounded-full bg-gold py-3 font-semibold text-ink hover:bg-gold/90 disabled:opacity-50"
        >
          {paying ? "Processing..." : "Pay at Counter"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
