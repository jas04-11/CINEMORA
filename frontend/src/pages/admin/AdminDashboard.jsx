import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  const cards = stats
    ? [
        { label: "Active movies", value: stats.movieCount },
        { label: "Theaters", value: stats.theaterCount },
        { label: "Active shows", value: stats.showCount },
        { label: "Confirmed bookings", value: stats.bookingCount },
        { label: "Total revenue", value: `₹${stats.totalRevenue}` },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-gold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-xs text-muted">{c.label}</p>
            <p className="mt-1 font-display text-3xl text-cream">{c.value}</p>
          </div>
        ))}
        {!stats && <p className="text-muted">Loading stats...</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
