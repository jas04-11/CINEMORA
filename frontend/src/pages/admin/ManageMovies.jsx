import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const emptyForm = {
  title: "",
  description: "",
  posterUrl: "",
  genre: "",
  language: "English",
  durationMinutes: "",
  rating: "",
};

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/movies/admin/all").then((res) => setMovies(res.data));
  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      genre: form.genre.split(",").map((g) => g.trim()).filter(Boolean),
      durationMinutes: Number(form.durationMinutes),
      rating: form.rating ? Number(form.rating) : 0,
    };
    try {
      if (editingId) {
        await api.put(`/movies/${editingId}`, payload);
      } else {
        await api.post("/movies", payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);
    setForm({
      title: movie.title,
      description: movie.description,
      posterUrl: movie.posterUrl || "",
      genre: (movie.genre || []).join(", "),
      language: movie.language || "English",
      durationMinutes: movie.durationMinutes,
      rating: movie.rating || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this movie?")) return;
    await api.delete(`/movies/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-gold">Movies</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-panel p-5 sm:grid-cols-2">
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream sm:col-span-2" />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream sm:col-span-2" rows={3} />
        <input placeholder="Poster URL" value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream sm:col-span-2" />
        <input placeholder="Genres, comma separated" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input placeholder="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input required type="number" placeholder="Duration (minutes)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />
        <input type="number" step="0.1" placeholder="Rating (0-10)" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="focus-ring rounded-lg border border-line bg-panel2 px-3 py-2 text-sm text-cream" />

        {error && <p className="text-sm text-crimson sm:col-span-2">{error}</p>}

        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className="focus-ring rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold/90">
            {editingId ? "Update movie" : "Add movie"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="focus-ring rounded-full border border-line px-5 py-2 text-sm text-cream">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {movies.map((m) => (
          <div key={m._id} className="flex items-center justify-between rounded-xl border border-line bg-panel p-4">
            <div>
              <p className="font-semibold text-cream">{m.title}</p>
              <p className="text-xs text-muted">{m.genre?.join(", ")} · {m.durationMinutes} min {!m.isActive && "· (inactive)"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(m)} className="focus-ring rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-gold hover:text-gold">Edit</button>
              <button onClick={() => handleDelete(m._id)} className="focus-ring rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-crimson hover:text-crimson">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMovies;
