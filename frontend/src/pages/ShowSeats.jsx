import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import SeatMap from "../components/SeatMap.jsx";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const ShowSeats = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [locking, setLocking] = useState(false);
  const socketRef = useRef(null);

  const fetchShow = useCallback(() => {
    return api.get(`/shows/${showId}`).then((res) => setShow(res.data));
  }, [showId]);

  useEffect(() => {
    fetchShow();

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.emit("joinShow", showId);
    socket.on("seatUpdate", () => fetchShow());

    return () => {
      socket.emit("leaveShow", showId);
      socket.disconnect();
    };
  }, [showId, fetchShow]);

  const toggleSeat = (seatNumber) => {
    setError("");
    setSelected((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleProceed = async () => {
    if (selected.length === 0) return;
    setLocking(true);
    setError("");
    try {
      const res = await api.post(`/shows/${showId}/seats/lock`, { seatNumbers: selected });
      navigate("/payment", {
        state: {
          showId,
          seatNumbers: selected,
          expiresAt: res.data.expiresAt,
          movieTitle: show?.movie?.title,
          theaterName: show?.theater?.name,
          showTime: show?.showTime,
          showDate: show?.showDate,
          price: show?.price,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not lock seat(s). They may already be taken - please pick again."
      );
      setSelected([]);
      fetchShow();
    } finally {
      setLocking(false);
    }
  };

  if (!show) return <p className="mx-auto max-w-4xl px-5 py-10 text-muted">Loading seat map...</p>;

  const total = selected.length * show.price;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link to={`/movies/${show.movie._id}`} className="text-sm text-muted hover:text-gold">
        &larr; Back to showtimes
      </Link>

      <div className="mt-4 mb-6 text-center">
        <h1 className="font-display text-3xl text-cream">{show.movie.title}</h1>
        <p className="text-sm text-muted">
          {show.theater.name} · {show.screenName} · {show.showDate} {show.showTime}
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-2 text-center text-sm text-crimson">
          {error}
        </p>
      )}

      <SeatMap
        seats={show.seats}
        selected={selected}
        onToggle={toggleSeat}
        currentUserId={user?._id}
      />

      <div className="sticky bottom-0 mt-8 flex items-center justify-between rounded-2xl border border-line bg-panel px-6 py-4">
        <div>
          <p className="text-xs text-muted">
            {selected.length} seat{selected.length !== 1 ? "s" : ""} selected
          </p>
          <p className="font-display text-2xl text-gold">₹{total}</p>
        </div>
        <button
          onClick={handleProceed}
          disabled={selected.length === 0 || locking}
          className="focus-ring rounded-full bg-gold px-6 py-2.5 font-semibold text-ink hover:bg-gold/90 disabled:opacity-50"
        >
          {locking ? "Locking seats..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default ShowSeats;
