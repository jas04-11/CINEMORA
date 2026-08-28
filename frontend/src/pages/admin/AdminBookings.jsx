import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const load = () => api.get("/admin/bookings").then((res) => setBookings(res.data));
  useEffect(() => {
    load();
  }, []);

  const markPaid = async (id) => {
    await api.patch(`/admin/bookings/${id}/mark-paid`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-gold">Bookings</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel2 text-muted">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Movie</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-line">
                <td className="px-4 py-3 font-mono text-gold">{b.bookingCode}</td>
                <td className="px-4 py-3 text-cream">{b.show?.movie?.title}</td>
                <td className="px-4 py-3 text-cream">{b.seatNumbers.join(", ")}</td>
                <td className="px-4 py-3 text-muted">{b.user?.name}</td>
                <td className="px-4 py-3 text-cream">₹{b.amount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${b.paidAtCounter ? "bg-mint/15 text-mint" : "bg-gold/15 text-gold"}`}>
                    {b.paidAtCounter ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!b.paidAtCounter && (
                    <button onClick={() => markPaid(b._id)} className="focus-ring rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-mint hover:text-mint">
                      Mark paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
