import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const emptyForm = { movie: "", theater: "", screenName: "", showDate: "", showTime: "", price: "" };

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => api.get("/shows/admin/all").then((res) => setShows(res.data));

  useEffect(() => {
    load();
    api.get("/movies/admin/all").then((res) => setMovies(res.data));
    api.get("/theaters").then((res) => setTheaters(res.data));
  }, []);

  const selectedTheater = theaters.find((t) => t._id === form.theater);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/shows", {
        ...form,
        price: Number(form.price),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this show?")) return;
    await api.delete(`/shows/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-gold">Shows</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-panel p-5 sm:grid-cols-3">
        <select required value={form.movie} onChange={(e) => setForm({ ...form, movie: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream">
          <option value="">Select movie</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))}
        </select>
        <select required value={form.theater} onChange={(e) => setForm({ ...form, theater: e.target.value, screenName: "" })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream">
          <option value="">Select theater</option>
          {theaters.map((t) => (
            <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
          ))}
        </select>
        <select required value={form.screenName} onChange={(e) => setForm({ ...form, screenName: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" disabled={!selectedTheater}>
          <option value="">Select screen</option>
          {selectedTheater?.screens.map((s) => (
            <option key={s.screenName} value={s.screenName}>{s.screenName} ({s.rows}×{s.seatsPerRow})</option>
          ))}
        </select>
        <input required type="date" value={form.showDate} onChange={(e) => setForm({ ...form, showDate: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input required type="time" value={form.showTime} onChange={(e) => setForm({ ...form, showTime: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input required type="number" placeholder="Ticket price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />

        {error && <p className="text-sm text-crimson sm:col-span-3">{error}</p>}

        <button type="submit" className="focus-ring rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold/90 sm:col-span-3 sm:w-fit">
          Schedule show
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {shows.map((s) => (
          <div key={s._id} className="flex items-center justify-between rounded-xl border border-line bg-panel p-4">
            <div>
              <p className="font-semibold text-cream">{s.movie?.title}</p>
              <p className="text-xs text-muted">{s.theater?.name} · {s.screenName} · {s.showDate} {s.showTime} · ₹{s.price}</p>
            </div>
            <button onClick={() => handleDelete(s._id)} className="focus-ring rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-crimson hover:text-crimson">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageShows;
