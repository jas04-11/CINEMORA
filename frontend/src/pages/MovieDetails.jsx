import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/movies/${id}`), api.get("/shows", { params: { movie: id } })])
      .then(([movieRes, showsRes]) => {
        setMovie(movieRes.data);
        setShows(showsRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const grouped = shows.reduce((acc, show) => {
    const key = show.theater?._id || "unknown";
    acc[key] = acc[key] || { theater: show.theater, items: [] };
    acc[key].items.push(show);
    return acc;
  }, {});

  const handlePick = (showId) => {
    if (!user) {
      navigate("/login", { state: { from: `/shows/${showId}/seats` } });
      return;
    }
    navigate(`/shows/${showId}/seats`);
  };

  if (loading) return <p className="mx-auto max-w-4xl px-5 py-10 text-muted">Loading...</p>;
  if (!movie) return <p className="mx-auto max-w-4xl px-5 py-10 text-muted">Movie not found.</p>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link to="/" className="text-sm text-muted hover:text-gold">
        &larr; Back to movies
      </Link>

      <div className="mt-4 flex flex-col gap-8 sm:flex-row">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-72 w-52 flex-none rounded-xl border border-line object-cover"
        />
        <div>
          <h1 className="font-display text-4xl text-cream">{movie.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {movie.genre?.join(", ")} · {movie.language} · {movie.durationMinutes} min
            {movie.rating ? ` · ★ ${movie.rating}` : ""}
          </p>
          <p className="mt-4 text-cream/90">{movie.description}</p>
        </div>
      </div>

      <h2 className="mt-10 mb-4 font-display text-2xl text-gold">Showtimes</h2>
      {Object.keys(grouped).length === 0 ? (
        <p className="text-muted">No shows scheduled right now.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.values(grouped).map(({ theater, items }) => (
            <div key={theater?._id} className="rounded-2xl border border-line bg-panel p-5">
              <h3 className="font-semibold text-cream">{theater?.name}</h3>
              <p className="text-xs text-muted">{theater?.city}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((show) => (
                  <button
                    key={show._id}
                    onClick={() => handlePick(show._id)}
                    className="focus-ring rounded-lg border border-line bg-panel2 px-4 py-2 text-sm text-cream hover:border-gold hover:text-gold"
                  >
                    {show.showTime}
                    <span className="ml-2 text-xs text-muted">₹{show.price}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
