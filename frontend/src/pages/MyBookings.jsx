import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookings/mine")
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (booking) => {
    const res = await api.get(`/bookings/${booking._id}/receipt`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${booking.bookingCode}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl text-gold">My bookings</h1>

      {loading ? (
        <p className="mt-6 text-muted">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 text-muted">No bookings yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-2xl border border-line bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-cream">{b.show?.movie?.title}</h3>
                  <p className="text-xs text-muted">
                    {b.show?.theater?.name} · {b.show?.screenName} · {b.show?.showDate}{" "}
                    {b.show?.showTime}
                  </p>
                  <p className="mt-2 text-sm text-cream/90">Seats: {b.seatNumbers.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl text-crimson">{b.bookingCode}</p>
                  <p className="text-xs text-muted">₹{b.amount}</p>
                  <p
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                      b.paidAtCounter
                        ? "bg-mint/15 text-mint"
                        : "bg-gold/15 text-gold"
                    }`}
                  >
                    {b.paidAtCounter ? "Paid" : "Pay at counter"}
                  </p>
                </div>
              </div>
              {b.paymentMode === "PDF" && (
                <button
                  onClick={() => handleDownload(b)}
                  className="focus-ring mt-3 rounded-full border border-line px-4 py-1.5 text-xs text-cream hover:border-gold hover:text-gold"
                >
                  Download receipt
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
