import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get("/movies", { params: search ? { search } : {} })
        .then((res) => setMovies(res.data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <section className="mb-10 rounded-3xl border border-line bg-gradient-to-br from-panel to-panel2 px-8 py-12 text-center">
        <p className="mb-2 text-xs tracking-[0.4em] text-gold uppercase">Now Booking</p>
        <h1 className="font-display text-5xl leading-tight text-cream sm:text-6xl">
          Grab your seats. <span className="text-gold">Skip the queue.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Pick a movie, lock your seats, and pay at the counter with a code or a
          printable receipt.
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="focus-ring mx-auto mt-6 block w-full max-w-sm rounded-full border border-line bg-ink px-5 py-2.5 text-sm text-cream placeholder:text-muted"
        />
      </section>

      {loading ? (
        <p className="text-center text-muted">Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-muted">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movies/${movie._id}`}
              className="group overflow-hidden rounded-2xl border border-line bg-panel transition-transform hover:-translate-y-1"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-panel2">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">
                    No poster
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="truncate font-semibold text-cream">{movie.title}</h3>
                <p className="mt-1 text-xs text-muted">
                  {movie.genre?.join(", ")} · {movie.durationMinutes} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
