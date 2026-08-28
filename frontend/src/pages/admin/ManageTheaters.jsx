import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const emptyForm = { name: "", city: "", address: "", screenName: "Screen 1", rows: 8, seatsPerRow: 10 };

const ManageTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => api.get("/theaters").then((res) => setTheaters(res.data));
  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/theaters", {
        name: form.name,
        city: form.city,
        address: form.address,
        screens: [{ screenName: form.screenName, rows: Number(form.rows), seatsPerRow: Number(form.seatsPerRow) }],
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleAddScreen = async (theater) => {
    const screenName = prompt("New screen name", `Screen ${theater.screens.length + 1}`);
    if (!screenName) return;
    const rows = Number(prompt("Rows", "8")) || 8;
    const seatsPerRow = Number(prompt("Seats per row", "10")) || 10;
    await api.put(`/theaters/${theater._id}`, {
      screens: [...theater.screens, { screenName, rows, seatsPerRow }],
    });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this theater?")) return;
    await api.delete(`/theaters/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-gold">Theaters</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-panel p-5 sm:grid-cols-3">
        <input required placeholder="Theater name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input placeholder="First screen name" value={form.screenName} onChange={(e) => setForm({ ...form, screenName: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input type="number" placeholder="Rows" value={form.rows} onChange={(e) => setForm({ ...form, rows: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input type="number" placeholder="Seats per row" value={form.seatsPerRow} onChange={(e) => setForm({ ...form, seatsPerRow: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />

        {error && <p className="text-sm text-crimson sm:col-span-3">{error}</p>}

        <button type="submit" className="focus-ring rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold/90 sm:col-span-3 sm:w-fit">
          Add theater
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {theaters.map((t) => (
          <div key={t._id} className="rounded-xl border border-line bg-panel p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-cream">{t.name}</p>
                <p className="text-xs text-muted">{t.city} · {t.address}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAddScreen(t)} className="focus-ring rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-gold hover:text-gold">+ Screen</button>
                <button onClick={() => handleDelete(t._id)} className="focus-ring rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-crimson hover:text-crimson">Remove</button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {t.screens.map((s) => (
                <span key={s.screenName} className="rounded-full bg-panel2 px-3 py-1 text-xs text-muted">
                  {s.screenName} · {s.rows}×{s.seatsPerRow}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTheaters;
